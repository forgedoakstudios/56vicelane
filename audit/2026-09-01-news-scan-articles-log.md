# 56ViceLane — News-Scan Articles Log, 2026-09-01

## Breaking (7+, pushed to `main`)

### No Rest For The Wicked, Once Slated To Beat GTA6 By A Month, Delayed To March 2027
- **Slug:** `no-rest-for-the-wicked-delayed-2027-gta6-window`
- **Scanner score:** 7 (PC Gamer).
- **Verification:** PC Gamer is a trusted-feed domain. Corroborated via
  WebSearch — Gematsu, The Gamer, VGChartz, Adventure Gamers, and Aroged
  all independently reported the same delay (October 1.0 target to
  March 2027, open beta moved to December). Checked `articles.json` and
  git history for existing coverage — none found, genuinely new story.
- **Editorial note — honesty on causation:** unlike the Fable and
  Squadron 42 delays (both directly cited GTA6 by name), Moon Studios'
  official statement did **not** mention GTA6 at all — stated reasons
  were performance/class-system polish only. The article is explicit
  about this in its own editor's note: covered because the release-
  calendar overlap fits the established pattern (competitor timing
  relative to GTA6), not because a causal link was claimed that the
  studio never made.
- **source-status:** `reported` — no official causal statement tying
  the delay to GTA6, only the timing coincidence and outlet framing.
- **Byline:** Marcus Webb (business/market beat — competitor
  release-timing framing, matching the Fable/Ananta/Squadron 42
  precedent).
- **Images:** generation FAILED again this run. Re-tested fresh both
  paths: `mcp__n8n__execute_workflow` unavailable this session, HTTP
  fallback still curl exit 56 / "CONNECT tunnel failed, response 403"
  (confirmed via a real curl attempt this run). Published with the
  generic `gta6-hero.png` placeholder. Outage now confirmed running
  since at least 2026-08-19 (14 days).
- **Platforms:**
  - ❌ **Discord** — social-blast webhook confirmed down this run
    (same 403 CONNECT tunnel failure, re-tested via curl). No
    alternate direct webhook URL found in-repo (lives inside n8n
    workflow config, inaccessible without n8n MCP access).
  - ✅ **Bluesky** — queued via `scripts/queue-article-post.js`, entry
    confirmed present in `social-queue.json`
    (`auto-publish-no-rest-for-the-wicked-delayed-2027-gta6-window`).
  - ❌ **X / Instagram / Facebook** — N/A; Blotato cancelled 2026-08-16.
  - N/A **YouTube / TikTok** — never covered by this pipeline.
- **Video SLA alert:** NOT sent — same n8n outage, no alternate path.
- **`drafted-links.json`:** appended the PC Gamer link (tier
  `breaking`) plus the Eurogamer duplicate link (tier
  `skipped-duplicate`) to `main`'s copy. Entry count 92 → 94.

## Duplicate skipped this run

### "Rockstar Games unveils its official GTA Online RP server" (Eurogamer, score 7)
- Verified via WebSearch: this is Rockstar's own Newswire
  confirmation/trailer drop for the NoPixel V closed beta (opens
  September 8) — the same story already covered in
  `gta6-nopixel-v-closed-beta-september.html` (2026-08-14/earlier).
  Not a new development; marked `skipped-duplicate` rather than
  drafted as a second article on the same beta launch.

## Action needed (repeat, now a standing item)

n8n MCP re-authorization and/or the HTTP webhook fallback's
egress-proxy block have now kept image generation, Discord posting,
and video-SLA alerts down for every breaking article published since
at least 2026-08-19 — confirmed re-tested and still broken today,
14 days running. Already the top item on the daily checklist.
