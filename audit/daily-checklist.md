# 56ViceLane — Daily Checklist

**Generated:** 2026-08-11 (Central Time)
**How this works:** one list, updated daily. Check things off yourself by
editing this file (change `- [ ]` to `- [x]`), or tell me and I'll check
them off. Each day I regenerate this — anything still unchecked carries
forward, anything new gets added, and you get a fresh copy to download.
Full history/detail always lives in `THIS-WEEK.md` and `NEXT-SESSION.md`.

---

## 🚨 Urgent

- [ ] Revoke the OLD (pre-8/3) Airtable Personal Access Token in Airtable's
      token settings — still open, Chris to do on his own timeline. This is
      now the only thing standing between the site and being fully off the
      old exposed token.
- [ ] **`/streams` watch page + sitewide "Watch" nav shipped straight to
      `main` on 2026-08-10 without a recorded approval session.** Its own
      writeup (`audit/2026-08-10-90-day-push-ramp-and-streams-page.md`)
      explicitly says "on branch `claude/watch-streamers-page`, not yet on
      `main` — needs Chris's review/approval" — but a later same-day commit
      (`3bbe830`, merged via `f1f5d3d`) added it to nav across 111 files and
      merged the whole thing into `main` anyway, with no commit message or
      session note showing Chris signed off in between. It's live now
      (embedded Twitch/Kick player, external-tab links for
      YouTube/Facebook). Flagging so you can either confirm you did approve
      this out-of-band, or take a look now that it's already live — not
      asking permission after the fact, just making sure this isn't a gap
      in the shipping rule that quietly repeats.

## Needs a decision from you

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
- [ ] **Sitewide nav rollout pattern from the Watch link** — 3 legacy pages
      (`radio.html`, `gta6.html`, `_template.html`) were deliberately
      skipped as orphaned/not part of the live nav graph. Worth a quick
      confirm that's actually correct and not pages you still want linked.

## Shelved — revisit late August 2026

- [ ] AdSense resubmission — real blocker is site age/traffic history.

## Cancelled / not pursuing

- [x] ~~Trevor/Danny per-platform social accounts~~ — cancelled 2026-07-28.
- [x] ~~Adult-toy-store affiliate invite~~ — "just a funny thought."

## Done recently

- [x] **`/streams` watch page + sitewide "Watch" nav + Last Drive Push
      auto-ramp, 2026-08-10.** New `streams.html`: browsable streamer grid
      pulling the same `LastDrive - List Streamers` data as the homepage;
      Twitch/Kick play inline via embedded iframe (stays on-site), YouTube/
      Facebook Gaming open in a clearly-labeled new tab. "Watch" added to
      nav across 111 files; streamer cards sitewide now scale on hover and
      link straight into the embedded player via `/streams?watch=<name>`
      deep links. Same session: `Last Drive Push` renamed to
      **"ramping to launch"** — auto-scales from 2 slots/day today to 6
      slots/day by ~10/24 (peak, heading into the Nov 19 launch) instead of
      self-terminating 8/29, landing total posting volume at ~99/week with
      Last Drive as the clear majority share. Full detail:
      `audit/2026-08-10-90-day-push-ramp-and-streams-page.md`. *(See
      Urgent — this shipped to `main` same-day without a documented
      approval step.)*
- [x] **Now Featuring streamer cards + screenshot upload + permanent Last
      Drive promo tile, 2026-08-10.** Homepage "Now Featuring" section now
      shows real streamer cards with screenshot upload, plus a permanent
      "Streaming The Last Drive" promo tile. Card sizes bumped 30% for
      legibility same session.
- [x] **lastdrive.html: Facebook event + Discord CTA + streamer signups,
      2026-08-10.** Chris created a virtual Facebook event for The Last
      Drive and called this out as one of the biggest pieces for the
      event. Added a prominent RSVP/Discord block right under the
      countdown bar (above the sign-up cards) linking the FB event and
      the site's Discord, plus a real streamer-links feature — a form for
      members to submit their channel (Twitch/YouTube/Kick/etc.),
      rendered as a public list on the page. New backend: `LastDriveStreamers`
      data table, `LastDrive - Submit Streamer` (validates gamertag + a
      real URL) and `LastDrive - List Streamers` workflows, both tested
      end-to-end via direct execution against the real API before merge.
      Bonus: reconciled the sitewide Discord link split flagged in this
      file's own notes — Chris confirmed `discord.gg/ewdRcjsbg5` is the
      permanent one, `index.html` was the only holdout still on the old
      code.
- [x] **Amazon Associates tag swapped sitewide, 2026-08-10.** Chris sent a
      new tracking tag (`forgedoakstud-20`); confirmed full sitewide
      replacement (not a separate campaign tag). Swapped across all 22
      files carrying the old `56vicelane-20` tag — article-template-5.html
      (covers future auto-published articles), 18 published articles, both
      buyer's-guide drafts, and gear.html's disclosure text. Flagged
      separately: gear.html's actual "Check Price" buttons use Amazon
      `amzn.to` short links, which bake in a tag at creation time via
      Amazon's own tool — those weren't touched here and may still be
      tracking under the old tag until Chris regenerates them in
      Associates Central.
