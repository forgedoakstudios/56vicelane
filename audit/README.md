# /audit

Home for nightly site-audit reports (`YYYY-MM-DD-audit.md`), committed
automatically by an n8n workflow — see `CLAUDE.md` → "Standing automation:
nightly site audit."

**Status as of 2026-07-27: workflow not yet built.**

Blocker: n8n has no GitHub credential yet, so it can't commit a file to
this repo on its own. Needs a GitHub Personal Access Token (fine-grained,
`contents: write` scope on `forgedoakstudios/56vicelane`) added to n8n as
a credential before the commit step can be wired and the workflow
published. Once that credential exists, the workflow itself (cron trigger,
link/meta/sitemap/alt-text checks, report generation, commit) can be built
in a single pass.
