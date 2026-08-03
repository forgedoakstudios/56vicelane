# 56ViceLane — Daily Checklist

**Generated:** 2026-08-03 (Central Time)
**How this works:** one list, updated daily. Check things off yourself by
editing this file (change `- [ ]` to `- [x]`), or tell me and I'll check
them off. Each day I regenerate this — anything still unchecked carries
forward, anything new gets added, and you get a fresh copy to download.
Full history/detail always lives in `THIS-WEEK.md` and `NEXT-SESSION.md`.

---

## 🚨 Urgent

- [ ] **Revoke the OLD Airtable Personal Access Token.** The token itself
      is rotated (see below) — new one is live in all 31 files on `main`.
      Last step: revoke the old token in Airtable's token settings
      (airtable.com/create/tokens) so the previously-exposed one actually
      stops working. Chris to do this on his own timeline.

## Needs a decision from you

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
- [ ] **Dell monitor swap — still drafted, needs your merge approval.**
      Swapped the "Top Pick" monitor card from the LG 27" to the Dell
      S2725QS (4x higher sales volume), wired to your direct
      `amzn.to/4x8an7V` link. Sitting on `claude/dell-monitor-swap`, not
      merged to `main`.
- [ ] **Razer Blade laptop article — still drafted, needs your review
      before it goes live.**
      `drafts/tech/gta6-best-gaming-laptops-launch-day.html`, framed around
      the eventual 2027 PC release (not the Nov 19 console-only launch).
      Sitting on a branch, not merged.
- [ ] **Two buyer's-guide articles — still drafted, need review before
      publishing.** `drafts/tech/gta6-best-controllers-buyers-guide.html`
      and `drafts/tech/gta6-best-gaming-headsets-buyers-guide.html` —
      per-product breakdowns, quick-jump sidebar, comparison tables, rating
      chart, real product photos wired in. Not yet added to `articles.json`
      or linked from the site.
- [ ] **More affiliate programs — partially worked, still open items.**
      G FUEL approved (Awin, publisher ID 3009641), Logitech G accepted,
      Secretlab done. Turtle Beach and the Impact network still not applied
      to. See `audit/2026-07-28-affiliate-program-signups.md`.
- [ ] Last Drive homepage preview — need a real video source (YouTube link
      or mp4). The OpenArt test-video idea is still open if you want to use
      this as the test case.
- [ ] Weekly Winner Selection — rewired off Airtable, tested clean, left
      inactive. Enabling it is your call.
- [ ] `gear.html` search-links only partially fixed — headsets, HyperX
      Cloud Alpha, and the Dell monitor now use real direct product links;
      the remaining controller cards (DualSense, DualSense Edge, Xbox
      Wireless, Xbox Elite Series 2) still point to generic Amazon search
      results, not a specific product page. Real photos are wired in for
      all of them either way.
- [ ] External citation links in article bodies (11 found) and live
      redirect/404 behavior haven't been checked yet — the 7/31 audit hit a
      403 on all outbound network calls (including 56vicelane.com itself),
      so this was skipped. Worth a dedicated pass if live-link health
      matters right now.
- [ ] **store.html's own n8n wiring still not built.** Purchase/plate-grant
      code still reads/writes Airtable directly — needs a session with
      PayPal sandbox access. Practical gap: any member who signed up via
      `lastdrive.html` after the 2026-08-02 `USE_N8N_BACKEND` flip exists
      only in the n8n LastDrive Data Table, not Airtable — store.html's
      profile lookup won't find them until this is done.
- [ ] **New idea logged, not built: daily login streak / loyalty program.**
      Chris floated this 7/31 as "just an idea," not approved for a build
      yet. Escalating daily currency for consecutive logins, 7-day streak
      reward = a program-exclusive nameplate ("The Hard Way" — animated
      chopper-rotor SWAT design), 30-day reward = pick of an existing
      bundle. Full mechanic + open questions in `NEXT-SESSION.md` section
      6. Say the word if you want this scoped for a real build.

## Shelved — revisit late August 2026

- [ ] AdSense resubmission — confirmed with Chris the real blocker is site
      age/traffic history, not a content-policy issue. Revisit once the
      site has more history behind it.

## Cancelled / not pursuing

- [x] ~~Trevor/Danny per-platform social accounts~~ — cancelled 2026-07-28.
- [x] ~~Adult-toy-store affiliate invite~~ — Chris's own call: "just a funny
      thought," not a real plan. No action taken.

## Done recently

