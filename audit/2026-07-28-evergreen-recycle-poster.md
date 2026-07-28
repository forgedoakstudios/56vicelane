# Evergreen Recycle Poster — new standing automation (2026-07-28)

Chris wanted posting volume increased beyond the existing article-publish
cadence (2x/day) and Friday Frequency, with a mix of content types and
engagement posts guaranteed a regular slot, not just occasional article
reposts.

## What it does

New n8n workflow **`Evergreen Recycle Poster`** (id `cyc6wRioPjX5tqlR`),
active, posts twice daily — **1pm and 6pm Central Time** (workflow-level
timezone explicitly set to `America/Chicago`; the n8n instance's default is
Eastern, which would have silently shifted these an hour without that
override — caught before it shipped).

Each firing picks one of three content types on a deterministic 3-slot
rotation (`(dayIndex * 2 + slot) % 3`), so all three appear evenly across
every 3-day / 6-slot cycle — no type is left to random chance:
1. **Article recycle** — random pick from the back catalog (skips the 5
   most recent, since those already got pushed at publish time).
2. **Store/product promo** — rotates the 7 nameplate bundles, the gear
   guide, and Last Drive sign-up.
3. **Engagement prompt** — standalone GTA6 questions, no link, no CTA
   (explicitly requested — guaranteed regular appearance via the rotation,
   not just whenever it happens to come up).

Posts to the same platforms as the article-publish pipeline: X, Instagram,
Facebook (page `1235822692950396`), and Discord (same webhook as
`Article → Social Blast`). Engagement-type posts correctly omit the
link/CTA lines in every platform's caption — verified via a dry run with
the posting nodes disabled (execution 2592: produced accurate
platform-specific text with no broken/empty URL).

## Notes

- Content pools (store items, engagement prompts) are hardcoded in the
  `Determine Content` code node — small, easy to extend directly in n8n if
  Chris wants more variety later.
- No "don't repeat the same pick within N days" tracking yet — pure random
  selection within each type's pool. Low risk at current pool sizes (9
  store items, 5 engagement prompts, ~65+ eligible articles) but worth
  revisiting if repeats become noticeable.
- Reuses the same Blotato credential and Discord webhook already in use
  elsewhere — no new credentials needed.
