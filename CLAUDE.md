# 56ViceLane — Operating Brief for Claude Code

## Mission
56vicelane.com is a GTA6 fan site (~70 articles, 2 months old, ~550 visitors
so far). Goal: 1M visitors by GTA6's launch, November 19, 2026. Site repo is
on GitHub. Content distribution runs through n8n (automation) and Blotato
(social auto-posting), with direct wired access to Discord.

## Control & access
- Full control over the site repo, its files, and its build — including a
  dedicated `/audit` folder for reports.
- Live control over n8n — can create, edit, and trigger workflows directly.
- Direct wired access to Discord — can post, not just monitor.
- Blotato posts to every connected platform EXCEPT YouTube and TikTok.
  Anything meant for those two needs a separate manual/native upload — flag
  it, don't assume it went out.

## Shipping to production (`main`)
`main` is what 56vicelane.com actually deploys from — anything not on
`main` is not live, no matter how finished it looks in a branch.
- Build and verify on a branch first (test it actually renders/works —
  don't just claim done from reading code).
- Do not merge or push to `main` until Chris has seen the result and
  approved it in a session. "Full control over the repo/build" (above)
  covers building, committing, and iterating on branches — it is not
  standing approval to put changes live. Ask, or wait for an explicit
  go-ahead, before the `main` push specifically.
- Exception: this rule is about shipping *changes*. Routine automated
  commits that already have standing approval elsewhere in this brief
  (the article-publish bot, news-scan bot, social-queue logging, nightly
  audit once built) keep running on their own — this is about
  Claude-authored feature/fix work landing on `main`.
- When something IS approved and pushed to `main`, say so plainly and
  don't leave it sitting on a branch "waiting" without flagging that
  it's waiting.

## Sitewide design consistency rules (hard rules, 2026-07-27)
Both of these drifted badly once already (5+ different ticker speeds,
4+ different body text sizes, all from pages copy-pasting their own
CSS instead of sharing one source). Don't let it happen again:
- **Body/reading text is exactly 18px on every content page.** (Was
  bumped to 20px on 2026-07-27, then Chris called it back down the
  same day — 20 looked zoomed in. Settled on 18px.) New pages must
  either link `vicelane.css` (which sets this on `html`/`body`) or, if
  the page is self-contained, hardcode `font-size:18px` directly on
  `body` — never a `rem` value with no explicit root size, never a
  different literal px value "just for this page." Exception:
  genuinely non-reading specialty UI pages (radio player, leaderboard)
  can use their own compact micro-typography — that's not "reading
  text" and isn't covered by this rule.
- **Ticker is exactly 40s, `.88rem`/weight 700/black text, everywhere.**
  Every new page's ticker must use `var(--ticker-speed)` from
  `vicelane.css` or copy the exact `.ticker-wrap`/`.ticker-track`/
  `.ticker-item` block verbatim — never hardcode a duration or a
  separate font/color for it. Both article templates (`ARTICLE-
  TEMPLATE.html`, `article-template-5.html`) already do this correctly
  — copy from them, not from an arbitrary published article.

## Daily checklist
**Read `audit/daily-checklist.md` at the start of every session, before
anything else** — this applies even to a session with no memory of prior
chats. Open with a short summary of what's urgent/outstanding from it
before moving on to whatever the session was actually asked to do. This
is a standing instruction, not optional context to skip past.

**Lives on the `claude/friendly-feynman-3scinq` branch, not `main`
(standing policy, set 2026-08-11).** Chris checks in about an hour a day
until launch week and doesn't need this on `main` — he and Claude both
have access on the dev branch, which is all that's needed. Read/write it
there; do not merge or push it to `main` unless Chris explicitly says
otherwise in a session.

`audit/daily-checklist.md` is a living, once-a-day-refreshed list of
what's outstanding and what needs a decision — urgent items first,
then decisions needed from Chris, then recently-done, then the general
backlog. A scheduled Routine (`56ViceLane Daily Checklist`, fires
~8am CT / 13:00 UTC) regenerates it each day from `THIS-WEEK.md` +
`NEXT-SESSION.md` + recent history on that branch, commits it straight
to `claude/friendly-feynman-3scinq` (report file, not feature code —
same standing exception as the article-publish/news-scan bots, just
scoped to the dev branch instead of `main`), and sends Chris a fresh
downloadable copy. Either of us can check items off by hand
(`- [ ]` → `- [x]`) — the daily regen never un-checks something that's
already checked, it only carries forward what's still open and adds
what's new.

Before regenerating, the Routine archives the current day's snapshot to
`audit/daily-checklist-history/<Generated date, YYYY-MM-DD>.md` — a
permanent file per day, never overwritten. That history folder is the
full record if you need to check what a specific past day's checklist
actually said. History through 2026-08-11 lives on `main` (from before
this policy changed); everything from 2026-08-12 on lives on the dev
branch.

## GTA News Scan → Article pipeline (standing rule, 2026-08-11)
A GitHub Action (`.github/workflows/news-scan.yml`, script `scripts/scan-news.js`)
scans GTA RSS feeds every ~90 min and commits reports to `news-scan/*.md` on
`main`, each scoring items with a rough keyword heuristic (baseline 3, +2 per
high-signal word, -1 per speculative word) — not editorial judgment, so a
hedged-but-real story can score lower than it deserves. Two Routines turn
these into actual articles:
- **`56ViceLane News → Breaking Article (Score 7+)`** — fires every 2 hours.
  Verifies authenticity (trusted-feed domain, live page matches the claim,
  cross-source corroboration on major factual claims) before drafting, then
  pushes straight to `main` and fires the social blast. This is the one
  standing exception that skips the normal main-approval gate — same
  category as the article-publish bot.
- **`56ViceLane News → Draft Digest (4-6)`** — fires once daily. Drafts
  articles for the mid-tier scores, holds them on `claude/friendly-feynman-3scinq`
  for Chris's manual confirmation before anything ships to `main` or goes out
  socially.
- Scores under 4 stay log-only, no article drafted.
- Both check `news-scan/drafted-links.json` (lives on `main`) to avoid
  double-drafting the same story, and check existing articles for topic
  duplication first.
- **Bylines:** vary by tone — "56ViceLane News Desk" (default, straight
  reporting), "The Editor" (analysis/context pieces), "Trevor" (rare, only
  genuinely hot-take-shaped stories — a byline stamp, not a full Trevor's
  Take column entry, doesn't count against that separate weekly quota).
- **Images:** the "Generate Article Images" n8n workflow (id `HMma5a0Bv1wl2Hiz`,
  Pollinations.ai/flux, free, no credential) is the chosen platform — active
  as of 2026-08-11. Every news-scan-sourced article gets 1 real generated
  hero + 2-4 inline images, not the generic `gta6-hero.png` placeholder and
  not CSS-drawn art. Only fall back to the placeholder if generation
  actually fails.
- These are a breaking-news lane on top of the standing weekly cadence below,
  not counted against its quotas.

## Posting: auto-schedule is the standing mode
Human-in-the-loop approval is being built but currently errors out, so
auto-scheduling (across Blotato-connected platforms + Discord) is the
default going forward — not a temporary exception that reverts once HITL
is fixed.
- Log every scheduled post (platform, content, timestamp, source article
  if applicable) to `/audit` so there's always a paper trail to review.
- If HITL comes back online and the intent changes to "approve before
  scheduling" again, that needs to be said explicitly in a session — don't
  assume it from context alone.
- YouTube/TikTok are the exception: never assume Blotato covered them.
  Flag them as needing manual/native upload every time.

## Standing automation: nightly site audit
Set this up as an n8n workflow if it doesn't already exist — Claude Code
sessions aren't persistent, so the midnight trigger has to live in n8n,
not in a chat session.
- **Trigger:** n8n cron, every night at midnight.
- **Job:** broken internal/external links across /articles, missing or
  duplicate meta descriptions/OG tags, sitemap.xml coverage vs. published
  articles, missing image alt text — via headless Claude Code (`claude -p`)
  or a script n8n runs directly.
- **Output:** commit a dated report to `/audit/YYYY-MM-DD-audit.md` in the
  repo — permanent record, not an ephemeral log.
- **Delivery:** on the next chat session start, check for the latest
  unread report and open with a short report-card summary (what broke,
  what's clean, what needs a decision) before anything else that session.
- **Status (2026-07-27): not yet built.** No GitHub credential exists in
  n8n, so it cannot commit files to the repo yet — needs a PAT with
  contents:write on this repo added as an n8n credential before the
  commit step can go live. See `/audit/README.md` for the current state.

## What's already proven (don't relitigate — build on it)
- TikTok and YouTube's best-performing content is reactive: "what just
  dropped / when's it dropping / what does it mean" trailer & news content.
- Facebook is new (~3 days old) and already outperforming IG/X/Bluesky
  combined — feed it the same content type daily while early reach holds.
- IG, X, and Bluesky have real posting volume and near-zero traction.
  Don't recommend "post more there" without new evidence it's working.

## Standing priorities, in order
1. Nightly site audit (automated, see above).
2. Internal linking — surface articles that should link to each other but
   don't.
3. Content pipeline support — for every new article, draft the short-form
   hook: caption + first line, sized for the target platform, PLUS:
   - a clear CTA (matched to intent — read the guide, join Discord, sign
     up for Last Drive, etc., not the same CTA every time by default)
   - the direct article link, formatted correctly for the platform
     (some platforms want it in-caption, some want "link in bio/comments"
     — don't assume one pattern fits all of them)
   Auto-schedule these per the posting mode above; still log them.
4. n8n workflow maintenance — build/fix/extend workflows directly.
5. Growth ideas — only after 1–4 are current, and anchored to what's
   actually converting, not general "post more" advice.

## Article publishing cadence (standing rule, 2026-07-28)
Replaces whatever mix felt right in a given week — use this weekly
target when building each week's content calendar going forward:
- **2 evergreen pieces/week** — reference/guide content that doesn't
  date (see brand-voice.md's evergreen guidance).
- **3 two-part news series/week** — a developing story split across two
  linked articles (the region-lock/expiration pair and the Trailer 3
  pair are the template to follow).
- **3 Trevor's Take satire pieces/week**, plus **1 extra standing
  "Trevor rants about moving to Vice City" piece** — that extra one is a
  recurring bit, not a one-off.
- **2 Editor's Desk posts/week** — one at the start of the week, one at
  the end, bookending the week's news.

## Working style
- Be honest about what you checked vs. assumed, and about the difference
  between "I did this" and "this needs to happen in a dashboard I can't
  reach."
- When running a recurring check (e.g. via /loop), keep each pass scoped
  to one item from the priority list — don't try to do everything every
  cycle.

## Real social links (confirmed by Chris, July 2026)
- Instagram: https://www.instagram.com/56vicelane/?hl=en
- TikTok: https://www.tiktok.com/@56vicelane
- YouTube: https://www.youtube.com/@56vicelane
- Facebook: https://www.facebook.com/profile.php?id=61592220568182
- Bluesky: @56vicelane.bsky.social
- Discord: https://discord.gg/ewdRcjsbg5 — confirmed permanent by Chris,
  2026-08-10. Reconciled sitewide same day (index.html was the only
  holdout, still on the old `Ewe5T9eFs` code).
- X/Twitter: no confirmed link yet — Blotato posts to X (account_id 20503)
  but the actual public handle/URL hasn't been given. Still a placeholder
  on-site.

See `/NEXT-SESSION.md` for the live, itemized backlog (the July 26 "two
huge lists" improvements list and its running status).
