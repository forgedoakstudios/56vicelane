# This Week — 56ViceLane Checklist

Week of 2026-07-27. Target for the mechanical items: Tuesday 7/29. Full
detail/history lives in `NEXT-SESSION.md` — this file is the fast-scan
version we check off together as we go.

**How this works:** every time something here gets done, I update this file
and commit it. If you finish something yourself (like an Airtable upgrade or
a Supermetrics login), tell me and I'll check it off.

---

## Done this week

- [x] Real X/Twitter link wired sitewide: https://x.com/56ViceLane
- [x] Discord invite mismatch resolved — either code works, no site change needed
- [x] CLAUDE.md operating brief created
- [x] Trevor's photo crop fixed, font size bumped sitewide
- [x] Internal linking: all 66 articles now cross-link to related content
- [x] Airtable free-plan quota incident: diagnosed (confirmed live via direct
      API test), Weekly Winner Selection workflow paused so it doesn't fail
      Friday, store purchases + profile verification actively paused
      (`STORE_MAINTENANCE` flag) instead of silently failing and taking
      payment for nothing
- [x] n8n Data Table migration started: schema designed, all 4 tables
      created (LastDrive, PointsLedger, PageStats, Redemptions) — see
      `audit/airtable-to-n8n-migration.md`. Continuing overnight via a
      scheduled Routine (every 2h, self-bound to this session).
- [x] Connector check: Google Drive confirmed working — Chris's
      category-hero-image folder is accessible (10+ images: GTA6 News,
      Rockstar News, GTA V variants)
- [x] Connector check: Cloudflare confirmed working (can see Workers incl.
      `56vicelane-publish`)
- [x] Connector check: Canva confirmed working (no brand kit configured yet,
      still usable for one-off generation)
- [x] Connector check: Supermetrics confirmed connected, but **no social
      platform is actually authenticated yet** (Facebook, Instagram, TikTok,
      X, YouTube all show `NOT_AUTHENTICATED`) — got a login link for
      Facebook Insights as proof; the rest need the same treatment
- [x] **n8n migration build phase — done overnight.** 10 webhook workflows
      built/tested/published (verify player, find profile, list members,
      grant plate, check/redeem prize, row count, signup, pageview
      tracking, points tracking). 3 real bugs caught and fixed before they
      could ship (wrong linkedSlot field order, missing founder-plate
      logic, hardcoded joinStatus breaking the Approval-Required flow).
      track.js/members.html/lastdrive.html rewired behind an off-by-default
      flag — nothing changed for real visitors yet. store.html's payment
      code deliberately left alone (see below). Full detail:
      `audit/airtable-to-n8n-migration.md`.
- [x] One-time Aug 1 data-export workflow built and ready (inactive,
      manual-run-only) — copies real Airtable data into the new tables
      with one click once the quota resets, so nothing needs to be built
      from scratch that day.

## Needs you (tonight or whenever)

- [ ] Click through Supermetrics login links to authenticate real platforms
      — I can generate the links for Facebook, Instagram, TikTok, X,
      YouTube on request, but the actual login has to be you
- [ ] Set up Cloudinary — tomorrow, as agreed
- [ ] Review the n8n migration's 3 field fixes (linkedSlot order,
      founder-plate logic, joinStatus/approval flow) — my best read of the
      real client code, not confirmed with you directly. Detail in
      `audit/airtable-to-n8n-migration.md`.
- [ ] store.html's purchase/plate-grant code was deliberately NOT rewired
      to n8n — 7 different payment-adjacent call sites, already blocked by
      STORE_MAINTENANCE anyway, needs a session with PayPal sandbox access
      rather than a blind rewrite. Backend workflows for it are built and
      tested; only the client wiring is outstanding.

## Done overnight (second pass, 2026-07-28)

- [x] **News section is now month-grouped, Archive is fully dynamic.**
      news.html pulls from articles.json grouped by month (current month
      first), capped at the last 60 days — permanent/historical articles
      stay visible regardless of age. archive.html no longer has 3
      hand-written fake entries; it now pulls everything older than that
      same 60-day window from articles.json for real, grouped by month.
      Verified by actually rendering both pages and reconciling all 66
      real articles against them — zero gaps, zero unintended dupes.
      Category filter pills on News still work unchanged.
- [x] ~~Wire Google Drive category-hero-images~~ — turned out this was
      **already done** in an earlier session (commit `ca07344`, all 11
      images already committed to `/images` and already wired into
      `vfCategoryArt()` in vf.js). Backlog note was stale; corrected here.

## Queued, not started

- [ ] Canva → Blotato image pipeline: confirmed technically feasible
      tonight (Blotato posts via public `mediaUrls`, same pattern already
      used for the bundle-announcement posts) — first real test still
      pending
- [x] Store: audit bundle thumbnail grids for missing click handlers —
      built per-bundle image gallery (all designs, watermarked previews,
      unlocks per-owned-design) instead of dead click areas
- [ ] Article image audit — wrong/mismatched og:images across ~66 articles
- [x] Article publishing cadence change (2 evergreen/wk, 3 two-part news
      series/wk, 3 Trevor satire/wk + 1 extra Vice City rant, 2 Editor
      posts/wk) — documented as a standing rule in CLAUDE.md
- [ ] Media Gallery for the empty space below Last Drive Preview on home page
- [ ] More affiliate products/companies + GTA6 Guide template
- [ ] Forum Discord section — replace generic image with real Discord/community image
- [ ] Nightly site-audit n8n workflow — still blocked on a GitHub PAT
      credential in n8n (contents:write on this repo)

## Blocked until Aug 1 (Airtable quota reset)

- [ ] Real member/points/redemption data export — workflow's built and
      ready (`JYgaHxAS3ErBAGX5`, "ONE-TIME: Aug 1 Airtable to Data Table
      Migration"), just needs a manual click in the n8n editor on/after
      Aug 1, then a row-count sanity check against Airtable
- [ ] Flip `STORE_MAINTENANCE` off in store.html once reviewed
- [ ] Re-enable + manually run Weekly Winner Selection (n8n workflow `xaFrOTpwgP4o4Nut`)