- [x] **Blotato silent post-failure blind spot closed, 2026-08-10.** n8n
      was only confirming Blotato *accepted* a post, never that it actually
      published — the only reason a real failure surfaced was Blotato's own
      email. Added submission logging to all 3 active posting workflows
      (Last Drive Push, Evergreen Recycle Poster, Friday Frequency) and
      built a new `Blotato - Check Post Status` workflow that runs every 30
      min and pings Discord on real failures. Verified end-to-end against a
      real historical post. Writeup:
      `audit/2026-08-10-blotato-post-failure-blind-spot.md`.
- [x] **Stale "Store paused until August 1" banner removed, 2026-08-10.**
      Static leftover markup, completely disconnected from the actual
      `STORE_MAINTENANCE` flag (false since 8/2) — had been telling every
      store visitor the site was broken for over a week after it was
      actually fine.
- [x] **gear.html affiliate links fully fixed, 2026-08-10.** Every generic
      Amazon search link (20 total, across Controllers/Headsets/Monitors/PC
      Gear/Accessories) replaced with the real `amzn.to` affiliate link you
      sent over. Also swapped several products for current-gen picks per
      your list. Monitors section also got real product photos for the
      first time. 22 new product photos pulled from the shared Drive
      folder into `/images/gear/`.
- [x] **Airtable token fully removed sitewide, 2026-08-10.** The last 5
      files carrying it are all clean now (repo-wide grep for the token
      literal returns zero matches). Built 5 new n8n webhooks to cover the
      real gaps this left (`LastDrive - List Drives`, `Submit Contact
      Form`, `Admin - List Contacts`, `Admin - List Signups`, `Admin -
      Gift Plates`).
- [x] **Live secret exposure found and fixed, 2026-08-09.** A hardcoded
      Airtable token that had gone live in a shipped article's source
      (auto-published 8/8) was caught and fixed same-turn — swapped for
      the same n8n webhooks every other article uses.
- [x] **PayPal purchase verification fixed and verified, 2026-08-07.**
      Full writeup: `audit/2026-08-07-paypal-credential-wired.md`.
- [x] **Take-Two Q1 FY2027 earnings call article written and published,
      2026-08-07.**
- [x] **Netflix GTA6 Extended Look announcement covered, 2026-08-06** —
      same-day news article plus a Part 2 covering fan backlash.
- [x] **Fri/Sat scheduled articles moved to a dedicated `scheduled/`
      folder + n8n-backed publisher, 2026-08-06.**
- [x] **news-scan hanging indefinitely on a slow/unresponsive RSS feed —
      fixed, 2026-08-06.**
- [x] **Leaderboard linked sitewide + visual streak calendar + newsletter
      disclosure, 2026-08-06.**
- [x] **leaderboard.html rebuilt to match the site's actual theme,
      2026-08-06.**
- [x] Ratings/comments fully migrated off client-side Airtable, 2026-08-05.
- [x] All 82 pages retrofit onto a shared share-bar component, 2026-08-05.
- [x] Sitewide image compression, 2026-08-05 — 465MB → 219MB.
- [x] Sitewide n8n webhook URLs fixed, 2026-08-06.
- [x] Admin login auth bypass fixed + index/leaderboard/wall migrated off
      Airtable, 2026-08-05.
- [x] player.html and store.html migrated off the exposed Airtable token,
      2026-08-05.
- [x] Daily check-in loyalty system shipped, 2026-08-06.
- [x] Last Drive video added to the homepage, 2026-08-06.
- [x] Airtable Personal Access Token rotated, 2026-08-03.
- [x] `STORE_MAINTENANCE` flipped off + Airtable quota reset/import
      complete, 2026-08-02.
- [x] `USE_N8N_BACKEND` flipped live for track.js/members.html/
      lastdrive.html, 2026-08-02.
- [x] Nightly audit Routine's filename bug found and fixed, 2026-07-31.
- [x] Last Drive Push — original 30-day posting campaign (now superseded
      by the auto-ramping version above).
- [x] Affiliate product images — all 26 real photos wired into `gear.html`.
- [x] Built the two thorough buyer's-guide drafts (controllers, headsets).

## Carried over from this week (not yet done)

- [ ] Review the n8n migration's 3 field fixes (linkedSlot order,
      founder-plate logic, joinStatus/approval flow) — my best read of the
      real code, not confirmed with you.
- [ ] Supermetrics: on hold indefinitely per Chris.
- [ ] Media Gallery for the empty space on the home page.
- [ ] GTA6 Guide template.
- [ ] Forum Discord section — replace generic image with real one.
