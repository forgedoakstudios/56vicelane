# 56ViceLane — Daily Checklist

**Generated:** 2026-07-30 (Central Time)
**How this works:** one list, updated daily. Check things off yourself by
editing this file (change `- [ ]` to `- [x]`), or tell me and I'll check
them off. Each day I regenerate this — anything still unchecked carries
forward, anything new gets added, and you get a fresh copy to download.
Full history/detail always lives in `THIS-WEEK.md` and `NEXT-SESSION.md`.

---

## 🚨 Urgent

- [ ] **Rotate the Airtable Personal Access Token.** Found hardcoded in
      plain public HTML across 30 files. The Aug 1 quota reset has now
      happened (confirmed live) — this token is live/reachable again,
      worth doing now.
- [x] **Aug 1 historical import — done and verified, 2026-08-02.** Ran
      the one-time Airtable → n8n migration. Caught a real bug on the
      first attempt: the field-mapping code read `item.json.X` instead of
      `item.json.fields.X`, so every inserted row came out blank despite
      reporting success. Fixed, cleared the 105 corrupted rows, re-ran
      clean. Verified row counts match Airtable exactly (LastDrive 41/41,
      PageStats 64/64, PointsLedger 0/0, Redemptions 0/0) plus a
      field-by-field spot check on a real record. Full writeup:
      `audit/2026-08-02-airtable-import-complete.md`.
- [x] **Nightly site audit — root cause found.** It DID run and produce
      real findings on 2026-07-31, but wrote them to a garbled filename
      (`audit/## Nightly audit findings, 2026-07-31 — real code fixes,
      not yet applied`) instead of the `audit/YYYY-MM-DD-audit.md` path
      it referenced in its own text — looks like it wrote its intended
      heading as the filename by mistake. That explains the "zero report
      files" symptom on the prior 2 nights too. Cleaned up: findings
      re-verified against the real files (one of its 4 claims didn't
      actually check out — see `audit/2026-07-31-audit.md`), 3 real fixes
      applied and pushed, garbled file removed. The Routine's own
      file-writing logic still needs a look so this doesn't recur.

## Needs a decision from you

- [x] **`USE_N8N_BACKEND` flipped live, 2026-08-02.** Confirmed on
      `main` via independent fresh clone: `track.js`, `members.html`,
      `lastdrive.html` all now write real signups/points/lookups to the
      migrated n8n Data Tables instead of Airtable. Verified before
      flipping: client correctly calls the n8n webhooks (confirmed exact
      request URLs), and the server side confirmed correct via direct
      workflow execution (List Members webhook returns real migrated
      data matching Airtable exactly). Couldn't observe the live
      browser↔n8n round-trip from this sandbox (its own network egress
      policy blocks external hosts) — not a functional issue, a
      testing-environment limitation. Rollback is a one-line flag
      revert in each file if anything looks wrong.
      `store.html` is NOT included — its n8n wiring was never built
      (separate item, needs PayPal sandbox access).
- [ ] **Blotato AI video generation — still paused, needs a direction.**
      Unchanged: three separate failures in one day (rights-content scare,
      two nested-response mapping bugs, then lorem-ipsum placeholder text
      baked into on-screen scene graphics — a Blotato template bug). All
      three pieces stay deactivated until you pick a direction: report the
      placeholder-text bug to Blotato support and wait for a fix, or move to
      OpenArt (viability writeup done, needs the $29/mo Advanced plan, not
      set up yet). See `audit/2026-07-28-blotato-video-pipeline-fix.md`.
- [ ] **Amazon Associates — plan set, waiting on execution.** Unchanged:
      let the current account lapse, then apply fresh under the studio
      email once the old one actually closes. Once the new tag exists, it's
      a same-session fix: swap `tag=56vicelane-20` across all files that use
      it.
- [ ] **Dell monitor swap — drafted, needs your merge approval.** Swapped
      the "Top Pick" monitor card from the LG 27" to the Dell S2725QS (4x
      higher sales volume), wired to your direct `amzn.to/4x8an7V` link.
      Sitting on `claude/dell-monitor-swap`, not merged to `main`.
- [ ] **Razer Blade laptop article — drafted, needs your review before it
      goes live.** `drafts/tech/gta6-best-gaming-laptops-launch-day.html`,
      framed around the eventual 2027 PC release (not the Nov 19
      console-only launch). Sitting on a branch, not merged.
- [ ] **Two new buyer's-guide articles — drafted, need review before
      publishing.** `drafts/tech/gta6-best-controllers-buyers-guide.html`
      and `drafts/tech/gta6-best-gaming-headsets-buyers-guide.html` —
      thorough per-product breakdowns with a quick-jump sidebar, comparison
      tables, and a rating chart for each. Real product photos wired in.
      Not yet added to `articles.json` or linked from the site.
