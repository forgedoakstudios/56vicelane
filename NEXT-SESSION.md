# 56ViceLane — Next Session Backlog

Working branch: `claude/56vicelane-gta6-dev-37dq4z`. Production deploys from `main`
(Cloudflare Pages). Central Time. Budget-conscious — pace the big builds.

---

## Overnight report card (2026-07-27 → 2026-07-28)

**Airtable → n8n Data Table migration: build phase complete.** Full detail
in `audit/airtable-to-n8n-migration.md`. Short version:

- ✅ 10 n8n webhook workflows built, tested, published — covers all 15 real
  Airtable call sites (12 originally scoped + 3 found while actually
  reading the files: `loadMemberData()`, `isFirstSignup()`, `searchFriend()`).
- ✅ 3 real bugs caught and fixed before they could ship: wrong `linkedSlot`
  field order, missing founder-plate logic (was granting "Standard" to
  everyone instead of "Free Premium" for the first 100), hardcoded
  `joinStatus` that silently broke the Approval-Required drive flow.
- ✅ track.js, members.html, lastdrive.html rewired — but **OFF by default**
  behind `USE_N8N_BACKEND = false` in each file. Nothing changed for real
  visitors; this is purely available to flip once you review it.
- ⏸️ **store.html NOT touched.** It has 7 different places that write a
  member's plate (not one uniform pattern), it's real payment code, and it's
  already fully blocked by `STORE_MAINTENANCE` anyway — no urgency, and I
  didn't want to guess at payment field-mapping unattended overnight. The
  3 backend workflows it needs (Grant Plate, Check Pending Prize, Redeem
  Code) are built and tested; only the client wiring is left. Needs a
  session with PayPal sandbox access.
- 📝 Full cutover plan is written (Aug 1 data export → verify → wire
  store.html → your explicit approval → flip the flags → smoke test →
  rollback is a one-line flag revert). Nothing goes live without you saying so.

**Decision needed from you, no rush:** whether the `linkedSlot`/plate/
join-status fixes above match your actual intent — they're my best read of
the real client code, not confirmed with you directly.

**Also logged this session:** radio background-music licensing question
(see "4b" below) — you're checking sources yourself, no action needed from me.

---

## -1. Airtable Free-plan API quota hit (2026-07-27) — accepted downtime until Aug 1

Confirmed live via direct API test: `429 API billing plan limit exceeded` on
base `appVViGbmcu5gbn8B` ("56ViceLane Last Drive"). Chris's call: leave it
broken, don't upgrade, resumes automatically Aug 1.

**What's broken until Aug 1:** store.html nameplate purchases (PayPal still
charges, Airtable write fails, buyer gets nothing), members.html gamertag
verification, all track.js pageview/points writes (fail silently, no visible
error to visitors).

