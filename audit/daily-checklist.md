# 56ViceLane — Daily Checklist

**Generated:** 2026-08-10, third pass same day (Central Time)
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
      old exposed token (see Done recently — the last 5 files carrying it
      were fixed today).

## Needs a decision from you

- [ ] **Do one real, low-value test purchase on the store** to confirm the
      PayPal fix (below) works end-to-end in production, including the
      plate/bundle actually getting granted — the synthetic test only
      proved the credential and rejection logic, not a full real grant.
- [ ] **Blotato AI video — still paused; OpenArt testing ongoing**
      (prompt notes in `audit/ai-video-prompt-notes.md`, not a full
      pipeline yet).
- [ ] **Dell monitor swap — still drafted, needs your merge approval.**
      Unchanged, sitting on `claude/dell-monitor-swap`.
- [ ] **Two buyer's-guide articles — still drafted, need review before
      publishing** (`drafts/tech/gta6-best-controllers-buyers-guide.html`,
      `drafts/tech/gta6-best-gaming-headsets-buyers-guide.html`). Correction:
      prior checklists carried a separate "Razer Blade laptop article —
      still drafted" line, but no file anywhere in the repo actually
      mentions Razer — that appears to have been a stale/mislabeled entry
      tracking the gaming-laptops draft below all along. Dropped as its
      own item.
- [ ] **More affiliate programs — Turtle Beach and Impact network still
      not applied to.** Note: `gear.html` now links a Turtle Beach product
      via the existing Amazon Associates tag (see Done recently) — that's
      not the same as a direct Turtle Beach affiliate relationship, so
      this item is still genuinely open, not just stale.
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

## Shelved — revisit late August 2026

- [ ] AdSense resubmission — real blocker is site age/traffic history.

## Cancelled / not pursuing

- [x] ~~Trevor/Danny per-platform social accounts~~ — cancelled 2026-07-28.
- [x] ~~Adult-toy-store affiliate invite~~ — "just a funny thought."

## Done recently

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
      your list: Pulse 3D → PULSE Elite, Xbox Wireless Headset → Turtle
      Beach Stealth 600, Cloud Alpha → Cloud Alpha Wireless, LG C3 OLED →
      LG C6 OLED evo AI 4K (2026) Bundle (C3 pulled — too many returns),
      RTX 4070 Super → RTX 5060 Ti 16GB OC Edition, generic PS5 charging
      station → OIVO PS5 Controller Charger, TP-Link WiFi 6E → TP-Link
      BE9700 WiFi 7. Added a second Govee TV backlight card (55-65",
      bestseller) alongside the existing 75-85" one. Monitors section also
      got real product photos for the first time — it was showing emoji
      placeholders before. 22 new product photos pulled from the shared
      Drive folder into `/images/gear/`. Three photo mismatches (Pulse
      Elite, Turtle Beach, TP-Link) were flagged for review — Chris looked
      at them live and confirmed they're fine as-is, closed.
- [x] **Airtable token fully removed sitewide, 2026-08-10.** The last 5
      files carrying it — `track.js`, `members.html`, `lastdrive.html`,
      `contact.html`, `admin.html` — are all clean now (repo-wide grep for
      the token literal returns zero matches). Two of these were dead code
      (track.js/members.html had `USE_N8N_BACKEND` already flipped true, so
      the Airtable branches never actually ran — just deleted them).
      `lastdrive.html` and `admin.html` had real live call sites with no
      n8n equivalent yet, so built 5 new n8n webhooks to cover the actual
      gaps: `LastDrive - List Drives`, `Submit Contact Form`, `Admin - List
      Contacts` (new `ContactSubmissions` data table, since the old
      Airtable Contact table is now dead), `Admin - List Signups`, `Admin -
      Gift Plates`. Bonus find: the old direct-Airtable "browse available
      drives" query in lastdrive.html was reading a frozen pre-cutover
      Airtable snapshot — drives signed up after the n8n migration never
      showed up in that browser. Fixed as part of the same swap. Also
      dropped an Email field the old query fetched but never actually
      rendered anywhere — one less PII field exposed for no reason.
