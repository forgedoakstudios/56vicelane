# 56ViceLane — News-Scan Articles Log, 2026-09-10

## Breaking (7+, pushed to `main`)

### GTA6 DualSense Pre-Orders Went Live Today — And It's Already A Mess
- **Slug:** `gta6-dualsense-preorders-live-queue-mess`
- **Scanner score:** 7 (The Gamer), also picked up at 5 (IGN).
- **Verification:** The Gamer and IGN are both trusted-feed domains.
  WebFetch was not attempted directly (routine judgment: corroborated
  instead via WebSearch, same pattern as every prior run this window —
  WebFetch has been consistently blocked by the sandbox egress proxy).
  Corroborated across 8 outlets: TechRadar, Tom's Guide, GamesRadar,
  Engadget, and others, all matching queue/checkout-error details,
  Black-edition-as-PS-Direct-exclusive scarcity, and UK sellouts.
  Checked `articles.json` and both branches — this is a genuine
  follow-up to the 9/3 DualSense reveal article
  (`gta6-dualsense-controllers-revealed-state-of-play`), not a
  duplicate: that article covered the announcement and Sept 10
  pre-order date; this one covers what actually happened when that
  date arrived. No existing coverage of the launch-day chaos itself.
- **source-status:** `confirmed` — strong multi-outlet corroboration
  on every factual claim (wait times, checkout errors, edition
  exclusivity, price/date unchanged).
- **Byline:** Julian Ashworth (hardware beat — same as the original
  reveal article, consistent lane).
- **Images:** generation FAILED again this run. Fresh curl test to
  `n8n.56vicelane.com/webhook/article-images` — exit 56, CONNECT
  rejected by egress proxy (organization policy). Published with the
  generic `gta6-hero.png` placeholder. Outage now confirmed running
  since 2026-08-19 — 22+ days, last actually re-tested 2026-09-03 and
  every run since (including this one).
- **Platforms:**
  - ❌ **Discord (social-blast + video SLA alert)** — n8n webhook
    confirmed down this run (curl exit 56/000). No webhook URL exists
    in-repo to try directly (lives only inside n8n workflow config).
  - ✅ **Bluesky** — queued via `scripts/queue-article-post.js`, entry
    confirmed present in `social-queue.json`
    (`auto-publish-gta6-dualsense-preorders-live-queue-mess`).
  - ❌ **X / Instagram / Facebook** — Blotato cancelled 2026-08-16;
    N/A, no auto-posting path exists to these platforms.
  - N/A **YouTube / TikTok** — never covered by this pipeline.
- **Video SLA alert:** NOT sent — same n8n/Discord outage, no
  alternate path available this run.
- **`drafted-links.json`:** appended the breaking-tier link (The Gamer,
  this slug) plus IGN's live-in-UK story (marked `skipped-duplicate` —
  same launch-day story, no new facts) and the Rockstar/union-tribunal
  story (score 2, marked `skipped-not-gta6-specific` — a labor story,
  not core GTA6 content) to `main`'s copy.

## Operational note — news-scan cron stall (35th occurrence this window)

Last scheduled run before this one landed at 07:43 UTC; this Routine
fired at 10:51, well past the ~90-minute cadence. Confirmed via
`mcp__github__actions_list` — no runs between 07:43 and the manual
trigger. Manually re-triggered via `workflow_dispatch`; confirmed
resumption via the `Monitor` tool polling the GitHub Actions API
directly — new report landed at 10:52 UTC, which is what surfaced this
DualSense story. Running total now 35 confirmed stalls across
2026-08-27 through 9/10, still no structural fix implemented — see the
daily checklist's standing Urgent item.

## Action needed (repeat, standing item)

n8n outage has now blocked image generation, Discord social-blast, and
the video SLA alert for 22+ straight days (since 2026-08-19). No
workaround exists short of Chris re-authorizing the n8n credential —
direct egress to `n8n.56vicelane.com` remains blocked by this
environment's proxy policy.
