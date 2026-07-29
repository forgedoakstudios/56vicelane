# 56ViceLane — Daily Checklist

**Generated:** 2026-07-29 (Central Time)
**How this works:** one list, updated daily. Check things off yourself by
editing this file (change `- [ ]` to `- [x]`), or tell me and I'll check
them off. Each day I regenerate this — anything still unchecked carries
forward, anything new gets added, and you get a fresh copy to download.
Full history/detail always lives in `THIS-WEEK.md` and `NEXT-SESSION.md`.

---

## 🚨 Urgent, but not until closer to Aug 1

- [ ] **Rotate the Airtable Personal Access Token.** Found hardcoded in
      plain public HTML across 30 files. Dead until the Aug 1 quota reset
      anyway — revisit and rotate before then, not today.

## Needs a decision from you

- [ ] **Blotato AI video generation — still paused, needs a direction.**
      Unchanged since 7/28: three separate failures in one day (rights-
      content scare, two nested-response mapping bugs, then lorem-ipsum
      placeholder text baked into on-screen scene graphics — a Blotato
      template bug, not fixable from here without guessing at their
      internal field schema). All three pieces (`Generate Daily Video`,
      `Check & Notify Pending Videos`, the hourly approval ping) stay
      deactivated until you pick a direction. Options: report the
      placeholder-text bug to Blotato support and wait for a fix, or move
      to OpenArt (viability writeup done, needs the $29/mo Advanced plan,
      not set up yet). See `audit/2026-07-28-blotato-video-pipeline-fix.md`.
- [ ] **Amazon Associates — plan set, waiting on execution.** Unchanged:
      let the current account lapse (zero purchases from 24 clicks in 30
      days, tail end of the 180-day window), then apply fresh under the
      studio email once the old one actually closes. Once the new tag
      exists, it's a same-session fix: swap `tag=56vicelane-20` across all
      19 files that use it.
- [ ] **Affiliate product images — in progress.** You're setting up a
      Google Drive folder with product images + a filename→product
      mapping; once shared, I'll pull them in, wire them into `gear.html`'s
      19 blocks, and swap the matching search-links over to direct product
      links at the same time (fixes the "search results, not a real
      product page" friction on every click). Nothing shared yet.
- [ ] **More affiliate programs — partially worked, still open items.**
      G FUEL approved (Awin, publisher ID 3009641), Logitech G accepted,
      Secretlab done. Razer's real commission structure turned out weak
      (peripherals pay 0%) — pivoted to a dedicated Blade-laptop article
      instead (see below) rather than dropping Razer outright. Turtle
      Beach and the Impact network still not applied to. See
      `audit/2026-07-28-affiliate-program-signups.md`.
- [ ] **Razer Blade laptop article — drafted, needs your review before it
      goes live.** `drafts/tech/gta6-best-gaming-laptops-launch-day.html`,
      framed around the eventual 2027 PC release (not the Nov 19
      console-only launch). Sitting on the branch, not merged.
- [ ] Last Drive homepage preview — need a real video source (YouTube link
      or mp4). Also the OpenArt test-video idea from earlier is still open
      if you want to use this as the test case.
- [ ] Weekly Winner Selection — rewired off Airtable, tested clean, left
      inactive. Enabling it is your call.

## Shelved — revisit late August 2026

- [ ] AdSense resubmission — site needs more age/traffic history first.

## Cancelled

- [x] ~~Trevor/Danny per-platform social accounts~~ — cancelled 2026-07-28
      ("half-asleep thought," Chris's words).

## Done recently

- [x] **Nightly site audit — built, live.** Runs as a Claude Code Remote
      Routine (not an n8n workflow — sidesteps the missing n8n GitHub
      credential entirely) at midnight CT, checks links/meta/OG tags/
      sitemap coverage/alt text, commits a dated report to `/audit/`
      straight to `main`. First fire triggered manually today (2026-07-29)
      — **report hasn't landed in the repo yet as of this checklist**,
      worth a look later today to confirm it actually completed.
- [x] Evergreen Recycle Poster's engagement-prompt pool expanded 5 → 30 so
      a full month of twice-daily rotation won't visibly repeat. Verified
      via test execution before re-enabling live posting.
- [x] Consolidated and merged all of 7/28's work to `main` (Blotato pause,
      Evergreen Recycle Poster, GitHub Actions fixes, affiliate log, the
      laptop draft) after your review and go-ahead.
- [x] Diagnosed and fixed two real bugs in the Blotato video pipeline
      (null `video_id` mapping, `Is Done?` condition never matching), then
      found a deeper rights problem and a third bug (placeholder scene
      text) — net result: pipeline paused, not shipped. See "Needs a
      decision," above.
- [x] Built an approval-gate + multi-platform publish flow (Twitter,
      Facebook, TikTok) for whenever video generation resumes — sitting
      ready, unused while the pipeline's paused.
- [x] Fixed two real GitHub Actions bugs and merged to `main`:
      `Scheduled Article Publisher` had been failing every run for ~11
      days (stale-draft crash), `Auto-Update articles.json` occasionally
      lost a push race. Both fixed, live.
- [x] Added `Evergreen Recycle Poster` (n8n, active) — 2 extra posts/day
      (1pm + 6pm CT) mixing recycled articles, store/product promos, and
      guaranteed-regular engagement prompts, across X/Instagram/
      Facebook/Discord. See `audit/2026-07-28-evergreen-recycle-poster.md`.
- [x] Confirmed the Amazon Associates 180-day / 3-qualifying-sale rule and
      the Product Advertising API's requirements (now deprecated in favor
      of Amazon's Creators API) — see "Needs a decision," above.
- [x] Researched OpenArt as a possible AI video alternative — has a real
      MCP server + developer API, Advanced tier ($29/mo) needed for
      commercial rights + Director. Not set up yet.

## Carried over from this week (not yet done)

- [ ] Review the n8n migration's 3 field fixes (linkedSlot order,
      founder-plate logic, joinStatus/approval flow) — my best read of the
      real code, not confirmed with you.
- [ ] store.html purchase/plate-grant code still not rewired to n8n — needs
      a session with PayPal sandbox access.
- [ ] Supermetrics: on hold indefinitely per Chris.
- [ ] Media Gallery for the empty space below Last Drive Preview on home
      page.
- [ ] GTA6 Guide template.
- [ ] Forum Discord section — replace generic image with real one.

## Blocked until Aug 1 (Airtable quota reset)

- [ ] Real member/points/redemption data export (workflow's built, needs a
      manual click in the n8n editor on/after Aug 1).
- [ ] Flip `STORE_MAINTENANCE` off in store.html once reviewed.
