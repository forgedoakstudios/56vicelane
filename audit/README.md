# /audit

Home for nightly site-audit reports (`YYYY-MM-DD-audit.md`).

**Status as of 2026-07-29: built and live.** Runs as a Claude Code Remote
Routine (`56ViceLane Nightly Site Audit`, trigger `trig_01DnkA6iyQKDxp6VboV9pnM2`),
not an n8n workflow — n8n has no GitHub credential and standing up one
wasn't necessary, since a fresh Claude Code session at midnight Central
already has working git/GitHub access in this environment.

- **Trigger:** cron `0 5 * * *` (05:00 UTC = midnight CT), fresh session
  each fire, no memory of prior nights.
- **Job:** broken internal/external links across `/articles`, missing or
  duplicate meta descriptions/OG tags, `sitemap.xml` coverage vs.
  published articles, missing image alt text.
- **Output:** commits a dated report to `/audit/YYYY-MM-DD-audit.md`
  directly on `main` — covered by CLAUDE.md's standing report-only commit
  exception (same as the daily checklist and news-scan bots). Real code
  fixes found during the audit are flagged in the report and in
  `NEXT-SESSION.md`, not applied automatically.
- **Note:** the DST changeover (~Nov 1, 2026) will shift local midnight by
  an hour relative to the UTC cron — needs a one-time adjustment then.
