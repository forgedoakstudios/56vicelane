# 90-Day Engagement Push: Last Drive Ramp + Streams Page

**Date:** 2026-08-10
**Why:** Chris flagged the next 90 days (through Nov 18/19 launch) as the
critical window and asked for maximum engagement activity, scaling
incrementally toward 100 posts/week with Last Drive leaning heavily
ahead of everything else "by a fair margin."

## Current posting volume (baseline, before this change)

Tallied from every active n8n posting workflow's real schedule:

| Workflow | Schedule | Events/week |
|---|---|---|
| Daily Last Drive Countdown → X | 9am ET daily | 7 |
| Evergreen Recycle Poster | 1pm + 6pm daily | 14 |
| Last Drive Push | 10am + 8pm CT daily | 14 |
| Facebook Extra Posts | 8am/3pm/9:30pm CT daily | 21 |
| Article → Social Blast | fires per article publish (~2/day avg) | ~14 |
| Friday Frequency | Fridays 5:15pm ET | 1 |
| **Total** | | **~71 events/week** |

("Events" = one distinct posting action, not multiplied by the
3-4 platforms each one fans out to via Blotato.)

## Change made: Last Drive Push now ramps automatically

`Last Drive Push (30-day campaign)` → renamed **`Last Drive Push
(ramping to launch)`** (workflow id `W4RZhAICByhqzpEp`).

- **Old behavior:** fixed 2x/day (10am+8pm CT), self-terminated
  2026-08-29.
- **New behavior:** self-adjusting frequency, gated by a hardcoded
  priority-hour list `[10, 20, 14, 8, 17, 22]` (CT) and days elapsed
  since 2026-08-10:
  - Days 0-24 (through ~9/3): **2 slots/day** — hours 10, 20 (unchanged)
  - Days 25-49 (through ~9/28): **3 slots/day** — adds 14:00
  - Days 50-74 (through ~10/23): **4 slots/day** — adds 8:00
  - Days 75+ (10/24 onward): **6 slots/day** — adds 17:00, 22:00 (peak,
    heading into the event)
  - Stops the morning of 2026-11-18 (event day itself).
- Added 4 new schedule-trigger nodes (Midday/Early/Late Afternoon/Late
  Night Trigger) wired into the same `Determine Content` code node,
  which now checks `$now.hour` against the tier's active-hour set and
  no-ops otherwise. Live-tested: correctly returned empty output when
  executed at an inactive hour (13:05 CT, not in tier-1's [10,20] set).
- Same captions pool, same 4-platform fan-out (X/IG/FB/Discord),
  same submission logging — only the firing cadence changed.

## Resulting weekly volume by tier

| Tier | Last Drive Push | Everything else (constant) | Total/week |
|---|---|---|---|
| 1 (now) | 14 | 57 | 71 |
| 2 (~9/4) | 21 | 57 | 78 |
| 3 (~9/29) | 28 | 57 | 85 |
| 4 (~10/24, peak) | 42 | 57 | **99** |

At peak, Last Drive Push is 42 of 99 weekly events (~42%) — more than
double the next-largest single category (Facebook Extra Posts at 21,
or Evergreen at 14) — matching "leaning toward Last Drive by a fair
margin." Total lands at 99/week, essentially the requested 100.

## Other workflows: left alone, on purpose

Evergreen Recycle Poster, Facebook Extra Posts, Article → Social Blast,
Daily Countdown, and Friday Frequency were **not** changed — they're
tied to real content (articles) or already reasonable, and stacking
increases on all of them at once risked drowning the feed in
non-Last-Drive content, working against "leaning toward Last Drive."
If Chris wants the non-Last-Drive channels scaled up too later, that's
a separate, deliberate call — not bundled into this change.

## New: `/streams` — watch streamers without leaving the site

Built `streams.html`. Pulls the same `LastDrive - List Streamers`
n8n data the homepage "Now Featuring" section uses, renders it as a
browsable grid, and on click:
- **Twitch and Kick** channels play in an inline embedded player on
  the page itself (`player.twitch.tv` / `player.kick.com` iframes) —
  genuinely stays on-site.
- **YouTube, Facebook Gaming, and anything else** don't support
  reliable in-page embedding from just a channel URL (no channel ID
  captured at signup, and Facebook's embed needs a specific video
  permalink) — those open in a new tab, clearly labeled "Opens New
  Tab" on the card so it's never a silent surprise.

Tested end-to-end with mocked streamer data in a headless browser:
card grid renders, Twitch/Kick clicks set the correct iframe src,
YouTube click correctly skips the iframe and opens externally instead.

**Status: on branch `claude/watch-streamers-page`, not yet on `main`
— needs Chris's review/approval per the standing shipping rule** (see
CLAUDE.md). Nav link added as "Watch" on the new page itself only;
sitewide nav/footer rollout (like the leaderboard link effort) not
done yet — flagging as a follow-up if wanted.