- [x] **Airtable Personal Access Token rotated, 2026-08-03.** Chris
      generated a new token scoped to the Last Drive base
      (`data.records:read`/`write`). Swapped it in across all 31 files
      that had the old one hardcoded — literal string swap, no logic
      changed. Verified live on `main` via fresh clone: new token present
      everywhere, zero traces of the old one left. Old token still needs
      revoking in Airtable's dashboard — see Urgent, above.
- [x] **Missing Facebook share button fixed on 23 articles, 2026-08-03.**
      Found while investigating a report that an article's share button
      posted to a Facebook group with no article attached — 23 of 73
      articles were running an older share-bar variant that never included
      a direct Facebook sharer link (fell through to the OS share sheet
      instead, which doesn't reliably hand Facebook a link/preview). Added
      the missing button (matching each file's own naming convention across
      3 different schemes in use) plus one file with no share bar at all,
      and the missing `.share-facebook` CSS rule for ~15 articles using the
      shared stylesheet. Verified rendering across all 3 naming schemes in
      a browser before committing.
- [x] **`STORE_MAINTENANCE` flipped off, 2026-08-02.** Airtable's quota
      reset landed Aug 1 but the store's paused-until-Aug-1 message and
      kill switch never got flipped back — a real member reported it live
      on mobile, purchases were blocked. Turned `STORE_MAINTENANCE` back
      off in `store.html` (existing Airtable-direct code, unchanged
      otherwise) so purchases and profile lookups work again. Verified
      live on `main`. Kept the flag in place as a manual kill switch for
      any future backend incident. See the still-open store.html/n8n gap
      above — that's separate, unbuilt work.
- [x] **Airtable quota reset confirmed + one-time historical import
      complete, 2026-08-02.** Ran the one-time Airtable → n8n Data Table
      migration; caught a real bug on the first attempt (field-mapping
      code read `item.json.X` instead of `item.json.fields.X`, so every
      inserted row came out blank despite reporting success) — fixed,
      cleared the 105 corrupted rows, re-ran clean. Verified row counts
      match Airtable exactly plus a field-by-field spot check.
      `audit/2026-08-02-airtable-import-complete.md`.
- [x] **`USE_N8N_BACKEND` flipped live, 2026-08-02.** `track.js`,
      `members.html`, `lastdrive.html` now write real signups/points/
      lookups to the migrated n8n Data Tables instead of Airtable.
      `store.html` NOT included (separate item, above). Rollback is a
      one-line flag revert per file if needed.
- [x] **Nightly audit Routine's root cause found and fixed, 2026-07-31.**
      It had been running and producing real findings all along — but
      writing its report to a garbled filename (its own heading text)
      instead of `audit/YYYY-MM-DD-audit.md`, which is why 2 prior nights
      looked like silent failures. Findings re-verified directly against
      the files (one of 4 claims didn't hold up, left untouched), 3 real
      fixes applied and pushed. `audit/2026-07-31-audit.md`.
- [x] **Last Drive Push — 30-day posting campaign, live.** 2x/day (10am +
      8pm CT), 20 rotating captions linking to `/lastdrive`, across
      X/Instagram/Facebook/Discord. Self-terminates after 2026-08-29.
      `audit/2026-07-30-last-drive-push-campaign.md`.
- [x] **Affiliate product images — done.** All 26 real product photos
      wired into `gear.html`'s 8 cards as rotating carousels.
- [x] Swapped HyperX Cloud II for HyperX Cloud Alpha (4k vs <400 sales/mo
      for the outgoing pick) — wired to the direct `amzn.to` link.
- [x] Built the two thorough buyer's-guide drafts (controllers, headsets) —
      see "Needs a decision," above, for their review status.
- [x] Evergreen Recycle Poster's engagement-prompt pool expanded 5 → 30 so
      a full month of twice-daily rotation won't visibly repeat.
- [x] Diagnosed and fixed two real bugs in the Blotato video pipeline, then
      found a deeper rights problem and a third bug — net result: pipeline
      paused, not shipped.
- [x] Built an approval-gate + multi-platform publish flow (Twitter,
      Facebook, TikTok) for whenever video generation resumes.
- [x] Added `Evergreen Recycle Poster` (n8n, active) — 2 extra posts/day
      mixing recycled articles, store/product promos, and engagement
      prompts.

## Carried over from this week (not yet done)

- [ ] Review the n8n migration's 3 field fixes (linkedSlot order,
      founder-plate logic, joinStatus/approval flow) — my best read of the
      real code, not confirmed with you.
- [ ] Supermetrics: on hold indefinitely per Chris.
- [ ] Media Gallery for the empty space below Last Drive Preview on home
      page.
- [ ] GTA6 Guide template.
- [ ] Forum Discord section — replace generic image with real one.
