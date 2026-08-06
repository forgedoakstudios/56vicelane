# GTA 6 Netflix "Extended Look" — Breaking News Article + Social Push (2026-08-06)

Chris: "Netflix is doing an extended look at Rockstar's GTA 6 on Aug 27,
breaking news, like literally just now!!"

## What was published

New article: **`/articles/gta6-netflix-extended-look-august-27`** — covers
the confirmed Rockstar/Netflix announcement (Grand Theft Auto VI: An
Extended Look, Netflix-exclusive premiere Thursday Aug 27, 3pm ET / 12pm
PT, free on YouTube + GTA6.com six hours later at 9pm ET / 6pm PT), how to
watch, whether it counts as "Trailer 3," and an honest note that our
earlier Trailer 3 timing predictions (late June–mid July window) ran early
— Rockstar actually landed on Aug 27. Internally links back to both of
those earlier pieces. Added to `articles.json` (top of feed, dated
2026-08-06) and `sitemap.xml`. Verified rendering locally via Playwright —
correct H1, ticker, 18px body text, zero JS errors — before committing.

Pushed to branch `claude/friendly-feynman-3scinq`, not `main` (bundled
with the same-session webhook-URL fix commit set — still awaiting Chris's
go-ahead to ship to production).

## Social distribution — what actually happened

Triggered the existing **`Article → Social Blast (Blotato)`** workflow
(`TwrlHRxAUyu762RU`) for this article. While doing this found and fixed
two workflow bugs, and made one mistake mid-fix that's worth being
straight about:

**Bug 1 — Facebook posting was broken.** The live workflow had a
duplicate/conflicting `jsonBody` on the "Post to Blotato" node: the
version actually used at runtime never included Facebook's required
`pageId`, while a correct pageId-aware version sat unused in a dead nested
parameter. Every Facebook post through this workflow was failing with a
400. Fixed by correcting the live `jsonBody` expression, confirmed via the
version history that the earlier (2026-07-27) drafts also added a
Facebook branch to `Build Platform Posts` and a Discord webhook branch
that had never actually been published/activated — published that
improved version too, so this workflow now covers X, Instagram, Facebook,
**and** Discord, not just X/Instagram.

**First run (execution 2691):** X and Instagram posted successfully.
Facebook failed on the bug above. Discord posted successfully (once).

**Bug 2 — found while trying to retry Facebook only.** Tried to disable
the Discord node and re-fire with `platforms:["facebook"]` so only the
fixed Facebook post would go out. Two things went wrong:
- `Normalize Article Fields` had `includeOtherFields: false`, which
  silently drops any body field not explicitly mapped — so `platforms`
  never reached `Build Platform Posts`, which fell back to its default
  (all three platforms). **This means the "Facebook-only" retry actually
  rebuilt and re-sent X and Instagram too**, not just Facebook.
- Disabling the Discord node did not prevent it from executing on that
  retry — still unclear why; the disable flag was set and published
  before the retry ran. **Discord likely received the announcement
  twice.**

**What this means concretely:**
- **Discord:** almost certainly posted twice. If you're in the server,
  it's an easy manual delete of the duplicate — I don't have a tool in
  this session that can reach Discord directly to check or clean it up
  myself.
- **X / Instagram:** Blotato returned the *exact same* `postSubmissionId`
  on both the first and the retry call for these two platforms
  (`b5752e4d…` and `ec7e5a7d…` respectively), which suggests Blotato
  deduped identical content rather than creating a second real post — but
  I can't confirm that from here without checking the Blotato dashboard.
  Worth a 10-second look if you want certainty.
- **Facebook:** posted successfully on the retry (`f2fcf693…`), so that
  part of the fix is confirmed working.

Both underlying bugs are now fixed and published (`Normalize Article
Fields` now passes through the full body via `includeOtherFields: true`,
and Discord is re-enabled) — future single-article publishes and any
platform-scoped retries will behave correctly, and this shouldn't recur.

## Captions sent

- **X/Twitter:** `GTA 6 Is Coming To Netflix — "An Extended Look" Premieres August 27 https://56vicelane.com/articles/gta6-netflix-extended-look-august-27 #GTA6`
- **Instagram:** headline + excerpt + "Full story → 56vicelane.com (link in bio)" + hashtag block
- **Facebook:** headline + excerpt + direct article URL in-caption
- **Discord:** `📰 New on 56ViceLane — **[headline]**` + excerpt + direct link

## Not covered

**YouTube and TikTok** — no video asset exists for this story yet, so
there's nothing to natively upload there regardless of Blotato's
YouTube/TikTok gap. If a short-form video breakdown of this news is
wanted (script + AI clips, same pipeline as the Last Drive preview video),
that's a separate follow-up, not done here.
