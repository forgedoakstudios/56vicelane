# Blotato video pipeline — root cause + fix (2026-07-28)

Chris's stated priority for this session: "tomorrow we fix Blotato." No
extra prompt/context was pasted, so this was diagnosed directly from n8n
execution history instead of waiting on it.

## What was actually broken (two bugs, not one)

Workflow `Generate Daily Video` (`WFrG4efuK86qNaek`, active daily 10am ET)
and `Check & Publish Pending Videos` (`JVqj5usq6e72azZy`, every 2 min) —
both in n8n project `8Bc2ZVWgrU5nt5lm`.

1. **`Generate Daily Video` → "Store Pending Video" node.** Blotato's
   Create Video response is nested (`{"item":{"id":..., "status":...}}`),
   but the node mapped `video_id`/`status` from the top level
   (`$json.id`/`$json.status`) — both undefined. Every automated run since
   2026-07-21 wrote `video_id: null` to the `pending_videos` data table.
   **Fixed:** now reads `$json.item.id` / `$json.item.status`.

2. **`Check & Publish Pending Videos` → "Is Done?" and "Publish Video"
   nodes.** Blotato's render-status check (`Check Video Status`) also
   returns a nested body (`{"item":{"status","mediaUrl","id"}}`), but "Is
   Done?" checked `$json.status` (undefined) and "Publish Video" read
   `$json.mediaUrl` (undefined) — both top-level again. This meant that
   even the one video with a real `video_id` (from a 2026-07-20 manual
   test) could never reach the actual publish step; it always fell to the
   IF node's false branch. **This bug predates the null-`video_id` one and
   has been there since the workflow was built 2026-07-20** — nothing has
   ever successfully auto-posted through this pipeline. **Fixed:** both
   now read from `$json.item.*`.

## Why `Generate Daily Video` was still burning credits

`NEXT-SESSION.md` claimed this workflow was paused 2026-07-26 "to stop
burning credits." Checked directly against n8n: it was **never paused** —
it ran successfully (by its own definition of success) every day through
2026-07-27, each time writing a dead `null`-`video_id` row. Corrected in
`NEXT-SESSION.md`.

## Cleanup + verification

- Added a filter to `Get Pending Videos` (`status != posted` AND
  `video_id` is not empty) so the 7 legacy null-`video_id` rows (ids 3–9,
  created 7/21–7/27) stop erroring on every 2-minute check. There's no
  delete-row tool available via MCP for n8n Data Tables, so those rows are
  filtered out rather than removed — harmless as dead data, safe to purge
  manually later if desired.
- Ran `Check & Publish Pending Videos` manually (execution 2551) to
  confirm the filter worked (only the one real-`video_id` row came
  through) and then again (execution 2552) to confirm the full pipeline:
  Blotato returned `status: "done"`, `Publish Video` succeeded
  (`postSubmissionId: deaf8b94-35c1-435d-8267-594c9a414aa0`, posted to the
  Twitter/X account per Blotato account_id 20503), and the row was
  correctly marked `posted` in the data table.
- **This test run posted a real video to X/Twitter** — the 7/20 test
  video ("Biggest GTA6 leaks and rumors so far, clearly labeled as
  unconfirmed"). Flagging since it's a real, if minor, live action: this
  fits the standing auto-schedule posting policy and was explicitly
  approved before running ("Fix + re-enable" per Chris).
- Both workflows are now active: `Generate Daily Video` will keep
  generating on schedule (now with correct `video_id` capture) and
  `Check & Publish Pending Videos` will pick up and post each one within
  ~2 minutes of Blotato finishing the render.

## Status: fixed and live

Both workflows active as of 2026-07-28. Nothing further needed unless a
new failure shows up in n8n execution history.
