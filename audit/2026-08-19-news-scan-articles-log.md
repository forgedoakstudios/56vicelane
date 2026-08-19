# 56ViceLane — News-Scan Articles Log, 2026-08-19

## Breaking (7+, pushed to `main`)

### GTA6 pre-orders reportedly already made $400M+
- **Slug:** `gta6-400-million-preorder-revenue-sensor-tower`
- **Scanner score:** 7 (GameSpot).
- **Verification:** GameSpot is a trusted feed. Direct WebFetch to
  gamespot.com was blocked by this session's egress proxy, so
  verification relied on WebSearch corroboration instead — 6+
  independent outlets (Beebom, GTABoom, dotesports, TechRadar, Variety,
  WolfsGamingBlog) all citing the same Sensor Tower analytics estimate
  (~4.38M pre-order copies, ~$429M revenue, 77/23 PS5/Xbox split). Not
  a duplicate of yesterday's separate 4.5M-unit-count digest article
  (still held on the dev branch, unapproved) — this one centers the
  dollar-revenue figure and cites the Aug 7 Take-Two earnings call
  where CEO Strauss Zelnick called demand "unprecedented" on the
  record.
- **source-status:** `reported` — the dollar figure comes from
  third-party analytics (Sensor Tower), not an official Take-Two
  number, even though Take-Two's own CEO's "unprecedented" language is
  a real on-record quote supporting the general shape of the claim.
- **Byline:** Marcus Webb (business/market beat — clean match).
- **Images:** generation FAILED this run. n8n's MCP server required
  re-authorization (token expired) partway through the session, and
  the direct HTTP fallback to `n8n.56vicelane.com/webhook/article-images`
  was also blocked by this sandbox's egress proxy (confirmed via a real
  curl attempt, connection failure). Published with the generic
  `gta6-hero.png` placeholder per the standing "don't block the article
  on image failure" rule.
- **Platforms:**
  - ❌ **Discord** — NOT posted. The "Article → Social Blast" workflow
    requires n8n, which was unreachable this run (same MCP
    re-authorization issue + blocked HTTP fallback as above, confirmed
    via a real curl attempt to the production webhook).
  - ✅ **Bluesky** — queued via `scripts/queue-article-post.js`, entry
    confirmed present in `social-queue.json`.
  - ❌ **X / Instagram / Facebook** — N/A regardless of the n8n outage;
    Blotato is cancelled as of 2026-08-16.
  - N/A **YouTube / TikTok** — never covered by this pipeline.
- **Video SLA alert: NOT sent** — same n8n outage as above. This is on
  top of the standing gap already logged 2026-08-14 and 2026-08-18 (the
  only reachable path for this alert repeats a known duplicate-post
  bug); this time it's additionally blocked by the n8n connectivity
  issue itself, so there wasn't even an unsafe path available to
  consider.
- **Action needed:** n8n needs re-authorization before the next
  session that relies on it (image generation, social blast, or any
  other n8n-dependent step). This is a session-level auth expiry, not a
  workflow bug — should resolve once someone re-authorizes the n8n MCP
  connection.

## Not handled this run (informational only)

- Continued low-score follow-up coverage of the GTA6 leak/DMCA story and
  the Army re-enlist story (now corroborated by a second outlet,
  GameSpot) — none scored 7+, no action taken.
