# AI video prompt lessons — living notes

Practical lessons learned generating video prompts for OpenArt/kie.ai, so
future sessions don't have to relearn them from scratch. Append, don't
rewrite.

## 2026-08-03 — "taillights" + "chrome" in the same prompt

When a prompt mentions "taillights" and "chrome" close together
describing the same vehicles, the model tends to render taillights (red)
on the FRONT of cars, where headlights should be. Cause looks like the
model pattern-matching "chrome + glowing light" to a front-grille
composition regardless of which light was actually named.

**Fix:** keep headlight/taillight descriptions unambiguous and spatially
explicit (e.g. "white headlights at the front, red taillights trailing
behind") rather than a loose "taillights and chrome" pairing. Avoid
lumping reflective/chrome detailing in the same clause as taillights.

## 2026-08-03 — Scale requests ("hundreds of cars")

Asking for literally hundreds of individually rendered vehicles is at the
edge of what current video models hold together cleanly. Expect a
genuinely huge, dense crowd rather than hundreds of crisp individual
cars — background vehicles will blur/repeat/artifact the further back in
frame. Fine for sweeping establishing shots (reads as "massive convoy"
regardless), not worth re-rolling credits to fix.

## 2026-08-03 — Los Santos / Vice City dual-skyline concept

For Last Drive content specifically: the drive is framed as both a
farewell (to GTA5/Los Santos) and a hello (to GTA6/Vice City) — so the
visual should show a Los-Angeles-style skyline behind the convoy (where
they're driving from) and a Miami/Art-Deco neon skyline glowing on the
horizon ahead (where they're driving toward), never named on-screen,
just evocative architecture/silhouette. Keep it atmospheric/generic
rather than recreating specific copyrighted landmarks — same approach
already working on other AI-generated clips (photoreal but not an exact
recreation of in-game locations).
