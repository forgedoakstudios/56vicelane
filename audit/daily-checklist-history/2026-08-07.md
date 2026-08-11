# 56ViceLane — Daily Checklist

**Generated:** 2026-08-07 (Central Time)
**How this works:** one list, updated daily. Check things off yourself by
editing this file (change `- [ ]` to `- [x]`), or tell me and I'll check
them off. Each day I regenerate this — anything still unchecked carries
forward, anything new gets added, and you get a fresh copy to download.
Full history/detail always lives in `THIS-WEEK.md` and `NEXT-SESSION.md`.

---

## 🚨 Urgent

- [ ] **Store purchases are still likely broken — going on 3 days now.**
      Re-checked directly in n8n again: the "PayPal API - Live" credential
      still isn't attached to the "Store - Verify Purchase (PayPal)"
      workflow's "Get PayPal Token" node (workflow unchanged since
      2026-08-05 21:27 UTC). Every purchase routes through this with no
      fallback. This has now been flagged 3 checklists in a row without
      being picked up — worth a direct heads-up rather than assuming it'll
      surface on its own.
- [ ] **The Airtable token is still hardcoded in 6 files**, including a
      draft article (`drafts/tech/gta6-best-gaming-laptops-launch-day.html`)
      that has no reason to carry a live secret at all. See prior
      checklists for the full file list — unchanged since 8/6.
- [ ] Revoke the OLD (pre-8/3) Airtable Personal Access Token in Airtable's
      token settings — still open, Chris to do on his own timeline.

## Needs a decision from you

- [ ] **New content opportunity: Take-Two's Q1 FY2027 earnings call.**
      You sent over a recap — raised full-year guidance to $8-8.2B
      (explicitly tied to GTA6 confidence), the Aug 27 Netflix extended
      look confirmed on-record, GTA Online's Court Center Heist framed as
      a reactivation bridge to launch, and Zelnick dodging a direct
      $70-vs-$80 price commitment. The Netflix reveal + fan-backlash Part 2
      already published 8/6, but the earnings-call specifics (raised
      guidance, pricing non-answer, NBA2K27's Sept 4 reveal as context)
      aren't covered yet — real angle for a dedicated piece if you want it
      written up.
- [ ] **Blotato AI video — still paused; OpenArt testing ongoing**
      (prompt notes in `audit/ai-video-prompt-notes.md`, not a full
      pipeline yet).
- [ ] **Amazon Associates — still waiting on the new tracking tag.**
- [ ] **Dell monitor swap — still drafted, needs your merge approval.**
      Unchanged, sitting on `claude/dell-monitor-swap`.
- [ ] **Razer Blade laptop article — still drafted, needs review** (and
      the stray Airtable token pulled — see Urgent, above).
- [ ] **Two buyer's-guide articles — still drafted, need review before
      publishing.**
- [ ] **More affiliate programs — Turtle Beach and Impact network still
      not applied to.**
- [ ] Weekly Winner Selection — rewired off Airtable, tested clean, left
      inactive. Enabling it is your call.
- [ ] `gear.html` search-links only partially fixed — controller cards
      still point to generic Amazon search results, not direct products.
- [ ] External citation links in article bodies and live redirect/404
      behavior still haven't been checked (the 7/31 audit hit a 403 on
      outbound calls).
- [ ] store.html's remaining Airtable surface — same session as the
      PayPal credential fix above would likely knock both out together.

## Shelved — revisit late August 2026

- [ ] AdSense resubmission — real blocker is site age/traffic history.

## Cancelled / not pursuing

- [x] ~~Trevor/Danny per-platform social accounts~~ — cancelled 2026-07-28.
- [x] ~~Adult-toy-store affiliate invite~~ — "just a funny thought."

## Done recently

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
      2026-08-05 (purchase verification itself still not live — see
      Urgent, above).
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