**Done:** paused n8n workflow `xaFrOTpwgP4o4Nut` (Weekly Winner Selection —
Top 3 + Trevor's Pick, was going to fire Fri 7/31 into the dead quota).
**Needs manual re-enable + a manual run once Aug 1 quota resets** — it won't
fire on its own since it's unpublished, and its normal Friday slot already
passed for this cycle.

**Done (2026-07-27, later same session):** store.html purchases and profile
verification are now actively paused, not just silently failing. Added a
`STORE_MAINTENANCE` flag (top of store.html's script block) that
short-circuits before any PayPal button renders (featured plate, bundles,
Pick 5, single-plate picker) and before the "Find My Profile" Airtable
lookup — visible banner + inline message explain the pause instead of a
confusing "Connection error." **This blocks a real risk**: without it,
PayPal would still capture payment even though the Airtable write that
grants the nameplate can't succeed. Verified via direct function invocation
in a headless browser — all 4 purchase paths short-circuit cleanly, zero
JS errors. **To restore after Aug 1 reset: set `STORE_MAINTENANCE = false`**
in store.html (search for the var declaration, has a comment marking it).

members.html's `findProfile()` (read-only profile search) and lastdrive.html's
signup forms are also hitting the same blocked quota — lastdrive.html
already shows an honest "Error — Try Again" on failure (not a false
success), so left alone. members.html shows a generic "Search error" —
cosmetic, not gated, since no money/data-loss risk there.

**Root cause, not yet fixed:** `track.js` is injected into every page by
`_worker.js` and fires an Airtable GET+PATCH/POST to `PageStats` on every
single pageview, anonymous or not — this is almost certainly what burned a
550-visitor site through the Free tier's monthly cap by day 27. Queued fix:
strip or heavily throttle the anonymous PageStats round-trip in track.js so
this doesn't reproduce in August regardless of plan tier. Not done this
session — deliberately deferred since it doesn't help until Aug 1 either way
and this session's priority was internal linking.

---

## 0. ACTIVE — July 2026 Improvements Punch List (Chris's list, 7/26)

Target: "by Tuesday" (7/29) for the mechanical items. AdSense/new handles are
external processes not fully on that clock — flagged below.

**Done (2026-07-27):**
- [x] Home page "Welcome Back To The Lane" photo is now clickable → links to
  new article `/articles/welcome-back-to-the-lane` (written same session).
- [x] Trevor's photo crop fixed (was showing chin/torso only) — added
  `object-position: top` to the homepage news-card thumb logic, the
  news.html card, and trevor.html's avatar.
- [x] Font size bumped site-wide: `html{font-size:18px}` in vicelane.css
  (was unset/16px default) — scales every rem-based element, including all
  article body text. Also applied to the blotter template + regenerated all
  8 existing blotter articles.
- [x] Social buttons on the home page now point to real profiles (IG, TikTok,
  YouTube, Facebook, Bluesky, Discord, X). X confirmed 7/27:
  https://x.com/56ViceLane — wired into both footer widgets + the topbar
  mini-widget (which also had IG/X/YT still on `#` placeholders, fixed same
  pass).
- [x] `CLAUDE.md` created at repo root — the standing Operating Brief, read
  automatically every session from here on.

**Resolved (2026-07-27):** Discord invite mismatch — Chris confirmed either
code works (`discord.gg/Ewe5T9eFs` or `discord.gg/ewdRcjsbg5`), so no site
change needed. forum.html's `discord.gg/ewdRcjsbg5` stays as-is.

**Needs a decision before it can be built:**
- [ ] Trevor (@trevorsTakes) and Danny (@DannyM.editor) getting their own
  per-platform social accounts — Chris's own list says "ask for
  clarification," so: do these handles already exist somewhere (need
  credentials), or do new accounts need to be created first? Can't wire
  Blotato/posting to accounts that don't exist yet.
- [ ] Last Drive preview video for the home page — the video-block markup
  already exists (play button + duration overlay), it's just a static image
  behind it, not a real video. Need a source: YouTube link to embed, or an
  mp4 to upload.
- [ ] Affiliate link images — Chris's own list asks "how to get them?" open
  question, not yet resolved.
- [ ] AdSense — rejected 3x. Can research generic common rejection reasons,
  but the actual rejection email/reason text from Google would let this get
  fixed correctly instead of guessed at.
- [ ] Nightly site-audit workflow (see priority #1 below) needs a GitHub PAT
  added as an n8n credential before it can commit reports to `/audit`.

**Queued — real builds, not started yet:**
- [ ] News section: group by month (current month first, working backward),
  auto-archive anything older than 2 months. Found: `archive.html` already
  has the month-grouped visual design AND copy claiming "articles move here
  automatically after 15 days" — but it's actually static, hand-written
  HTML with hardcoded May 2026 entries. Nothing dynamic exists yet. Real
  build: news.html needs month-grouped rendering from articles.json, and
  archive.html needs to actually pull/bucket dynamically instead of being
  static.
- [ ] Store: not all nameplate/tag thumbnails are clickable — audit
  store.html's bundle thumbnail grids for missing click handlers.
- [ ] Wrong images on some articles (e.g. a GTA6 article showing a GTA5
  image) — needs a pass across all ~66 published articles' `og:image`s vs.
  actual content.
- [ ] Article publishing cadence change: 2 evergreen/week, 3 two-part news
  series/week, 3 Trevor satire/week (+1 extra "Trevor rants about moving to
  Vice City" piece), 2 Editor posts/week (start + end of week).
- [ ] More social post volume across the board — "we must be seen."
- [ ] Media Gallery + empty real estate below Last Drive Preview on home
  page — currently underused space, no plan yet.
- [ ] More affiliate products/companies + a GTA6 Guide template.
- [ ] Forum Discord section shows a generic image instead of an actual
  Discord/community image.
- [ ] Blotato "Check & Publish Pending Videos" — paused since the empty
  `video_id` bug report. Chris said he'd paste the actual prompt/context —
  not received yet in this session. `Generate Daily Video` paused alongside
  it 2026-07-26 to stop burning credits on jobs nobody can publish.

---

## 1b. Internal linking — DONE (2026-07-27)

All 66 articles now have a "Related Articles" card block (2 topically-related
articles + 1 site CTA — Last Drive/Store/Forum/Wall/Trevor, rotated by
relevance). 6 articles already had one; 60 got it added this session,
clustered into 13 topic groups (price/editions, trailer 3, pre-orders, cover
art/lore, earnings, hardware, legal, characters, GTA5 legacy, opinion,
industry, store/meta, launch timeline). Verified post-build: no duplicate
blocks, no broken hrefs, head/footer structure intact across all 66.

Note for future article generation: new articles should get this block from
the start (2 related + 1 CTA, matching an existing topic cluster above) —
don't let it drift back to zero again.

---

## 1. Engagement Points + Secret Leaderboard + Weekly Nameplate Prizes  ⭐ (headline feature)

A gamified, mostly-hidden engagement system. Members already have profiles in
Airtable (gamertag + email, base `appVViGbmcu5gbn8B`, table `Last Drive`). Add
per-member point tracking + a weekly leaderboard + prize codes.

**Point values (extensible — track anything we can):**
| Action | Points |
|---|---|
| Read an article | 1 |
| Read a Crime Blotter article | 2 |
| Read the Editor's post or Trevor's Take | 3 |
| Post a reply | 5 |
| Visit any affiliate link (Amazon, tool referrals, etc.) | 10 |
| ...more as we find trackable actions | TBD |

**Leaderboard:**
- Show a leaderboard ON the site, but do NOT state what it's for. Mystery is the point.
- Track cumulative + weekly points per member.

**Weekly prizes (each = ONE free premium nameplate, code-redeemable):**
- Top 3 on the weekly leaderboard → 1 free premium nameplate each.
- Trevor's Pick of the week → 1 free premium nameplate (his choice / editorial).
- Public rules only say "for site engagement" — deliberately vague, never publish the exact scoring.

**Redemption:** winners receive a CODE → redeems for one free premium nameplate.
Needs a codes/redemption table in Airtable and a redeem flow in the store.

**Build notes / dependencies:**
- Tracking pattern: reuse the existing client-side Airtable token pattern (already
  used on store.html / index.html). A points ledger table keyed by gamertag, incremented
  on the tracked actions. Affiliate-link clicks tracked via an outbound-redirect wrapper.
- This overlaps with the parked "Top Stories = most visited" analytics counter — build
  the pageview/engagement tracking ONCE and feed both the leaderboard and Top Stories.
- Weekly reset + winner selection can run in n8n (same Friday cadence as The Friday Frequency).

---

## 2. Crime Blotter articles are hidden-by-design

Each Crime Blotter headline has a full article, reachable ONLY by clicking its blotter
link (no nav, no sitemap surfacing — intentional easter-egg feel). Reading one = 2 points
(feeds the system above). Need to actually generate/host these blotter articles.

---

## 3. Store: sell individual nameplates, not just bundles

Currently the store only sells the 7 themed bundles ($19.99 / 10 plates) + the
All-Nameplate tier ($29.99). Add:
- Each individual nameplate purchasable on its own (e.g., each truck buyable separately
  inside the Trucks tab, each classic car inside Classic Cars, etc.).
- So every nameplate needs its own product slot/price WITHIN its bundle section.
- Single-plate price TBD (bundle is $19.99 for 10, so singles priced to make the bundle
  the obvious value — e.g. ~$2.99–$3.99 each; confirm with Chris).
- Store data already has `NAMEPLATE_CATEGORIES` + `NP_PLATES` maps and `getPlateBg()`
  handles the `np-<cat>-NN` ids — extend `selectPlate()`/PayPal wiring for singles.
- Free-nameplate redemption (from prizes above) grants a single plate by code.

---

## 4. Carried-over parked items

- **Transferable nameplate → shareable badge**: "Download/Share your badge" button that
  renders plate + gamertag to a portable badge image (HTML canvas) + Web Share API +
  download, so members can post it on other platforms. Growth lever.
- **Top Stories = most-visited**: real pageview counter (build together with #1's tracking).
- **News-category default images**: Chris uploaded per-category hero images to Drive
  (folder: https://drive.google.com/drive/folders/1bfScow_qjFFiu6liyRafL2hewhg3wCew) —
  pull in + wire so articles without a specific hero get a category-appropriate image.
- **Gmail SMTP**: still needed to arm the Daily Content Engine approval emails (Chris to
  create the SMTP credential in n8n; then wire it + flip that workflow live).

---

## 4b. Radio background music licensing — needs Chris to check tomorrow

For Vice Frequency Radio's background/bed music, YouTube Audio Library's
**standard license does not permit standalone use** — even tracks marked
"Attribution not required" are still restricted to "must be embedded in a
video you upload," not a standalone audio player. A "blank-screen video,
upload unlisted, extract the audio" workaround does not clear this — it's
exactly the workaround the license's "no standalone distribution" clause is
written to block.

**What actually works:** filter the Audio Library specifically for the
**"Creative Commons"** tag (a separate axis from attribution) — those tracks
use a real CC license (e.g. CC BY) that does permit standalone distribution
with attribution. If that filter turns up thin, Uppbeat/Artlist/Soundstripe
free tiers are licensed for exactly this (background music served from your
own site, not just "in a video").

**Status:** Chris is checking this himself tomorrow across a few sites —
no site changes needed until a source is picked.

---

## 5. Live automation already in place (don't rebuild — extend)

- **Friday Frequency** (n8n `7ncXecFDVLUrgfgh` generate+post, `R4b97NCMXFu1eCuU` serve
  webhook, data table `WeeklyFrequency` `L2sXMDJcEnfLajx3`): Fri 5:05pm CT generates the
  Editor+Trevor column via Gemini, site reads it live, posts to Twitter/Facebook/Discord
  at 5:15. Model in use: `models/gemini-3.1-flash-lite`.
- **Serve webhook**: `https://n8n.56vicelane.com/webhook/7053d4f9-c685-4d5b-af2a-f2afdc211cb1/weekly-latest`
- **Blotato accounts**: YouTube 40397, Instagram 59705, TikTok 47040, X 20503,
  Facebook acct 42247 (target pageId `1235822692950396`). Credential id `wD818CRlLww46fFr`.
- **Scheduled**: production merge dev→main set for Fri 2026-07-24 ~4:00pm CT.
