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

## Update: the real reason it was paused, and a third bug

Chris checked X after the test post above went out and clarified the
actual story — correcting the assumption in this doc's first draft:

**It was never a copyright/rights issue.** It was paused because the
2026-07-20 test video's script referenced GTA6 information as "unconfirmed
rumor" that Rockstar has since confirmed (Trailer 2, earnings calls Chris
listened to live) — stale framing, not stolen footage. Chris deleted the
re-posted video again once confirmed. Flagging this correction so nobody
downstream trusts this doc's original diagnosis of "creator footage
rights issue" — that was never true.

That stale-framing problem traced to a real design flaw, not just bad
luck: `Generate Daily Video`'s "Build Video Prompt" node picked from a
**hardcoded array of 6 fixed topics** written once at build time (one
literally titled "Biggest GTA6 leaks and rumors so far, clearly labeled as
unconfirmed"). A static list like that goes stale the moment any of those
topics gets confirmed — which several have been since 7/20 — with no way
for the workflow to know.

**Fix:** `Generate Daily Video` now has a new first step, "Get Recent
Articles" (`GET https://56vicelane.com/articles.json`), feeding
`Build Video Prompt`, which picks randomly from the 5 most recently
published non-evergreen articles instead of the static list. The
generated prompt now explicitly instructs the AI: only state facts from
that article's real excerpt, and don't label anything a rumor/leak/
unconfirmed unless the excerpt itself does. Added an `articleUrl` column
to the `pending_videos` data table so the real article link now gets
included in the posted tweet text too (`topic + articleUrl + "#GTA6"` in
`Check & Publish Pending Videos`' "Publish Video" node) — a small traffic
win that fell out of the same fix.

Verified the new sourcing logic works (execution 2555, Blotato-call node
temporarily disabled so no credit was spent): correctly pulled a real,
current article (`gta6-region-lock-codes-part2`) instead of a stale
topic.

**Also caught in this pass:** my first attempt at fixing the `video_id`/
`status` mapping bug (see above) never actually took effect — a tooling
mistake left a stray duplicate parameter block on the node that shadowed
the real fix. Caught and corrected before either workflow went live again.

## Status: generation back on, auto-publish held for approval

Chris's call (2026-07-28, after the above): run `Generate Daily Video`
again — he'll be checking Blotato more often himself until the real-
creator-footage question is actually resolved — but **hold everything
video-wise for his approval before it posts.**

- `Generate Daily Video` — **active**. Generates daily from current
  articles (per the fix above) and stores each job in `pending_videos`.
  Nothing gets posted at this stage.
- `Check & Publish Pending Videos` (the actual auto-post-to-Twitter step)
  — **left inactive on purpose.** This is the approval gate: videos sit
  rendered-but-unpublished until Chris reviews and either publishes them
  himself in Blotato's dashboard, or asks for a specific one to be
  published, at which point `Check & Publish Pending Videos` can be run
  manually for that single video rather than reactivated wholesale.
- Open question asked back to Chris: whether he wants a lightweight
  notification (e.g. daily digest) when a new video finishes rendering,
  since there's currently no push alert — only his own periodic checking
  of Blotato's dashboard, or the `pending_videos` data table.

This does **not** resolve the underlying footage-sourcing risk — it's a
process control (nothing ships without a human looking at it first), not
a fix to whatever let a real creator's video get pulled into a render.
That question is still open.