- [x] **Live secret exposure found and fixed, 2026-08-09.** The
      `gta6-best-gaming-laptops-launch-day.html` draft — the one carrying
      the hardcoded Airtable token flagged in prior checklists — got
      auto-published to `/articles/` by the drafts FIFO publisher on
      8/8 (13:39 UTC, tech slot), which meant a real, currently-valid
      Airtable PAT was live and publicly readable in a shipped page's
      source, actively used for read/write calls to the ArticleRatings/
      ArticleComments tables. Caught while reconciling git history for
      this checklist. Fixed same-turn: swapped the direct Airtable calls
      for the same `submit-rating`/`submit-comment`/`list-comments` n8n
      webhooks every other article already uses, keeping this article's
      own custom markup/IDs intact rather than a full template rewrite.
      Verified no remaining references to the token or the raw Airtable
      API in the file. This is also why the file count on the Urgent
      Airtable-token item above dropped from 6 to 5 — this was one of
      them.
- [x] **PayPal purchase verification fixed and verified, 2026-08-07.** The
      "PayPal API - Live" credential was never attached to the "Store -
      Verify Purchase (PayPal)" workflow's "Get PayPal Token" node — every
      real purchase would have failed with no fallback. Flagged 3
      checklists running before Chris caught it and asked directly.
      Credential wired, tested with a synthetic invalid order (real OAuth
      token returned, fake order correctly rejected, no grant issued). Full
      writeup: `audit/2026-08-07-paypal-credential-wired.md`. This also
      closed store.html's last piece of exposed Airtable surface — same
      session, confirmed clean via direct grep today.
- [x] **Take-Two Q1 FY2027 earnings call article written and published,
      2026-08-07** — same-day coverage of the actual earnings call: $1.39B
      Q1 beat, FY2027 guidance raised to $8-8.2B tied explicitly to GTA6
      confidence, Nov 19 reaffirmed, and the Aug 27 Netflix extended-look
      partnership confirmed on record. Cross-checked against independent
      same-day IGN/GameSpot/Insider Gaming coverage for the date. Two
      follow-up fixes same day after Chris caught real rendering bugs on
      first view: the top hero image was rendering at full uncropped size
      (missing aspect-ratio/object-fit, inherited from the older article
      template) — fixed; then simplified further per Chris's direction —
      dropped the separate dimmed background-image-behind-text overlay
      entirely and just used the rotating header image as the actual hero,
      with headline text in normal flow below it instead of overlaid.
- [x] **Netflix GTA6 Extended Look announcement covered, 2026-08-06** —
      same-day news article plus a Part 2 covering fan backlash reaction
      to the 6-hour Netflix-exclusive window.
- [x] **Fri/Sat scheduled articles moved to a dedicated `scheduled/`
      folder + n8n-backed publisher, 2026-08-06.** Found that leaving
      pre-written Netflix follow-ups in `articles/` risked them going
      live early via the unconditional `articles.json` auto-rebuild —
      neither that scanner nor the drafts FIFO publisher looks at
      `scheduled/`, so timing is now actually enforced.
- [x] **news-scan hanging indefinitely on a slow/unresponsive RSS feed —
      fixed, 2026-08-06.** Real reliability bug.
- [x] **Leaderboard linked sitewide + visual streak calendar + newsletter
      disclosure, 2026-08-06.** Leaderboard existed but wasn't reachable
      from any main nav — fixed across both nav patterns in use (~80
      articles + 18 top-level pages, plus player.html/store.html's
      separate pattern).
- [x] **leaderboard.html rebuilt to match the site's actual theme,
      2026-08-06.**
- [x] Ratings/comments fully migrated off client-side Airtable, 2026-08-05.
- [x] All 82 pages retrofit onto a shared share-bar component, 2026-08-05.
- [x] Sitewide image compression, 2026-08-05 — 465MB → 219MB.
- [x] Sitewide n8n webhook URLs fixed, 2026-08-06 (was silently breaking
      Wall of Honor, player verify, admin login, purchases, ratings/
      comments, and more).
- [x] Admin login auth bypass fixed + index/leaderboard/wall migrated off
      Airtable, 2026-08-05.
- [x] player.html and store.html migrated off the exposed Airtable token,
      2026-08-05 (purchase verification itself now also fixed — see above).
- [x] Daily check-in loyalty system shipped, 2026-08-06 (streak, recovery,
      announcement cards).
- [x] Last Drive video added to the homepage, 2026-08-06.
- [x] Airtable Personal Access Token rotated, 2026-08-03.
- [x] `STORE_MAINTENANCE` flipped off + Airtable quota reset/import
      complete, 2026-08-02.
- [x] `USE_N8N_BACKEND` flipped live for track.js/members.html/
      lastdrive.html, 2026-08-02.
- [x] Nightly audit Routine's filename bug found and fixed, 2026-07-31.
- [x] Last Drive Push — 30-day posting campaign, live (self-terminates
      2026-08-29).
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
