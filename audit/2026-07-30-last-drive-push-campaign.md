# Last Drive Push — 30-day campaign (2026-07-30)

Chris: "we need to schedule a month's worth of posts about the last drive
and link to the page. 2x daily."

## What was built

New n8n workflow **`Last Drive Push (30-day campaign)`**
(id `W4RZhAICByhqzpEp`), active, posts twice daily — **10am and 8pm Central
Time** (workflow timezone explicitly set to `America/Chicago`, matching the
Evergreen Recycle Poster's convention). Deliberately offset from Evergreen
Recycle Poster's 1pm/6pm slots so the two don't compete for the same
posting windows.

Each firing picks from a pool of **20 unique captions**, all promoting The
Last Drive and linking to `/lastdrive`, rotated deterministically by day +
slot (same `(dayIndex * 2 + slot) % pool.length` pattern used elsewhere)
so the sequence doesn't repeat noticeably across the month. Posts to the
same channels as the article-publish pipeline: X, Instagram, Facebook
(page `1235822692950396`), and Discord (same webhook).

**Self-terminating:** the code node checks the current date against a
hardcoded `CAMPAIGN_END` of 2026-08-29 (30 days out) and returns zero items
once past it — the workflow can be left active indefinitely without
needing to remember to disable it after the month's over. If a longer or
shorter run is wanted, that one constant is the only thing to change.

## Verification before going live

Temporarily disabled `Post to Blotato` and `Post to Discord`, ran a manual
test execution (id `2600`), confirmed `Determine Content` → `Build Platform
Posts` produced correct platform-specific text (X/Instagram/Facebook, each
within character limits) with the real `/lastdrive` URL and hero image —
no credits spent, no real post sent. Re-enabled both nodes and published
the workflow after confirming.

## Notes

- Doesn't touch or duplicate the existing Bluesky-only daily Last Drive
  countdown post (`social-queue.json`'s `lastdrive-gta6-daily-countdown`
  entry, posted via the separate GitHub Actions `social-poster.yml` +
  `scripts/post-to-bluesky.js` mechanism, fires once/day at 17:00 UTC).
  That stays as-is; this is additive coverage across the other four
  channels.
- Reuses the existing Blotato credential (`wD818CRlLww46fFr`) and Discord
  webhook already in use elsewhere — no new credentials needed.
- Caption pool is hardcoded in the `Determine Content` code node — easy to
  extend or edit directly in n8n if more variety or a copy change is
  wanted later.