- [ ] **More affiliate programs — partially worked, still open items.**
      G FUEL approved (Awin, publisher ID 3009641), Logitech G accepted,
      Secretlab done. Turtle Beach and the Impact network still not applied
      to. See `audit/2026-07-28-affiliate-program-signups.md`.
- [ ] Last Drive homepage preview — need a real video source (YouTube link
      or mp4). The OpenArt test-video idea is still open if you want to use
      this as the test case.
- [ ] Weekly Winner Selection — rewired off Airtable, tested clean, left
      inactive. Enabling it is your call.
- [ ] `gear.html` search-links only partially fixed — the headsets/HyperX
      Cloud Alpha/Dell monitor now use real direct product links, but the
      remaining controller cards (DualSense, DualSense Edge, Xbox Wireless,
      Xbox Elite Series 2) still point to generic Amazon search results, not
      a specific product page. Real photos are wired in for all of them
      either way.

## Shelved — revisit late August 2026

- [ ] AdSense resubmission — confirmed with Chris the real blocker is site
      age/traffic history, not a content-policy issue. Revisit once the
      site has more history behind it.

## Cancelled / not pursuing

- [x] ~~Trevor/Danny per-platform social accounts~~ — cancelled 2026-07-28.
- [x] ~~Adult-toy-store affiliate invite~~ — Chris's own call: "just a funny
      thought," not a real plan. No action taken.

## Done recently

- [x] **2026-07-31 nightly audit findings fixed and pushed to `main`:**
      fixed 8 broken self-share links (wrong slug) on the Trailer-3-window
      article; standardized `canonical`/`og:url` to the extensionless
      form on the 20 articles that still had `.html`; made 12 articles'
      relative `og:image`/`twitter:image` absolute. A claimed 4th finding
      (duplicate "Trevor" `og:title`) didn't check out on inspection —
      left untouched. Full detail in `audit/2026-07-31-audit.md`.
- [x] **Affiliate product images — done.** All 26 real product photos
      (DualSense, DualSense Edge, Xbox Wireless Controller, Xbox Elite
      Series 2, Sony Pulse 3D, Arctis Nova Pro, Xbox Wireless Headset,
      HyperX Cloud Alpha) pulled from Chris's Google Drive folder and wired
      into `gear.html`'s 8 cards as rotating carousels (cycles through each
      product's shots automatically). Verified rendering in a browser,
      merged to `main`.
- [x] Swapped HyperX Cloud II for HyperX Cloud Alpha (4k vs <400 sales/mo
      for the outgoing pick) — wired to the direct `amzn.to` link.
- [x] Built the two thorough buyer's-guide drafts (controllers, headsets)
      with quick-jump sidebar nav, per-product breakdowns, comparison
      tables, and CSS-only rating charts — see "Needs a decision," above,
      for their review status.
- [x] Nightly site audit — built as a Claude Code Remote Routine (not an
      n8n workflow, sidesteps the missing n8n GitHub credential). Fires
      midnight CT. Root-cause of its "no reports" symptom found and fixed
      2026-07-31 — see the entry above.
- [x] Evergreen Recycle Poster's engagement-prompt pool expanded 5 → 30 so
      a full month of twice-daily rotation won't visibly repeat.
- [x] Consolidated and merged all of 7/28's work to `main` (Blotato pause,
      Evergreen Recycle Poster, GitHub Actions fixes, affiliate log, the
      laptop draft) after Chris's review and go-ahead.
- [x] Diagnosed and fixed two real bugs in the Blotato video pipeline
      (null `video_id` mapping, `Is Done?` condition never matching), then
      found a deeper rights problem and a third bug (placeholder scene
      text) — net result: pipeline paused, not shipped.
- [x] Built an approval-gate + multi-platform publish flow (Twitter,
      Facebook, TikTok) for whenever video generation resumes — sitting
      ready, unused while the pipeline's paused.
- [x] Fixed two real GitHub Actions bugs and merged to `main`:
      `Scheduled Article Publisher` and `Auto-Update articles.json`.
- [x] Added `Evergreen Recycle Poster` (n8n, active) — 2 extra posts/day
      mixing recycled articles, store/product promos, and engagement
      prompts across X/Instagram/Facebook/Discord.
- [x] Confirmed the Amazon Associates 180-day / 3-qualifying-sale rule and
      the Product Advertising API's requirements (now deprecated in favor
      of Amazon's Creators API).
- [x] Researched OpenArt as a possible AI video alternative.

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
