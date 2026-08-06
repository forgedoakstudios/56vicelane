# 56ViceLane — Daily Checklist

**Generated:** 2026-08-06 (Central Time)
**How this works:** one list, updated daily. Check things off yourself by
editing this file (change `- [ ]` to `- [x]`), or tell me and I'll check
them off. Each day I regenerate this — anything still unchecked carries
forward, anything new gets added, and you get a fresh copy to download.
Full history/detail always lives in `THIS-WEEK.md` and `NEXT-SESSION.md`.

---

## 🚨 Urgent

- [ ] **Store purchases are likely broken right now — PayPal credential
      exists but isn't wired up.** Checked directly in n8n, not assumed:
      a credential named "PayPal API - Live" exists (you created it), but
      the "Store - Verify Purchase (PayPal)" workflow's "Get PayPal Token"
      node has no credential actually attached to it. Every purchase
      (single plates, bundles, Pick 5) routes through this workflow now
      (shipped 8/5-8/6) with no fallback to the old direct-grant path — if
      the credential isn't wired, every purchase fails server-side. This
      is a real revenue-blocking gap, not a maybe. I didn't wire it myself
      since this task is scoped to report files only and it's live payment
      code — needs a deliberate session to attach the credential and
      verify a real order round-trip before you'd know purchases work
      again.
- [ ] **The Airtable token is still hardcoded in 6 files** (down from 11
      yesterday after a big migration push): `admin.html` (the
      stats/signups/plate-gifting/contacts portion — login itself is now
      server-side verified, this is the rest of the dashboard),
      `contact.html`, `members.html`, `track.js`, `lastdrive.html` (mostly
      dead code behind `USE_N8N_BACKEND = true` for the latter three, but
      still visible in page source), and
      **`drafts/tech/gta6-best-gaming-laptops-launch-day.html`** — a draft
      article with a live secret token in it, no reason it should be
      there at all.
- [ ] Revoke the OLD (pre-8/3) Airtable Personal Access Token in Airtable's
      token settings — still open, Chris to do on his own timeline.

## Needs a decision from you

- [ ] **Blotato AI video — still paused; OpenArt testing has quietly
      started.** Prompt-engineering notes being logged
      (`audit/ai-video-prompt-notes.md`), not a full pipeline yet. Worth
      confirming whether OpenArt is now the committed direction.
- [ ] **Amazon Associates — still waiting on the new tracking tag.**
      Old account expired 2026-08-02, new one signed up under the
      Forgedoakstudios email.
- [ ] **Dell monitor swap — still drafted, needs your merge approval.**
      Sitting on `claude/dell-monitor-swap`, not merged to `main`.
- [ ] **Razer Blade laptop article — still drafted, needs review** (and
      the stray Airtable token pulled out — see Urgent, above).
- [ ] **Two buyer's-guide articles — still drafted, need review before
      publishing.** Not yet added to `articles.json` or linked from the
      site.
- [ ] **More affiliate programs — partially worked, still open items.**
      G FUEL approved, Logitech G accepted, Secretlab done. Turtle Beach
      and the Impact network still not applied to.
- [ ] Weekly Winner Selection — rewired off Airtable, tested clean, left
      inactive. Enabling it is your call.
- [ ] `gear.html` search-links only partially fixed — headsets, HyperX
      Cloud Alpha, and the Dell monitor use real direct product links; the
      controller cards (DualSense, DualSense Edge, Xbox Wireless, Xbox
      Elite Series 2) still point to generic Amazon search results.
- [ ] External citation links in article bodies and live redirect/404
      behavior still haven't been checked — the 7/31 audit hit a 403 on
      all outbound calls and this was skipped.
- [ ] **store.html's own remaining Airtable surface + the PayPal gap
      above** — both live in the same file, same session would likely
      knock both out together.

## Shelved — revisit late August 2026

- [ ] AdSense resubmission — confirmed the real blocker is site
      age/traffic history, not a content-policy issue.

## Cancelled / not pursuing

- [x] ~~Trevor/Danny per-platform social accounts~~ — cancelled 2026-07-28.
- [x] ~~Adult-toy-store affiliate invite~~ — "just a funny thought."

## Done recently

- [x] **Daily check-in loyalty system shipped, 2026-08-06.** Streak
      tracking, recovery, and announcement cards — n8n backend
      (streakCount/lastCheckInDate/lastBrokenStreak/etc.) plus client UI.
      This is the idea logged 7/31 as "just an idea" — now actually built.
- [x] **Last Drive video added to the homepage, 2026-08-06** (both the
      hero and the preview card) — closes a backlog item open since late
      July.
- [x] **Sitewide n8n webhook URLs fixed, 2026-08-06.** Every webhook call
      was built as `webhook/<internal-webhookId>/<path>` instead of the
      correct `webhook/<path>` — silently 404ing on Wall of Honor, player
      verify/update, admin login, store purchases (PayPal verify/redeem/
      check-prize), members find-profile, Last Drive signup, ratings/
      comments, and the weekly Trevor/Editor feed. Confirmed correct URLs
      against each workflow directly, verified wall.html renders real data
      post-fix. `loyalty-banner.js`/`track.js` were already correct, which
      is why check-in/streaks quietly worked while everything else didn't.
- [x] **Admin login auth bypass fixed + index/leaderboard/wall migrated
      off Airtable, 2026-08-05.** admin.html's login fetched the
      AdminPass field straight from Airtable client-side — anyone with the
      token could read the password and skip login. Now server-side via a
      new n8n webhook that only ever returns success/fail. Also fixed a
      real bug found in the process: admin.html was reading from a
      nonexistent "ContactMessages" table (real one is "Contact").
- [x] **player.html and store.html migrated off the exposed Airtable
      token, 2026-08-05.** Both were full read/write self-service systems
      (profile edits, plate purchases, redemptions) authenticated only by
      "know this gamertag + email." Server-side re-verification on every
      write now, not just once at unlock. Found and fixed a real
      data-integrity gap (13 missing columns) before wiring any live code.
- [x] **store.html purchases routed through server-side PayPal
      verification, 2026-08-05** — see Urgent, above, for why this isn't
      actually live/working yet.
- [x] **Ratings/comments fully migrated off client-side Airtable,
      2026-08-05.** All 24 articles now call n8n webhooks via shared
      `ratings-comments.js` instead of embedding the token.
- [x] **All 82 pages retrofit onto a shared share-bar component,
      2026-08-05.** Replaced 163 hand-copied share-bar blocks with one
      shared component.
- [x] Sitewide image compression, 2026-08-05 — 465MB → 219MB.
- [x] Added real archives to `/editor` and `/trevor`.
- [x] 2-week editorial calendar built (Aug 5-18) + social hooks logged.
- [x] Airtable Personal Access Token rotated, 2026-08-03 (new token is
      itself now spread across the files listed under Urgent, above).
- [x] `STORE_MAINTENANCE` flipped off, 2026-08-02.
- [x] Airtable quota reset confirmed + one-time historical import
      complete, 2026-08-02.
- [x] `USE_N8N_BACKEND` flipped live, 2026-08-02 for track.js/members.html/
      lastdrive.html.
- [x] Nightly audit Routine's filename bug found and fixed, 2026-07-31.
- [x] Last Drive Push — 30-day posting campaign, live (2x/day, self-
      terminates 2026-08-29).
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
