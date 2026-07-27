# 56ViceLane — Daily Checklist

**Generated:** 2026-07-27 (Central Time)
**How this works:** one list, updated daily. Check things off yourself by
editing this file (change `- [ ]` to `- [x]`), or tell me and I'll check
them off. Each day I regenerate this — anything still unchecked carries
forward, anything new gets added, and you get a fresh copy to download.
Full history/detail always lives in `THIS-WEEK.md` and `NEXT-SESSION.md`.

---

## 🚨 Needs you today — urgent

- [ ] **Rotate the Airtable Personal Access Token.** Found hardcoded in
      plain public HTML across 30 files (articles, members.html, store.html,
      track.js, more). Anyone can view-source it. Go to your Airtable
      account → Developer Hub → Personal Access Tokens, revoke
      `pattxJ12NQzpHMejD...`, issue a new one. Tell me once it's rotated —
      some call sites already have an n8n webhook replacement ready, others
      (article ratings/comments) don't yet and will need one built first.

## Needs a decision from you

- [ ] Push today's approved fixes to `main`? (ticker speed/styling, blotter
      font, sitewide 20px font-size, news/archive month-nav sidebar) — built,
      tested, sitting on `claude/friendly-feynman-3scinq`, waiting on your OK.
- [ ] Retrofit hero images into the 20 legacy articles that were generated
      before the hero-image template existed (no image slot at all right
      now, e.g. `gta6-everything-confirmed.html`) — want me to do this pass?
- [ ] Trevor/Danny per-platform social accounts — do handles already exist
      (need credentials) or do new accounts need creating first?
- [ ] Last Drive homepage preview — need a real video source (YouTube link
      or mp4) to replace the static placeholder image.
- [ ] Affiliate link images — still an open question from your own list.
- [ ] AdSense rejected 3x — send the actual rejection email/reason text if
      you want this diagnosed precisely instead of guessed at.

## Done today (2026-07-27)

- [x] Fixed news.html/archive.html: month-grouped News hub, dynamic
      Archive, left-rail "Archive by Month" sidebar on both pages.
- [x] Found + fixed sitewide ticker drift (5+ different speeds, 3+ font/
      color variants across ~70 files) — unified to 40s, .88rem, black
      text, everywhere, including both article templates so new articles
      won't drift again.
- [x] Fixed blotter article titles — was a decorative serif font that read
      as "script," swapped to bold Barlow Condensed across all 8.
- [x] Forced one exact body font-size (20px) across every content page —
      no more page-to-page reading-size inconsistency.
- [x] Documented the main-push approval rule in `CLAUDE.md` (build → you
      approve → then it ships to `main`).
- [x] Found the Airtable token security issue (see urgent, above).

## Carried over from this week (not yet done)

- [ ] Review the n8n migration's 3 field fixes (linkedSlot order,
      founder-plate logic, joinStatus/approval flow) — my best read of the
      real code, not confirmed with you.
- [ ] store.html purchase/plate-grant code still not rewired to n8n — needs
      a session with PayPal sandbox access, not a blind rewrite.
- [ ] Click through Supermetrics login links to authenticate real platforms
      (Facebook, Instagram, TikTok, X, YouTube).
- [ ] Set up Cloudinary.
- [ ] Store: audit bundle thumbnail grids for missing click handlers.
- [ ] Article image audit — wrong/mismatched og:images across ~66 articles.
- [ ] Article publishing cadence change (2 evergreen/wk, 3 two-part news
      series/wk, 3 Trevor satire/wk, 2 Editor posts/wk).
- [ ] Media Gallery for the empty space below Last Drive Preview on home
      page.
- [ ] More affiliate products/companies + GTA6 Guide template.
- [ ] Forum Discord section — replace generic image with real one.
- [ ] Nightly site-audit n8n workflow — blocked on a GitHub PAT credential
      in n8n (contents:write on this repo).

## Blocked until Aug 1 (Airtable quota reset)

- [ ] Real member/points/redemption data export (workflow's built, needs a
      manual click in the n8n editor on/after Aug 1).
- [ ] Flip `STORE_MAINTENANCE` off in store.html once reviewed.
- [ ] Re-enable + manually run Weekly Winner Selection.
