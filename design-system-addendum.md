# 56ViceLane V2 — Design System Addendum
## Supersedes color/typography/imagery sections of the original master docs
## Locked from working session — July 9, 2026

---

## WHAT CHANGED FROM THE ORIGINAL SPEC

The original V2 docs specified a dark-mode-always site with amber/cyan on navy.
That direction is **replaced** by everything below. Structural rules from the
original docs (var-only JS, complete-file builds, hamburger nav, Airtable/GitHub
stack, etc.) are UNCHANGED — only the visual system moved.

---

## COLOR PALETTE — "Vibrant Premium"

Base is white/light, not dark. Accent family is gold → orange → pink → magenta,
used as gradients, not flat blocks. Feel: penthouse party, not corporate lobby,
not arcade.

```css
--bg:          #FFFFFF   /* page background — light, not dark */
--edge:        #F0E6DA   /* borders, dividers */
--ink:         #211A16   /* primary text */
--ink-soft:    #6B5F52   /* secondary text — NEVER grey, warm-toned only */
--gold:        #E8B84B
--gold-deep:   #C4922A
--orange:      #FF6B2C
--pink:        #FF3D7A
--magenta:     #D6247A
```

Rule carried over from the original brief and still binding: **no grey or
black text on dark panels.** Dark panels (like the Founding 56 card) use
warm off-white / champagne text, never grey.

Hero and feature panels sit on rich gradient washes (radial gold/orange/pink
glows), not flat color or flat photos — gradients + photography layer together.

---

## TYPOGRAPHY

| Role | Font | Notes |
|---|---|---|
| Headlines / display | **Playfair Display** (600–800) | Luxury editorial serif — carries the "penthouse" read. Google Fonts, free. |
| Nav / labels / eyebrows / tags | **Barlow Condensed** (500–700) | Carried over from original system, still works condensed at small sizes. |
| Body copy | **Inter** (400–600) | Carried over — universal safe pick for legibility at any size. |

Dropped: Russo One (too rounded/soft for the new direction), Anton (too
blunt/loud once we moved toward elegant-but-vibrant instead of pure impact).

---

## IMAGERY — NO EMOJI, ANYWHERE, EVER

Every image slot uses real generated/photographic art. Brew generates via
Gemini using this master prompt formula, kept consistent across every image
so 40+ separate generations still read as one designed system:

```
[SUBJECT], premium editorial digital art, cinematic lighting, rich color
grade in gold/orange/pink/magenta sunset palette, shallow depth of field,
high production value like a luxury brand campaign, 4K detail, subtle film
grain, [ASPECT RATIO]
```

**Rule update (July 21, 2026):** text and logos ARE allowed in images going
forward, as long as they're made-up (fictional signage, invented business
names, made-up mastheads/plate text, etc.) — not real brands, real people,
or Rockstar/Take-Two IP. Drop "no text or logos in the image" from the
formula above when a made-up name/logo actually serves the shot (a storefront
sign, a fictional newspaper masthead, a plate's own lettering); keep leaving
it out of the prompt when the shot doesn't call for any text at all.

### Image count per page
- Standard pages (about, contact, gear, forum, tools, etc.): **3–5 images**
  — hero + 2–4 supporting.
- Article pages: 1 hero + 2–3 inline (unchanged from original rule).
- Store pages: scaled up significantly — every plate, bundle, and product
  needs its own shot. Index-card vs. business-card-sized difference in
  density compared to standard pages.

### Dimensions per placement
| Placement | Aspect Ratio | Notes |
|---|---|---|
| Homepage / page hero background | 16:9, min 1920×1080 | Darker top-third for nav legibility |
| Feature panel (tabbed sections) | 21:9 wide | Text sits bottom-left — keep that corner less busy |
| Comic-panel grid tiles | Mixed: 2:3, 1:1, 3:2 | Exact px per tile confirmed when a page's grid is finalized |
| News/article card thumbnail | 16:9 or 4:3 | Center subject — crops from both sides on mobile |
| Article hero image | 21:9, min 1600×685 | Full-bleed at top |
| Store product shot (plates) | 1:1 or 4:3 | Clean edges, transparent-friendly for card layout |

IP note carried over and still binding: no Rockstar/Take-Two artwork,
characters, logos, or close imitations of their key art — original
generated art only, style-inspired, not asset-derived.

---

## STRUCTURAL PATTERNS (new — inspired by GTA6 teaser site + No Man's Sky site)

1. **Moody gradient hero reveal** — restrained, glowing wordmark over a rich
   gradient/photo wash, similar mood to the official GTA6 teaser reveal,
   built from original assets/colors.
2. **Platform strip** ("Ride With Us On") — PS / Xbox / PC / Discord badges
   in a dark bar directly under the hero. Pattern borrowed from No Man's
   Sky's "Buy Now On" strip.
3. **Tabbed feature sections** — category tabs above a full-bleed photo
   panel with bottom-left text overlay + CTA, panel swaps per tab. Direct
   structural borrow from No Man's Sky's Explore/Build/Command pattern.
4. **Comic-panel photo grid** — uneven-block collage grid (not a uniform
   3-column grid), inspired by the GTA6 key art composition, filled with
   original photography/art per tile.

---

## SOUND

One exception to the "no autoplay audio" rule, and it's deliberate, not
an oversight: the homepage entrance sequence (logo/wordmark reveal) may
autoplay a brief sound cue **once**, on first load of the homepage only.
Not looping. Not on any other page. Everything else on the site keeps the
original no-autoplay rule.

Entrance choreography (from earlier direction, still valid): still needs
to be redesigned to fit the new vibrant/premium visual language instead
of the original dark "getaway car screech" version — that was built for
a night/dark palette and needs a pass to match the new light-based hero.

---

## OPEN ITEMS — NOT YET DECIDED

- Final entrance animation choreography for the new palette (deferred —
  was dark-theme-specific, needs redesign)
- Exact comic-panel grid tile dimensions per page (confirmed page-by-page
  as each is built)
- Whether tabbed feature section content differs per page or is
  homepage-only

---

## RULE OVERRIDE — VISIBLE NAV BAR (July 9, 2026)

**Supersedes the original hamburger-only rule from the master build doc.**

The original spec required hamburger nav on all screens with zero
exceptions. That's overridden as of this decision: the colored nav band
sitting directly under the hero is now a permanent, always-visible text
nav — site-wide, not homepage-only. This was an accidental deviation
while building the homepage mockup, tested live, and explicitly kept on
purpose after seeing it in action.

**Position — locked:** the nav band sits directly BELOW the hero image
on every page, never above it. (Caught and fixed July 9 after
lastdrive.html shipped with it in the wrong position.)

**Links — locked at 8, in this order:**
Home / News / Last Drive / Wall of Honor / Members / Store / Gear / Forum

Wall of Honor is a genuinely separate page from Members (confirmed
July 9) — Members does not currently surface the Wall of Honor content,
it only links out to it via a card. Do not merge these or treat the
link as a duplicate.

**Still true:** secondary pages not in that 8-link band (About, Contact,
Privacy, Terms, Admin) are reached via the footer links, which already
list all of them — no additional hamburger/overflow menu needed unless
that changes later.

**Build rule going forward:** every page's nav band must use the same
8 links, same order, same active-state styling, positioned directly
below the hero. Do not silently drop back to a hidden hamburger on any
future page — this is now the standing pattern, not an exception.
