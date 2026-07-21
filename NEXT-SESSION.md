# 56ViceLane — Next Session Backlog

Working branch: `claude/56vicelane-gta6-dev-37dq4z`. Production deploys from `main`
(Cloudflare Pages). Central Time. Budget-conscious — pace the big builds.

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

## 5. Live automation already in place (don't rebuild — extend)

- **Friday Frequency** (n8n `7ncXecFDVLUrgfgh` generate+post, `R4b97NCMXFu1eCuU` serve
  webhook, data table `WeeklyFrequency` `L2sXMDJcEnfLajx3`): Fri 5:05pm CT generates the
  Editor+Trevor column via Gemini, site reads it live, posts to Twitter/Facebook/Discord
  at 5:15. Model in use: `models/gemini-3.1-flash-lite`.
- **Serve webhook**: `https://n8n.56vicelane.com/webhook/7053d4f9-c685-4d5b-af2a-f2afdc211cb1/weekly-latest`
- **Blotato accounts**: YouTube 40397, Instagram 59705, TikTok 47040, X 20503,
  Facebook acct 42247 (target pageId `1235822692950396`). Credential id `wD818CRlLww46fFr`.
- **Scheduled**: production merge dev→main set for Fri 2026-07-24 ~4:00pm CT.
