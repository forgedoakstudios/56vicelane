# 56ViceLane Staff Personas

Named bylines for site content, so "56ViceLane News Desk" stops being the
default catch-all. Portraits already live in `/images/*-portrait.jpg` (or
`.png` for the two long-standing ones). Assign by beat/field below — don't
just rotate randomly, match the story to the persona whose lane it's
actually in. If a story genuinely doesn't fit any beat below, default to
**The Editor** (Danny Marchetti) as the neutral generalist, not "News Desk."

Created 2026-07-28 (portraits), formally logged 2026-08-11 so they don't
get lost again.

---

## The Editor — Danny Marchetti
**Portrait:** `/images/editor-portrait.png` (+ dated variants:
`editor-portrait-1-bright.png` through `-5-afterlaunch.png`, aging through
the launch timeline)
**Role:** Editor-in-Chief. Weekly Editor's Desk column (bookends the week,
per the standing cadence), site-wide corrections/updates, and the neutral
generalist byline for analysis-heavy or context-heavy news pieces that
don't fit a specialist beat.
**Voice:** Straight, a little dry, direct with readers about what broke and
what got fixed. See `.claude/brand-voice.md` Q&A — "I — Editor's notes,
we — articles, unless it's my personal take."

## Trevor — Trevor's Take
**Portrait:** `/images/trevor-portrait.png`
**Role:** Satire/hot-take column, 3x/week + 1 recurring "moving to Vice
City" bit, per the standing cadence. As a byline stamp (not a full column
entry) reserved for genuinely snarky/hot-take-shaped news pieces — rare,
shouldn't bleed into the separate weekly quota.

## The Kid — food delivery guy, Trevor's prankster sidekick
**Portrait:** `/images/the-kid-portrait.jpg`
**Field:** Comic relief / reaction bits / community-facing gags. Shown
mid-prank getting "CAUGHT!" playing games on the clock while delivering
for Slice of the City / BurgerShot (in-universe GTA brands). Not a
straight-news byline — pair him with Trevor's Take or short reaction posts,
not breaking articles. Recurring bit potential (the running joke of him
never actually finishing a delivery).

## Reg Calloway — retro tech / nostalgia
**Portrait:** `/images/reg-calloway-portrait.jpg`
**Field:** Legacy GTA history, "how far we've come" pieces, retro-gaming
nostalgia angles, anything measuring GTA6 against the franchise's own past.
Atari shirt, CRT terminal, stack of old Byte/Compute! magazines, "World's
Okayest Programmer" mug — the guy who's been here since the beginning and
won't let you forget it.

## The Kid — see above (do not confuse with Reg)

## Marcus Webb — business / market / sales
**Portrait:** `/images/marcus-webb-portrait.jpg`
**Field:** Pre-order numbers, stock moves, Take-Two earnings calls, revenue
and sales-record stories, pricing news. Miami rooftop at sunset, trading
charts on a laptop, skateboard, beer — the money-and-market beat with a
Vice City backdrop.

## Julian Ashworth — tech / hardware / performance
**Portrait:** `/images/julian-ashworth-portrait.jpg`
**Field:** File size, storage requirements, GPU/CPU performance, frame-gen,
console specs, PC build content, anything about the technical guts of the
game or what it takes to run it. Sharp-dressed, holding a GPU, benchmark
charts on the monitor behind him.

## Ezra Voss — investigative / leaks / lore
**Portrait:** `/images/ezra-voss-portrait.jpg`
**Field:** Leaks, conspiracy-board theories, map mysteries, Easter eggs,
gang-war lore, anything requiring the red-string corkboard treatment.
Corkboard behind him is covered in real GTA-verse references (Ballas,
Vinewood, Paleto Bay, the Epsilon Program) — background detail, not
literal site content, but it tells you exactly what beat he's on.

## Camille Duarte — character design / fashion / culture
**Portrait:** `/images/camille-duarte-portrait.jpg`
**Field:** Character reveals, cover-art breakdowns, fashion/aesthetic
pieces (Jason & Lucia style breakdowns, cover art frame-by-frame), cultural
callbacks (Bowie, Joy Division, Sonic Youth posters — punk/goth aesthetic).
Concept-art wall, drawing tablet, record collection.

---

## Byline pattern (HTML)
Match the existing `.editor-byline` block used on Editor's Desk pieces:

```html
<div class="editor-byline">
<img src="/images/<slug>-portrait.jpg" alt="<Full Name>" onerror="this.style.display='none'">
<div><div class="name"><Full Name></div><div class="role"><Beat/Role></div></div>
</div>
```

For straight news articles that don't use the full `.editor-byline` block,
the `<span>✍️ <Full Name></span>` pattern in the meta row is fine — just
use the real name, not "56ViceLane News Desk," "56ViceLane Staff," or any
other generic placeholder going forward.
