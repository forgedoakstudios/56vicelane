# News-scan articles log — 2026-11-16

## Breaking (7+), pushed to main

**"GTA6 Hacker Pleads Guilty To The 2022 Rockstar Breach"**
`/articles/gta6-hacker-kurtaj-pleads-guilty-rockstar-breach`

- Score 7, source: Rock Paper Shotgun (trusted feed).
- WebFetch to the source was blocked by session network settings (as usual) —
  corroborated instead via WebSearch across GamesRadar, MP1st, KeenGamer,
  Yahoo, Rolling Out, Beebom, HappyGamer (6+ independent outlets, consistent
  facts).
- Official-vs-estimate check (step 2c): the $5M figure is Rockstar's own
  court-submitted recovery-cost estimate, not a third-party analyst number —
  no supersession issue, used as the headline figure as-is.
- Duplicate check: not a duplicate. Two existing articles cover this same
  ongoing story (`gta6-playable-build-leak-biggest-breach-since-2022`,
  `gta6-leak-hacker-kurtaj-retrial-november`) but this is a new development
  (the guilty plea itself) — linked both as related articles.
- `source-status: confirmed`. Byline: Ezra Voss (leaks/investigative beat —
  same persona used on the two prior pieces in this story).
- Images: generation failed — all 3 attempts (1 hero + 2 inline) hit
  Pollinations 503/rate-limit errors. Shipped with the `gta6-hero.png`
  placeholder per the routine's fallback rule.
- Platforms: pushed straight to `main`. Bluesky queued (confirmed in
  `social-queue.json`). Discord social blast fired via "Article → Social
  Blast" workflow, execution 31386, confirmed `success`. X/IG/FB — off,
  Blotato cancelled, no auto-posting path to those platforms currently.
  YouTube/TikTok — not applicable, never covered by this pipeline.

## Operational note

News-scan's GitHub Action cron stalled again — last report before this
fire was 2026-11-16 10:27 UTC; nothing new showed up until manually
re-dispatched via `workflow_dispatch` at ~18:51 UTC (an ~8.5 hour gap).
Re-dispatch resumed cleanly and immediately produced the 18:52 UTC report
containing this story. Same recurring pattern flagged repeatedly in the
daily checklist — still no structural fix in place.

## Everything else this scan

Two score-5 items (NBA 2K27's Vice City/GTA6 collab cosmetics; a piece on
how top content creators are prepping for launch) — both correctly left
for the Draft Digest (4-6) routine, not drafted here.
