# 56ViceLane — News-Scan Articles Log, 2026-08-25

## Breaking (7+, pushed to `main`)

### Anime "GTA Killer" Ananta Confirms Release Date — Just 2 Months After GTA6
- **Slug:** `ananta-anime-gta-release-date-january-2027`
- **Scanner score:** 7 (Polygon). Related item scored 5 (GamesRadar), same
  story — logged as a duplicate.
- **Verification:** WebFetch to the Polygon source
  (`www.polygon.com`) was blocked by the egress proxy (confirmed via a
  real attempt: "Claude Code is unable to fetch from www.polygon.com").
  Corroborated via WebSearch instead — wide, consistent independent
  coverage across 9+ outlets (Digital Trends, Vice, GamesRadar,
  GosuGamers, Push Square, Kotaku, GamingBible, Gamerant, VGTimes), all
  reporting the same underlying facts: NetEase's Naked Rain studio
  officially confirmed a January 15, 2027 release date for Ananta —
  a free-to-play "anime GTA" open-world RPG launching as a PS5 console
  exclusive alongside PC and mobile — at Gamescom's Opening Night Live,
  with a new story trailer. No existing coverage of Ananta on-site
  (`grep`/`ls` for "ananta" across `articles/` came back empty), so not
  a duplicate.
- **Editorial scope call:** this is a competitor's release, not GTA6
  itself — justified as on-topic by the site's existing precedent in
  `articles/fable-delayed-february-2027-because-of-gta6.html`, which
  established that covering other publishers' release-date decisions
  *as they relate to GTA6's launch window* is within scope. Ananta is
  the inverse case (leaning into GTA6's window 8 weeks later, rather
  than dodging it), covered the same way.
- **source-status:** `confirmed` — the release date and platform
  details came directly from NetEase's own Gamescom Opening Night Live
  presentation (an on-record official announcement, not a leak/rumor),
  independently reported the same way by every outlet checked.
- **Byline:** Marcus Webb (business/market beat — competitor
  release-strategy framing).
- **Images:** generation FAILED again this run. Re-tested fresh both
  paths: `mcp__n8n__execute_workflow` still requires re-authorization
  (server reports it needs OAuth authorization this session cannot
  complete), and the direct HTTP fallback to
  `https://n8n.56vicelane.com/webhook/article-images` returned curl exit
  56 / "CONNECT tunnel failed, response 403" (confirmed via a real
  curl attempt this run, not assumed). Published with the generic
  `gta6-hero.png` placeholder. This outage is now confirmed running
  continuously since at least 2026-08-19.
- **Platforms:**
  - ❌ **Discord** — not attempted successfully; same n8n outage blocks
    the "Article → Social Blast" workflow (both MCP and HTTP paths
    confirmed down this run).
  - ✅ **Bluesky** — queued via `scripts/queue-article-post.js`, entry
    confirmed present in `social-queue.json`
    (`auto-publish-ananta-anime-gta-release-date-january-2027`).
  - ❌ **X / Instagram / Facebook** — N/A; Blotato cancelled 2026-08-16,
    no auto-posting path exists to these platforms currently.
  - N/A **YouTube / TikTok** — never covered by this pipeline
    (manual/native-upload only).
- **Video SLA alert:** NOT sent — same n8n outage.
- **`drafted-links.json`:** appended both the Polygon link (tier
  `breaking`) and the GamesRadar duplicate link (tier
  `skipped-duplicate`) to `main`'s copy. Entry count verified 51 → 53
  before commit.

## Action needed (repeat, now a standing item)

n8n MCP token re-authorization and/or the HTTP webhook fallback's
egress-proxy block have now kept image generation, Discord posting, and
video-SLA alerts down for every breaking article published since at
least 2026-08-19 — a week-plus running outage. Already the top item on
the daily checklist; re-confirmed by direct test again this run rather
than assumed.
