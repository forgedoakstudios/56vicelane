# 56ViceLane — News-Scan Articles Log, 2026-08-18

## Breaking (7+, pushed to `main`)

### GTA6 gameplay + full Leonida map leak, Rockstar DMCA takedowns
- **Slug:** `gta6-gameplay-leonida-map-leak-dmca-takedowns`
- **Scanner score:** 3 (GameSpot report) — heuristic penalized the hedging
  language ("apparent," "seemingly") in the headlines.
- **Editorial override:** treated as a real breaking story despite the low
  score. A leaker calling themselves "Cyberleek" posted GTA6 gameplay
  footage and the full Leonida map online, and Rockstar responded with
  DMCA takedowns. Verified via cross-source corroboration: 8+ independent
  trusted outlets (GameSpot, GamesRadar, Dexerto, Push Square,
  NotebookCheck, TheGamer, and others) reporting the same story
  independently the same day. Direct WebFetch to gamesradar.com and
  gamespot.com was blocked by this session's egress proxy, so
  verification relied on WebSearch corroboration instead of reading the
  primary source pages directly — noted here for transparency.
- **source-status:** `reported` — the leak's ultimate authenticity is not
  officially confirmed by Rockstar (studios don't comment on active
  leaks), even though the DMCA response and the leak's existence are
  well corroborated across sources.
- **Byline:** Ezra Voss (leaks/investigative beat — clean match).
- **Images:** real hero + 2 inline images generated via the Pollinations
  pipeline (`HMma5a0Bv1wl2Hiz`). No placeholder fallback needed.
- **Platforms:**
  - ✅ **Discord** — posted successfully via the "Post to Discord" node
    on `TwrlHRxAUyu762RU` (confirmed via execution data, status success).
  - ✅ **Bluesky** — queued via `scripts/queue-article-post.js`, entry
    confirmed present in `social-queue.json`; the `Social Queue Poster`
    GitHub Action will pick it up within 5 minutes.
  - ❌ **X / Instagram / Facebook** — not posted. Blotato was cancelled
    2026-08-16; the "Post to Blotato" node on this workflow is disabled.
    This is expected, not a failure — there is currently no auto-posting
    path to these three platforms.
  - N/A **YouTube / TikTok** — never covered by any of this pipeline,
    manual/native-upload only as always.
- **Video SLA alert: NOT sent.** The standing rule calls for a Discord
  reminder ping to whoever's on video duty. Direct HTTP to discord.com is
  blocked in this sandbox, and the only n8n-reachable path is
  re-triggering the same `Article Published Webhook` with substitute
  text — which is the exact mechanism that caused the 2026-08-14
  duplicate/garbled-post incident (documented in
  `audit/2026-08-14-news-scan-articles-log.md`), and was explicitly
  determined unsafe to repeat until a dedicated Discord-only endpoint
  exists. Skipped rather than risk repeating that incident. This gap
  still needs a proper fix (a dedicated webhook/endpoint for internal
  alerts, separate from the article-announcement path) before this step
  can run automatically again.

## Skipped this run

- **Call of Duty: Modern Warfare 4 beta trailer** (score 5, GameSpot) —
  mistagged under the "GTA 6" topic by the scan script; not actually
  GTA6-related. Logged as `skipped-off-topic`.
- **GameSpot's own coverage of the leak/DMCA story** — same story as the
  breaking article above, logged as `skipped-duplicate` pointing at the
  GamesRadar-sourced slug.

## Not handled by this run (informational only)

- Fired-Rockstar-workers "don't boycott" story — now covered by 5+
  outlets (IGN, Rock Paper Shotgun, GamesRadar, Eurogamer, The Gamer),
  all scoring only 3. Below even the digest tier's 4+ threshold under
  the plain number, though worth someone's eyes if it keeps developing —
  outside this routine's scope to override without a stronger signal
  than "many outlets, all low individual scores."
