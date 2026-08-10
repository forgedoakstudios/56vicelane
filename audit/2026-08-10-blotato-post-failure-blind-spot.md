# Blotato silent post-failure blind spot — fixed, 2026-08-10

## What happened

Chris forwarded a Blotato email ("Your post has failed to publish") for a
Last Drive campaign post from 8/6. Checked n8n's execution history for the
matching run — it showed a clean "success," with all three platform posts
(Twitter/Instagram/Facebook) returning valid `postSubmissionId`s from
Blotato.

## Root cause

Every "Post to Blotato" node across all three active posting workflows
(`Last Drive Push`, `Evergreen Recycle Poster`, `Friday Frequency`) only
confirms Blotato **accepted** a post into its queue — a `postSubmissionId`
is not proof of publication, since Blotato processes the actual publish
step asynchronously afterward. On top of that, every one of these nodes is
set to `onError: continueRegularOutput`, so even an outright API error at
submission time wouldn't have shown up as a failed n8n execution.

Net effect: n8n had zero visibility into whether a post actually went
out. The only reason this particular failure surfaced at all was Blotato's
own email — a channel that depends on Chris manually forwarding it.

## Fix

Two parts, both live now:

1. **Logging.** Added a "Log Submissions" step to all three posting
   workflows. Every Blotato submission (success or HTTP-level failure) now
   writes a row to the existing `SocialPostLog` n8n Data Table with
   `postSubmissionId`, `platform`, `accountId`, `caption`, `contentGroup`,
   and `status: submitted` (or `status: http-error` if the submission
   itself failed). Added a new `errorMessage` column to that table.

2. **Status checker.** New workflow, `Blotato - Check Post Status`
   (`FQNXwhG7FQN4q6YG`), scheduled every 30 minutes. Pulls every
   `SocialPostLog` row still marked `submitted`, calls Blotato's
   `GET /v2/posts/{postSubmissionId}` status endpoint for each, and:
   - `published` → updates the row with `publicUrl`, marks it resolved.
   - `failed` → updates the row with `errorMessage`, marks it resolved,
     **and posts a Discord alert** with the platform, content group, and
     error text.
   - `in-progress` → leaves it alone, picked up again next run.

## Verification

Manually tested end-to-end against a real historical submission (an
actual Last Drive tweet from 8/6/2026, `postSubmissionId`
`0fc3772d-27d2-4905-a50a-69ab78d7b92b`): the status-check workflow
correctly pulled the real publish result from Blotato (`status: published`,
real public tweet URL) and updated the log row accordingly. Full run,
no errors. Left one synthetic test row in `SocialPostLog`
(`contentGroup: test-verify-only`) — harmless, resolved to `published`,
won't be re-queried.

## What this doesn't cover

- Posts submitted **before** today won't have a `SocialPostLog` row (the
  logging step didn't exist yet), so the checker can't retroactively find
  out whether older campaign posts silently failed. Going forward,
  everything is covered.
- Didn't touch Blotato's brand-new Comprehensive Analytics feature
  (announced 8/6) — the existing `GET /v2/posts/{id}` status endpoint was
  sufficient and already documented. Worth a look later for
  engagement-metric syncing (likes/views/shares columns already exist on
  `SocialPostLog`, unused).
