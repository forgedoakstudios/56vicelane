# 56ViceLane — Daily Checklist

**Generated:** 2026-08-12 (Central Time)
**How this works:** one list, updated daily. Check things off yourself by
editing this file (change `- [ ]` to `- [x]`), or tell me and I'll check
them off. Each day I regenerate this — anything still unchecked carries
forward, anything new gets added, and you get a fresh copy to download.
Full history/detail always lives in `THIS-WEEK.md` and `NEXT-SESSION.md`
(note: those two files haven't been kept current since late July — this
checklist and the dated `/audit` reports are the more reliable day-to-day
source right now).

---

## 🚨 Urgent

- [ ] Revoke the OLD (pre-8/3) Airtable Personal Access Token in Airtable's
      token settings — still open, Chris to do on his own timeline. This is
      now the only thing standing between the site and being fully off the
      old exposed token.
- [ ] **`/streams` watch page + sitewide "Watch" nav shipped straight to
      `main` on 2026-08-10 without a recorded approval session.** Still
      unresolved as of this checklist — flagging again so it doesn't
      quietly drop. Either confirm you did approve this out-of-band, or
      take a look now that it's already live. Detail:
      `audit/2026-08-10-90-day-push-ramp-and-streams-page.md`.

## Needs a decision from you

- [ ] **Gmail cleanup (receipts category + $99 emails + babylovegrowth
      emails)** — you asked for this, but you've also said you're done
      re-authorizing the Gmail connector every time it drops. Recommended
      path: build it as native Gmail filters instead (runs inside Gmail
      itself, no connector/reconnect dependency at all). I need the exact
      sender/subject pattern for the "$99" emails to write an accurate
      filter — say the word and I'll draft the filter queries for you to
      paste into Gmail's filter settings once.
- [ ] **Piper voice-latency fix (background service) — sent, not yet
      confirmed working.** Replaced the old "reload the model every time"
      approach (7-10s delay) with a persistent background service that
      keeps Piper loaded + a queue + fallback if the service dies. You
      double-clicked `start-service-now.bat` — still need a real test from
      the local Claude Code terminal (not this chat) to confirm it's
      actually faster, then run `install-service-task.ps1` once so it
      survives reboots/logins.
- [ ] **Do one real, low-value test purchase on the store** to confirm the
      PayPal fix works end-to-end in production, including the plate/bundle
      actually getting granted — the synthetic test only proved the
      credential and rejection logic, not a full real grant.
- [ ] **Blotato AI video — still paused; OpenArt testing ongoing**
      (prompt notes in `audit/ai-video-prompt-notes.md`, not a full
      pipeline yet).
- [ ] **Dell monitor swap — still drafted, needs your merge approval.**
      Unchanged, sitting on `claude/dell-monitor-swap`.
- [ ] **Two buyer's-guide articles — still drafted, need review before
      publishing** (`drafts/tech/gta6-best-controllers-buyers-guide.html`,
      `drafts/tech/gta6-best-gaming-headsets-buyers-guide.html`).
- [ ] **More affiliate programs — Turtle Beach and Impact network still
      not applied to.** `gear.html` links a Turtle Beach product via the
      existing Amazon Associates tag — that's not the same as a direct
      Turtle Beach affiliate relationship, so this is still genuinely open.
- [ ] Weekly Winner Selection — rewired off Airtable, tested clean, left
      inactive. Enabling it is your call.
- [ ] External citation links in article bodies and live redirect/404
      behavior still haven't been checked (the 7/31 audit hit a 403 on
      outbound calls).
- [ ] **gear.html's `amzn.to` short links may still be tracking under the
      old Amazon tag.** The new tag (`forgedoakstud-20`) is live everywhere
      I have direct control, but gear.html's "Check Price" buttons use
      Amazon's own shortened URLs — the tag is baked in at creation time
      via Amazon's link tool, invisible and unreachable from here. Worth
      checking in Associates Central whether those need regenerating.
- [ ] **Full sitewide nav standardization (Watch/Leaderboard/Streams links)
      and full source-status rollout across all leak/breaking articles** —
      the 2026-08-11 external audit's "within 2 weeks" items. The 48-hour
      safety/trust items from that same audit are done (see below); these
      two are the broader sitewide follow-through, not started as a full
      pass yet (2 articles fixed as a spot-check, not all of them).
- [ ] Instagram anti-spam — 3 confirmed Meta "we restrict certain
      activity" failures, all traced to the same source (Evergreen Recycle
      Poster). IG posting was pulled from that workflow 2026-08-12; Last
      Drive Push (2x/day) is now the only recurring automated IG source.
      Per your own fallback: if that also gets flagged, next step is
      dropping Last Drive Push's IG to 1x/day.

## Shelved — revisit late August 2026

- [ ] AdSense — no longer just a resubmission-timing question. AdSense was
      **removed sitewide 2026-08-12** after triggering a Google Safe
      Browsing "Deceptive pages" flag (malvertising via the ad network, not
      a code compromise — confirmed via Google's own "Review successful"
      follow-up email after the removal). Whether to pursue AdSense again
      at all, and when, is now a bigger question than just site-age timing.

## Cancelled / not pursuing

- [x] ~~Trevor/Danny per-platform social accounts~~ — cancelled 2026-07-28.
- [x] ~~Adult-toy-store affiliate invite~~ — "just a funny thought."

## Done recently

- [x] **Google Safe Browsing "Deceptive pages" flag fixed, 2026-08-12.**
      AdSense removed sitewide (109 files) as the root cause — no code-level
      compromise found, pattern matched known AdSense-malvertising cases.
      Confirmed resolved via Google's own "Review successful" email.
