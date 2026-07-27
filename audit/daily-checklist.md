# 56ViceLane — Daily Checklist

**Generated:** 2026-07-27 (Central Time)
**How this works:** one list, updated daily. Check things off yourself by
editing this file (change `- [ ]` to `- [x]`), or tell me and I'll check
them off. Each day I regenerate this — anything still unchecked carries
forward, anything new gets added, and you get a fresh copy to download.
Full history/detail always lives in `THIS-WEEK.md` and `NEXT-SESSION.md`.

---

## 🚨 Urgent, but not until closer to Aug 1

- [ ] **Rotate the Airtable Personal Access Token.** Found hardcoded in
      plain public HTML across 30 files (articles, members.html, store.html,
      track.js, more). Anyone can view-source it — normally urgent, but
      **Chris's call (2026-07-27): the token is dead until the Airtable
      quota resets Aug 1 anyway (429 on every call), so it's inert right
      now regardless of who has it.** Deprioritized until closer to Aug 1
      — revisit and rotate before the reset, not today. n8n migration does
      NOT cover this (4 tables migrated — LastDrive/Members, PointsLedger,
      PageStats, Redemptions — ratings/comments were never in scope), so
      this still needs a manual rotation + code patch when we come back to it.

## Needs a decision from you

- [ ] Last Drive homepage preview — need a real video source (YouTube link
      or mp4) to replace the static placeholder image.
- [ ] Affiliate link images — still an open question from your own list.
- [ ] **7 new articles ready on branch `claude/friendly-feynman-3scinq`,
      waiting on your go-ahead to push to `main`.** Covers the Jul 23-27
      news-scan backlog: region-lock/expiration two-part series, GTA6
      Trailer 3 (Aug 6) prediction, Rockstar union story, an AI-slop
      Editor's Desk + Trevor's Take pair, and a fan-projects roundup
      (Switch port + multiverse mod). See
      `audit/2026-07-27-content-sprint-social-log.md` for the full
      breakdown of what's written and what's queued per platform.

## Shelved — revisit late August 2026

- [ ] **AdSense resubmission.** Chris's call (2026-07-27): the site needs
      more age/traffic history before AdSense will approve it regardless
      of content edits, so hold off and resubmit once it's older — ideally
      before the Nov 19 launch. On closer inspection neither of my first
      two theories (article-cluster duplication, thin gear.html copy)
      actually held up: the article clusters are legitimate developing-
      story coverage that already cross-links internally, and gear.html
      already has real per-product original copy (my initial "thin
      content" read was based on a bad heuristic — counting `<p>` tags,
      which missed the actual `gear-desc`/`gear-why` copy). The indexing
      fixes from today (noindex tags, canonical tags, sitemap gaps) are
      still worth having whenever resubmission happens.

## Cancelled (2026-07-27)

- [x] ~~Trevor/Danny per-platform social accounts~~ — Chris: ignore, cancel this.

## Done today (2026-07-27)

- [x] Fixed news.html/archive.html: month-grouped News hub, dynamic
      Archive, left-rail "Archive by Month" sidebar on both pages.
- [x] Found + fixed sitewide ticker drift (5+ different speeds, 3+ font/
      color variants across ~70 files) — unified to 40s, .88rem, black
      text, everywhere, including both article templates so new articles
      won't drift again.
- [x] Fixed blotter article titles — was a decorative serif font that read
      as "script," swapped to bold Barlow Condensed across all 8.
- [x] Forced one exact body font-size across every content page — no more
      page-to-page reading-size inconsistency. Bumped to 20px, then Chris
      called it back down same-day (20 looked zoomed in) — settled at 18px.
- [x] Documented the main-push approval rule in `CLAUDE.md` (build → you
      approve → then it ships to `main`).
- [x] Found the Airtable token security issue (see urgent, above).
- [x] Found and fixed the *real* ticker speed bug on archive/about/contact/
      shop.html — declared duration was already 40s everywhere, but those
      4 pages crammed all 66 articles into the scroll uncapped (vs. 10
      everywhere else), so same time = ~6x more content = ~6x faster.
      Capped at 10, matched everyone else's exact scroll technique.
- [x] Retrofitted hero images into all 20 legacy articles that had no
      hero slot at all (pre-dated the hero-image template).
- [x] All of today's approved work pushed to `main` and live: month-nav
      sidebar, ticker unification + real-speed fix, blotter font, 18px
      body text sitewide, hero image retrofit.
- [x] Indexing audit (triggered by the AdSense rejection): removed
      accidental noindex tags from 5 live articles that were being
      hidden from Google despite being in the sitemap; added missing
      canonical tags to 20 articles; added editor.html/trevor.html/
      weekly.html to the sitemap (they existed but were never in it);
      removed an orphaned duplicate weekly-bonuses.html at the repo
      root. robots.txt and the 66-article sitemap↔disk match were both
      already clean.
- [x] Built a scored affiliate-program shortlist (ease of acceptance /
      fit / type match, 1-10 each) covering gaming hardware, snacks &
      energy drinks, and home electronics/mini-fridges, plus broad
      networks (Impact, ShareASale/Awin) as a multi-category option.
      Delivered as an artifact; revisit alongside the AdSense
      resubmission in late August.
- [x] Wrote 7 articles from the missed news-scan backlog (see "Needs a
      decision," above) — on branch, not yet live.
- [x] Extended the `Article → Social Blast` n8n workflow, which
      previously only posted to X + Instagram — it now also posts to
      Facebook and Discord (using the same Facebook page ID and Discord
      webhook the Friday Frequency column already uses). Test-validated
      (execution #2548). Applies automatically to any future article
      published through the `drafts/tech`/`drafts/other` pipeline.
- [x] Queued Bluesky posts for all 7 new articles in `social-queue.json`,
      scheduled to match each article's intended date — inert until the
      branch is merged (scheduled GitHub Actions only run against `main`).

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
- [ ] Affiliate program sign-ups — shortlist delivered 2026-07-27 (scored,
      see artifact); actually applying to any of them is Chris's action,
      not something I can do. Revisit with AdSense in late August.
- [ ] GTA6 Guide template.
- [ ] Forum Discord section — replace generic image with real one.
- [ ] Nightly site-audit n8n workflow — blocked on a GitHub PAT credential
      in n8n (contents:write on this repo).

## Blocked until Aug 1 (Airtable quota reset)

- [ ] Real member/points/redemption data export (workflow's built, needs a
      manual click in the n8n editor on/after Aug 1).
- [ ] Flip `STORE_MAINTENANCE` off in store.html once reviewed.
- [ ] Re-enable + manually run Weekly Winner Selection.
