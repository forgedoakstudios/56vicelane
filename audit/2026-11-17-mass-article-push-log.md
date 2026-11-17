# 2026-11-17 — Mass article push (16 held articles, Chris's go-ahead)

Chris explicitly approved shipping the entire held article backlog to `main`
in one go. All 16 were already drafted/held on `claude/friendly-feynman-3scinq`
from this session and the day before; none were already live on `main`.

## Shipped (16/16, all succeeded)

| Title | Slug | Byline | source-status |
|---|---|---|---|
| Discord Teams Up With Rockstar For A Vice City Theme | `gta6-discord-rockstar-vice-city-theme` | Camille Duarte | reported |
| This Professor Is Cancelling Homework And Exams For GTA6's Launch Week | `gta6-professor-cancels-homework-launch-week` | Danny Marchetti | reported |
| The UK's NHS Is Urging Gamers To Protect Their Hands Ahead Of GTA6's Launch | `gta6-nhs-protect-your-hands-launch` | Danny Marchetti | reported |
| Sony Squeezes In A Last-Minute PS5 Firmware Security Update Amid Fresh Hacker Claim | `gta6-sony-ps5-firmware-security-update-hacker-claim` | Julian Ashworth | reported |
| How Schools Are Preparing For GTA6 Launch Day Absences | `gta6-schools-preparing-mass-absences-launch-day` | Danny Marchetti | reported |
| GTA6's Pre-Order Bonuses Come With An Important Asterisk | `gta6-preorder-bonuses-important-asterisk` | Marcus Webb | reported |
| GTA6's Leonida Wildlife Includes Over 60 Bird Species, Reports Say | `gta6-leonida-wildlife-bird-species` | Danny Marchetti | reported (downgraded from a 7+ scan score — exact "62" figure uncorroborated, "60+" used per Chris's direct call) |
| The Last Drive Eve: A Newsroom Roundtable | `the-last-drive-eve-newsroom-roundtable` | Multi-writer (Marcus Webb, Julian Ashworth, Ezra Voss, Camille Duarte, Reg Calloway, Trevor aside, Danny Marchetti close) | confirmed |
| Why The Last Drive Is A Ritual, Not Just A Goodbye | `gta6-last-drive-cultural-ritual-camille-duarte` | Camille Duarte | confirmed |
| Two Days Out: What The Last Drive Says About 13 Years Of This Franchise | `gta6-last-drive-two-days-out-franchise-legacy-reg-calloway` | Reg Calloway | confirmed |
| 13 Years Later: How GTA6's Launch Compares To Every Prior GTA Launch | `13-years-later-gta6-launch-compares-every-prior-gta-launch` | Reg Calloway | confirmed |
| Every Confirmed Easter Egg And Lore Thread Going Into Launch | `gta6-every-confirmed-easter-egg-lore-thread-going-into-launch` | Ezra Voss | confirmed |
| GTA6 Performance Explainer: Framerate, Resolution, And Load Times | `gta6-performance-explainer-framerate-resolution-load-times` | Julian Ashworth | confirmed |
| GTA6 Pre-Order Numbers: Where Things Stand Going Into Launch | `gta6-preorder-numbers-where-things-stand-going-into-launch` | Marcus Webb | confirmed |
| Jason And Lucia's Full Look: Character Customization Confirmed | `jason-lucia-full-look-character-customization-confirmed` | Camille Duarte | confirmed |
| GTA6's In-Game Cartoon "Macca & Friends" Is Real | `gta6-macca-and-friends-in-game-cartoon` | — | confirmed |

## What went out where

- **Main:** all 16 article files + 2 new images (`gta6-leonida-wildlife-bird-species-inline-1.jpg`,
  `the-last-drive-eve-newsroom-roundtable-hero.jpg`) + rebuilt `articles.json` (147 articles total)
  + rebuilt `sitemap.xml` (19 core pages + 147 articles). Commit `f6d87d0`, pushed to `main`.
- **Bluesky:** all 16 queued via `scripts/queue-article-post.js` into `social-queue.json`
  (entries `auto-publish-<slug>`), picked up by the Social Queue Poster GitHub Action within ~5 min.
  Commit `2f6482f`, pushed to `main`.
- **Discord (#general):** all 16 fired through the "Article → Social Blast" workflow
  (`TwrlHRxAUyu762RU`), executions 52966–53003, every one confirmed `status: success`.
- **X / Instagram / Facebook:** off — Blotato is cancelled, no auto-posting path to these
  platforms exists right now. Not claimed, not attempted.
- **YouTube / TikTok:** not applicable to article content; unaffected either way.

## Notes / things worth knowing

- Two images referenced by the batch (`images/gta6-leonida-wildlife-bird-species-inline-1.jpg`,
  `images/the-last-drive-eve-newsroom-roundtable-hero.jpg`) weren't yet on `main` and were pulled
  from the dev branch where they'd been generated earlier.
- `images/gta6-macca-and-friends-in-game-cartoon-hero.jpg` doesn't exist anywhere (Pollinations
  rate-limited on all 3 attempts when that piece was drafted) — this is **not broken**: the
  in-body `<img>` tag has `onerror="this.src='/images/gta6-hero.png'"`, and the `og:image`/
  `twitter:image` meta tags already correctly point straight at the placeholder. Verified before
  shipping.
- A prior attempt to identify this batch via a blind `git diff` between `main` and the dev branch
  was correctly aborted (the branches have diverged with ~150+ unrelated diffs, including git
  misdetecting unrelated files as renames) — this push instead worked from an explicit,
  individually-verified file list built from the actual commit history (`fd27e6b`, `c2bd540`,
  `8dd0bc3`, `7becedd`, `5e74d08`, `9305a81`), confirmed none were already live before extracting
  each file directly with `git show origin/claude/friendly-feynman-3scinq:<path>`.
