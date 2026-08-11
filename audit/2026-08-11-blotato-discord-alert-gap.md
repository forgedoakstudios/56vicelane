# Blotato Discord alert gap — found and fixed, 2026-08-11 (evening)

## What happened

Chris saw a Discord alert: `⚠️ Blotato post failed to publish — Instagram
(evergreen-recycle)` for "GTA V Story Mode Added To GTA+ — What It Means
For The Last Drive" and wasn't sure where it came from. This is the
`Blotato - Check Post Status` monitor built 2026-08-10 (see
`2026-08-10-blotato-post-failure-blind-spot.md`) — it's supposed to post
exactly these alerts, working as designed.

Checked the full `SocialPostLog` rows for this specific post (18:00 UTC,
2026-08-11 run of `Evergreen Recycle Poster`) and found **two** failures
in the same batch, not one:

1. **Instagram** — `status: failed`, error: *"We restrict certain
   activity to protect our community."* This is the same content-restriction
   pattern already investigated in `2026-08-11-blotato-failure-investigation.md`
   Finding 1 — Meta's automated spam/rate-limit detection, standing call
   from Chris is to leave posting frequency as-is. Alerted correctly.
2. **Twitter/X** — `status: http-error`, real Blotato error: a 500
   response, *"remaining connection slots are reserved for
   non-replication superuser connections"* — Blotato's own backend
   database ran out of connections at that moment. Transient, on their
   end, nothing to fix on ours. **This one was never Discord-alerted.**

Facebook published fine.

## Root cause of the silent Twitter failure

`Blotato - Check Post Status` only polls `SocialPostLog` rows still
marked `status: submitted` — it calls Blotato's `GET /v2/posts/{id}`
using the row's `postSubmissionId`. A submission that fails at the HTTP
level (never reaches Blotato successfully) gets logged by `Log
Submissions` with `status: http-error` and no `postSubmissionId` — there
is nothing for the status checker to poll, so it's permanently invisible
to that monitor. The only record was the `SocialPostLog` row itself and
Blotato's own error response in the execution log — nothing surfaced
proactively.

This is a real gap in the monitoring system, distinct from (and in
addition to) the known IG content-restriction pattern.

## Fix applied (live now)

Added an immediate Discord alert branch, parallel to the existing `Log
Submissions` write, in all three posting workflows sharing this pattern:
`Evergreen Recycle Poster`, `Last Drive Push (ramping to launch)`, and
`Friday Frequency — Generate & Post`. Each now has:

- `Has Submission Error?` (IF node) — true when `postSubmissionId` is
  empty, i.e. exactly the `http-error` case.
- `Alert Discord - Submission Failed` — posts platform, content group,
  the raw error, and a caption preview to the same Discord webhook,
  immediately at submission time rather than waiting on (and being
  invisible to) the 30-minute poller.

Validated via `validate_workflow` (no warnings) in all three. Not
live-tested against a real failure (would require intentionally breaking
a submission) — structural validation only, consistent with the
additive, parallel-branch design not touching the existing
submitted/logged path.

## Net effect

Going forward, both failure modes get a Discord alert: content-policy
rejections (`status: failed`, caught by the 30-min poller) and
submission-level failures (`status: http-error`, caught immediately at
submission time). No more blind spots in this system as currently
understood.
