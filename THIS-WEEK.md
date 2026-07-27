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

## In progress (overnight, unattended)

- [ ] n8n webhook workflows replacing each direct-Airtable call site
      (verify player, signup, purchase/plate-grant, points tracking,
      redemption codes, founder count)
- [ ] Client-side JS (store.html, members.html, lastdrive.html, track.js)
      rewired to call n8n webhooks instead of Airtable — build/test only,
      not switched live
- [ ] Written cutover + real-data-migration plan for Aug 1 (needs your
      review before anything goes live)

## Needs you (tonight or whenever)

- [ ] Click through Supermetrics login links to authenticate real platforms
      — I can generate the links for Facebook, Instagram, TikTok, X,
      YouTube on request, but the actual login has to be you
- [ ] Set up Cloudinary — tomorrow, as agreed

## Queued, not started

- [ ] Wire the Google Drive category-hero-images into articles that don't
      have a specific hero (images confirmed accessible tonight — this is
      now unblocked, just needs the build)
- [ ] Canva → Blotato image pipeline: confirmed technically feasible
      tonight (Blotato posts via public `mediaUrls`, same pattern already
      used for the bundle-announcement posts) — first real test still
      pending
- [ ] News section: month-grouped rendering from articles.json,
      archive.html made dynamic instead of static
- [ ] Store: audit bundle thumbnail grids for missing click handlers
- [ ] Article image audit — wrong/mismatched og:images across ~66 articles
- [ ] Article publishing cadence change (2 evergreen/wk, 3 two-part news
      series/wk, 3 Trevor satire/wk, 2 Editor posts/wk)
- [ ] Media Gallery for the empty space below Last Drive Preview on home page
- [ ] More affiliate products/companies + GTA6 Guide template
- [ ] Forum Discord section — replace generic image with real Discord/community image
- [ ] Nightly site-audit n8n workflow — still blocked on a GitHub PAT
      credential in n8n (contents:write on this repo)

## Blocked until Aug 1 (Airtable quota reset)

- [ ] Real member/points/redemption data export from Airtable → n8n Data Tables
- [ ] Flip `STORE_MAINTENANCE` off in store.html once reviewed
- [ ] Re-enable + manually run Weekly Winner Selection (n8n workflow `xaFrOTpwgP4o4Nut`)
