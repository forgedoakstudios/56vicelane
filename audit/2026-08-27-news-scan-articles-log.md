# 56ViceLane — News-Scan Articles Log, 2026-08-27

## Breaking (7+, pushed to `main`)

### Squadron 42 Delayed To 2027 To Avoid "The Attention Buzz Saw Of GTA6"
- **Slug:** `star-citizen-squadron-42-delayed-2027-gta6-buzz-saw`
- **Scanner score:** 7 (IGN). Related item scored 7 (PC Gamer), same
  story — logged as a duplicate.
- **Verification:** Both IGN and PC Gamer are trusted-feed domains.
  Corroborated further via WebSearch — Massively Overpowered and
  others independently reported the same direct quotes from Chris
  Roberts ("the attention buzz saw of GTA6") and Cloud Imperium
  Games' own official statement about the Q2 2027 release window.
  Genuinely new story — no existing coverage of Squadron 42 on-site.
- **Editorial scope call:** competitor release-timing relative to
  GTA6 — same established precedent as the Fable-delay and Ananta
  articles.
- **source-status:** `confirmed` — direct on-record statement from
  Chris Roberts and CIG's own official announcement, not a leak or
  rumor, consistently reported across multiple trusted outlets.
- **Byline:** Marcus Webb (business/market beat — competitor
  release-strategy framing, matching prior Fable/Ananta pieces).
- **Images:** generation FAILED again this run. Re-tested fresh both
  paths: `mcp__n8n__execute_workflow` still unauthorized, HTTP
  fallback still curl exit 56 / "CONNECT tunnel failed, response 403"
  (confirmed via a real curl attempt this run). Published with the
  generic `gta6-hero.png` placeholder. Outage now confirmed running
  since at least 2026-08-19 (9 days).
- **Platforms:**
  - ❌ **Discord** — social-blast webhook confirmed down this run
    (same 403 CONNECT tunnel failure, re-tested).
  - ✅ **Bluesky** — queued via `scripts/queue-article-post.js`, entry
    confirmed present in `social-queue.json`
    (`auto-publish-star-citizen-squadron-42-delayed-2027-gta6-buzz-saw`).
  - ❌ **X / Instagram / Facebook** — N/A; Blotato cancelled 2026-08-16.
  - N/A **YouTube / TikTok** — never covered by this pipeline.
- **Video SLA alert:** NOT sent — same n8n outage.
- **`drafted-links.json`:** appended the IGN link (tier `breaking`)
  plus the PC Gamer duplicate link (tier `skipped-duplicate`) to
  `main`'s copy. Entry count verified 72 → 74 before commit.

## Digest (4-6, held on dev branch)

### Extended Look Day roundup (studio scale, protagonist switching, trailer details)
- **Slug:** `gta6-extended-look-day-studio-scale-protagonist-switching`
- Consolidates 3 separate score-5 items from today's Extended Look
  coverage (Rockstar doubled team size + hired real-world fashion/
  vehicle professionals per IGN; protagonist-switching mechanic
  confirmed per PC Gamer/Polygon; trailer runtime + PS5-hardware
  capture per GameSpot) that were each individually too thin for a
  standalone article. Danny Marchetti byline, `source-status:
  reported`. Held on `claude/friendly-feynman-3scinq`, not shipped.
- Several other items scanned today were marked duplicate instead —
  most overlapped with the weight/muscle-mechanics and social-media
  preview article already published to `main` on 8/26, or were "how
  to watch"/live-event logistics pieces with no new confirmed facts.
  Full dedup detail in the `News-scan dedup` commits on `main`
  (`c457fe8`, `edc4b2e`).

## Operational note

**news-scan's GitHub Actions cron silently stopped firing for ~9.5
hours today (roughly 03:25–12:54 UTC)** — caught mid-session, confirmed
via Actions run history, and manually re-triggered via
`workflow_dispatch`. It fired successfully and resumed on its own
schedule afterward. Flagged in today's daily checklist as a standing
awareness item (this can happen silently if no session happens to
notice and re-trigger it).

## Action needed (repeat, now a standing item)

n8n MCP re-authorization and/or the HTTP webhook fallback's
egress-proxy block have now kept image generation, Discord posting,
and video-SLA alerts down for every breaking article published since
at least 2026-08-19 — confirmed re-tested and still broken today,
9 days running. Already the top item on the daily checklist.
