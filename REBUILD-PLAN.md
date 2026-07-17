# 56ViceLane Rebuild — Migration Map

Dusk Mix v2 framework. Everything shares `/assets/vf.css` + `/assets/vf.js`.
Deploy: upload → commit to main → Cloudflare Pages (~60s).

## ✅ Built in this batch (safe to upload now)
| File | Notes |
|---|---|
| `assets/vf.css` | Full design system + animations |
| `assets/vf.js` | Nav, ticker (reads `/articles.json`), scroll reveals, countdown, article feed |
| `index.html` | ⚠️ Replaces live homepage — diff against current index.html FIRST (standing rule) |
| `radio.html` | New page. Tuner, 4 stations, DJ breaks, per-station artwork. Audio hook ready: add `data-stream="URL"` to any preset button |
| `news.html` | Reads `/articles.json`; static fallback cards if fetch fails. Verify field names match your JSON (`title/url/date/category/description` with fallbacks for `headline/link/datePublished/tag/summary`) |
| `gta6.html` | "Everything We Know" pillar page — living, update the `<time>` tag on every edit |
| `leaderboard.html` | Badges + roster shell, ready to wire to member accounts |
| `_template.html` | Shell for migrating every remaining page |

## 🔁 Migrate with template (static — low risk)
about, contact, privacy, terms, gear, shop, weekly-bonuses, members, lastdrive, archive
→ Pull live file → move content into `_template.html` → keep any existing scripts unchanged.

## 🛑 DO NOT blind-rebuild (live logic inside)
store.html · player.html · plates.html · gtacon.html · wall.html · forum.html · admin.html
These carry working Airtable/plate/worker logic. Restyling them requires pulling the
current file from the repo first, then wrapping the new shell AROUND the existing
scripts. Upload those files to a chat and we'll migrate them one at a time.

## 🆕 Still to build (next batches)
- Members area (Clerk/Supabase + D1) — needs architecture decision first
- Evergreen pre-launch: characters, map breakdown, editions comparison, PC specs, countdown hub
  (gta6.html anchors these; each becomes its own page linked from the pillar)
- Post-launch templates: cheats, vehicles, weapons, trophies, walkthroughs, soundtrack
- Searchable archive (replaces archive.html)

## Infrastructure checklist (from the playbook)
- [ ] sitemap.xml auto-generated with accurate per-page lastmod — never hand-edited
- [ ] Every article: immutable datePublished + separate dateModified in JSON-LD
- [ ] Hard gate: 1 hero + 2–3 inline images per article
- [ ] `_worker.js` kept, legacy `worker.js` deleted
- [ ] articles.json remains the single canonical data source

## articles.json contract (what vf.js expects)
```json
[{ "title": "...", "url": "/articles/slug.html", "date": "2026-07-02",
   "category": "News", "description": "..." }]
```
Also accepts a wrapper: `{ "articles": [...] }` and alt keys headline/link/datePublished/tag/summary.
