# Content Sprint — July 27, 2026

Batch covering 4 days of missed news-scan stories (Jul 23–27). 7 new
articles written, merging duplicate/related stories where it made sense.
Full audit trail below: what was written, what's queued per platform, and
what's still blocked on a main-push approval.

## Articles written (all committed to `articles/`, not yet live on `main`)

| Date | Slug | Type | Sources merged |
|---|---|---|---|
| Jul 28 | `gta6-trailer-3-august-6-prediction` | News | TheGamer insider prediction |
| Jul 29 | `gta6-region-lock-codes-part1` | News — Part 1 of 2 | TheGamer (region lock) + Insider Gaming (PS5 vs Xbox) |
| Jul 30 | `rockstar-union-step-in-right-direction` | News | GamesRadar + Dexerto + RPS + Eurogamer (union/crunch/layoffs) |
| Jul 31 | `ai-gta6-slop-editors-desk` | Editor's Desk | Eurogamer (AI slop) |
| Jul 31 | `trevors-take-ai-slop` | Trevor's Take | Same AI slop story, satire companion |
| Aug 1 | `gta6-region-lock-codes-part2` | News — Part 2 of 2 | GameSpot + Dexerto (expiration dates) + GameSpot (Sony/RE disc backlash, as connective context) |
| Aug 2 | `gta-fan-projects-switch-port-multiverse` | Community | TheGamer (Switch port) + PC Gamer (multiverse mod) |

Not turned into standalone articles: the Resident Evil/Sony disc-backlash
story (folded into Part 2 as supporting context rather than its own weak
piece — thin GTA6 connection on its own).

**Update (same day, after initial draft):** a new news-scan story landed —
IGN's report that physical GTA6 copies in Japan will expire 170 days after
launch. Folded directly into Part 2 (new section, updated bullet list,
updated bottom line, updated meta/OG/Twitter descriptions, updated
articles.json excerpt and the queued Bluesky text). This is a stronger,
more concrete fact than the original unnamed-country digital-code
expiration story Part 2 was built around, and it sharpens the tie to the
Sony/Resident Evil disc-backlash angle considerably.

## What's queued per platform

**X, Instagram, Facebook (via Blotato) + Discord** — the `Article → Social
Blast` n8n workflow only auto-fires when an article is published through
the `drafts/tech` or `drafts/other` → Scheduled Article Publisher pipeline
(that's what calls `notify-social-blast.js`). These 7 articles were
committed directly to `articles/` instead, to keep manual control over the
two-part series pairing and same-day Editor/Trevor companion pieces — so
these 7 need the webhook fired directly, once each is live on `main`.
That's not a blocker on anyone else — direct Discord posting access is
already wired in (same webhook Friday Frequency already uses), so once
`main` is approved I can fire it myself per article, no separate manual
step required from Chris.
**Also fixed a real gap while in there:** the workflow only covered X +
Instagram before today. It now also posts to Facebook and Discord —
extended and test-validated (execution #2548) using the same Facebook
page ID and Discord webhook the Friday Frequency column already uses.
Future articles that go through `drafts/` will get all four automatically.

**Bluesky** — queued directly in `social-queue.json` with `scheduledFor`
matching each article's calendar date (7am CT / 13:00 UTC, matching the
existing posting pattern). The hourly `Social Queue Poster` GitHub Action
only runs against `main` (scheduled workflows don't run on feature
branches), so these sit inert until the branch is approved and merged —
then they'll post themselves on schedule, no further action needed.

**YouTube / TikTok** — no video assets made this round. Flagging per
standing instruction: nothing here was auto-posted to either, and nothing
should be assumed posted. Best candidates for a manual short-form video
if there's time: the Trailer 3 prediction (natural countdown/hype hook)
and the AI slop piece (visual, "spot the fake" hook is inherently
video-friendly — before/after or side-by-side framing).

## Still blocked on

Everything above is fully written and queued, but **live per
`CLAUDE.md`'s shipping rule** — none of it goes out until Chris reviews
and approves the push to `main`. That single approval is what unblocks:
the articles going live, the sitemap/articles.json rebuild (automatic via
`update-articles.yml` once articles/** changes land), the Bluesky queue
unfreezing, and the manual X/IG/FB/Discord webhook fires for this batch.