- [x] **UTM attribution dashboard + Facebook Group launch, 2026-08-12.**
      New UTM breakdown section in `admin.html` (source + referred-by,
      pulling updated fields from the `Admin - List Signups` n8n webhook).
      New "GTA6 Community — The Last Drive" Facebook Group wired sitewide
      (index.html icon rows, lastdrive.html CTA button); rules, description,
      membership questions, welcome post, and cross-posting materials
      drafted for the group itself.
- [x] **External site audit's 48-hour safety/trust list, 2026-08-11.**
      Rewrote the Survival Guide PDF to drop unsafe sleep-deprivation/
      energy-drink advice; removed unsupported "join thousands" claims (41
      files) and unsupported GTA6-specific PC performance claims on Gear;
      Leaderboard now shows an honest empty state instead of fake rows;
      six-editions leak article got an UPDATE banner + Source Status box
      (establishing the pattern for future corrections); fixed a stray
      dead `/gtacon` link; reconciled "Wall of Honor forever" copy with
      the real terms. Full audit: `audit/2026-08-11-external-site-audit.md`,
      fixes: commit `9b8f714`.
- [x] **Editorial/corrections policy page + Last Drive post-signup flow,
      2026-08-11.** New public editorial standards page; post-signup
      actions added to the Last Drive signup flow.
- [x] **Referral attribution wired end-to-end, 2026-08-11-12.** Frontend +
      n8n backend now capture `utm_source` on Last Drive signups and log
      referred-by, feeding the new UTM dashboard above.
- [x] **Homepage hero swapped to Last Drive CTA, 2026-08-11.** Per the
      external audit's recommendation — replaced the video hero with a
      Last Drive-focused call-to-action hero.
- [x] **Bluesky real-time posting gap fixed, 2026-08-11** (social pipeline
      audit finding). Named staff-writer bylines also retired the generic
      "News Desk" default around the same time.
- [x] **Instagram cadence reduced after repeat anti-spam failures,
      2026-08-12.** Evergreen Recycle Poster's IG posting removed entirely
      (kept X + Facebook); Last Drive Push left as the sole recurring IG
      source at 2x/day per your instruction to step down gradually.
- [x] **Gmail connector wrong-account mixup resolved, 2026-08-12** —
      confirmed working against `forgedoakstudios@gmail.com`. (Superseded
      by the decision above: moving Gmail cleanup to native filters instead
      of repeat connector reconnects.)
- [x] **`/streams` watch page + sitewide "Watch" nav + Last Drive Push
      auto-ramp, 2026-08-10.** New `streams.html`: browsable streamer grid
      pulling the same `LastDrive - List Streamers` data as the homepage;
      Twitch/Kick play inline via embedded iframe (stays on-site), YouTube/
      Facebook Gaming open in a clearly-labeled new tab. "Watch" added to
      nav across 111 files. Same session: `Last Drive Push` renamed to
      **"ramping to launch"** — auto-scales from 2 slots/day today to 6
      slots/day by ~10/24, landing total posting volume at ~99/week. Full
      detail: `audit/2026-08-10-90-day-push-ramp-and-streams-page.md`.
      *(See Urgent — this shipped to `main` same-day without a documented
      approval step.)*
- [x] **Now Featuring streamer cards + screenshot upload + permanent Last
      Drive promo tile, 2026-08-10.**
- [x] **lastdrive.html: Facebook event + Discord CTA + streamer signups,
      2026-08-10.**
- [x] **Amazon Associates tag swapped sitewide, 2026-08-10.**
- [x] **Blotato silent post-failure blind spot closed, 2026-08-10.** n8n
      now confirms Blotato actually published, not just accepted the post;
      pings Discord on real failures. Writeup:
      `audit/2026-08-10-blotato-post-failure-blind-spot.md`.
- [x] **Stale "Store paused until August 1" banner removed, 2026-08-10.**
- [x] **gear.html affiliate links fully fixed, 2026-08-10.**
- [x] **Airtable token fully removed sitewide, 2026-08-10.**
- [x] **Live secret exposure found and fixed, 2026-08-09.**
- [x] **PayPal purchase verification fixed and verified, 2026-08-07.**
- [x] **Take-Two Q1 FY2027 earnings call article written and published,
      2026-08-07.**
- [x] **Netflix GTA6 Extended Look announcement covered, 2026-08-06.**
- [x] **Fri/Sat scheduled articles moved to a dedicated `scheduled/`
      folder + n8n-backed publisher, 2026-08-06.**
- [x] **news-scan hanging indefinitely on a slow/unresponsive RSS feed —
      fixed, 2026-08-06.**
- [x] **Leaderboard linked sitewide + visual streak calendar + newsletter
      disclosure, 2026-08-06.**
- [x] Ratings/comments fully migrated off client-side Airtable, 2026-08-05.
- [x] All 82 pages retrofit onto a shared share-bar component, 2026-08-05.
- [x] Sitewide image compression, 2026-08-05 — 465MB → 219MB.
- [x] Admin login auth bypass fixed + index/leaderboard/wall migrated off
      Airtable, 2026-08-05.
- [x] Daily check-in loyalty system shipped, 2026-08-06.
- [x] Airtable Personal Access Token rotated, 2026-08-03.
- [x] `STORE_MAINTENANCE` flipped off + Airtable quota reset/import
      complete, 2026-08-02.

## Carried over from this week (not yet done)

- [ ] Review the n8n migration's 3 field fixes (linkedSlot order,
      founder-plate logic, joinStatus/approval flow) — my best read of the
      real code, not confirmed with you.
- [ ] Supermetrics: on hold indefinitely per Chris.
- [ ] Media Gallery for the empty space on the home page.
- [ ] GTA6 Guide template.
- [ ] Forum Discord section — replace generic image with real one.
