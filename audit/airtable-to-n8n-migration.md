# Airtable → n8n Data Table Migration

Started 2026-07-27, triggered by Airtable's Free-plan API quota being
exhausted for the month (see `NEXT-SESSION.md` item -1). Goal: move the
site's live data (members, points, page stats, redemption codes) off
Airtable's public API and onto n8n's own Data Table feature, which is free,
already in use elsewhere in this project (WeeklyFrequency table), and not
subject to the quota that's currently blocking purchases and verification.

**This is a build-and-test project, not a live cutover.** Nothing here goes
into production until Chris reviews it. Two hard blockers on going live
regardless of how ready the code is:
1. Real member/points/redemption data can't be exported from Airtable to
   seed the new tables until the API quota resets Aug 1 — any read attempt
   429s right now.
2. `store.html`'s `STORE_MAINTENANCE` flag stays `true` until Chris says
   otherwise, independent of this migration.

## Status

- [x] Schema designed (below)
- [x] 4 n8n Data Tables created (empty, in Chris's personal n8n project
      `8Bc2ZVWgrU5nt5lm`)
- [x] 10 webhook workflows built, validated, published (below) — covers all
      15 real call sites found (12 originally documented + 3 discovered
      while wiring the client, see notes) via 4 sensible consolidations
- [x] Client-side JS rewired **for 3 of 4 files** — track.js, members.html,
      lastdrive.html fully wired behind an off-by-default flag.
      **store.html deliberately deferred — see "Scope decision" below.**
- [x] Cutover + real-data-migration plan written (below)
- [ ] Chris's review + go-live decision

## Webhook workflows (2026-07-27, built with mcp__n8n__* tools)

All live in project `8Bc2ZVWgrU5nt5lm`, all published/active, all
no-credential webhooks (same trust model as the existing Friday Frequency
serve webhook — the URL itself is the only thing exposed to the browser).
CORS `Access-Control-Allow-Origin: *` on every response; `Cache-Control:
no-store` except List Members (public data, cached 60s).

| Workflow | Method | URL | Replaces |
|---|---|---|---|
| LastDrive - Verify Player | GET | `.../webhook/f3a283dd-514a-48c7-8aa2-0296591de2e3/verify-player?gamertag=&email=` | store.html `verifyPlayer()` |
| LastDrive - Find Profile | GET | `.../webhook/4c14d773-79ce-49ba-9030-e0cb44d85ee5/find-profile?gamertag=` | members.html `findProfile()` **+** lastdrive.html `searchFriend()` (merged — identical lookup, different field subset) |
| LastDrive - List Members | GET | `.../webhook/b167e93d-cffa-4b56-b159-c3d7da5cfa3b/list-members` → `{members:[...]}` | members.html `loadMemberData()` **+** lastdrive.html `loadCounts()` + `isFirstSignup()` (3 call sites not in the original doc, found while reading the actual files — all public wall-of-honor data, no email/PII) |
| LastDrive - Grant Plate | POST | `.../webhook/802db2f3-304c-4b56-9315-b5254a653b03/grant-plate` body `{gamertag,plateId,plateStatus,giftPlate}` | store.html purchase handlers — **not wired client-side, see below** |
| Redemptions - Check Pending Prize | GET | `.../webhook/b872ae2a-84bb-4f2b-aae9-36d140041c77/check-prize?gamertag=` | store.html `checkForPendingPrize()` — **not wired client-side, see below** |
| Redemptions - Redeem Code | POST | `.../webhook/3107b1c1-0c58-4055-93f7-e04496a743b5/redeem-code` body `{code,gamertag,plateId}` | store.html `grantRedeemedPlate()` — **not wired client-side, see below** |
| LastDrive - Row Count | GET | `.../webhook/29212558-4585-4420-9bc3-044074133252/lastdrive-count` → `{count,nextSignupNumber}` | store.html `loadFounderCount()` **+** lastdrive.html `getSignupNumber()` (merged — identical query) |
| LastDrive - Signup | POST | `.../webhook/3b87bbd8-711b-4014-b35f-a4354fa53a20/lastdrive-signup` body = full signup form → `{success,gamertag,signupNumber,plateStatus}` | lastdrive.html Drive Lead + Participant signup |
| PageStats - Track Pageview | POST | `.../webhook/cefe674c-ff97-420e-83e6-5cace07977cc/track-pageview` body `{slug}` | track.js anonymous pageview (now one atomic upsert, not a GET+PATCH round trip) |
| PointsLedger - Track Action | POST | `.../webhook/72563ac9-1235-450f-bd52-5369d3812cb9/track-action` body `{gamertag,action,points,ref}` → `{awarded,points,weekPoints}` or `{awarded:false,reason:"cooldown"}` | track.js scored action write **+** the separate LastPointAt cooldown GET (folded server-side — was two racy round trips, now one atomic check-and-write) |

All URLs share the host `https://n8n.56vicelane.com`.

**3 correctness fixes made after the first pass** (caught by actually
reading store.html/lastdrive.html's real field usage instead of trusting
the original call-site summary):
1. `linkedSlot` format was wrong — first version computed
   `platform||region||stagingTime||stagingLocation`; the real client code
   (lastdrive.html, both signup handlers) builds it as
   `platform||region||stagingLocation||stagingTime`. Fixed in the Signup
   workflow to match exactly.
2. `plateStatus` was hardcoded to `"Standard"` on every signup — missed the
   actual founder-plate business rule (first 100 signups get `"Free
   Premium"`). Fixed: now computed server-side from the same live count
   used for `signupNumber`.
3. `joinStatus` was hardcoded to `"Active"` — silently dropped the
   "Approval Required" drive's pending-approval flow (`"Pending"` vs
   `"Active"`, gates whether the drive lead has to approve a join request).
   Fixed: now a real field in the signup request, defaulting to `"Active"`.

**Remaining design notes / assumptions Chris should sanity-check before
go-live:**
- ISO week key (`weekKey`, e.g. `2026-W31`) is now computed **server-side**
  via Luxon (`$now.toFormat("kkkk-'W'WW")`) in both PageStats and
  PointsLedger workflows, rather than trusting a client-computed value —
  more reliable, can't be spoofed/desynced by client clock drift.
- Redeem Code's plate choice: assumes the redemption flow lets the winner
  pick which plate they want (`plateId` in the request body) rather than
  a plate being pre-assigned. If the actual UX pre-assigns a specific
  plate to each prize code, this needs a small adjustment (drop the
  client-supplied `plateId`, look up a `plateId` column on the Redemptions
  row instead — that column doesn't exist yet, would need adding).

## Pre-existing workflow found: "Track Engagement — Ingest" (superseded)

While verifying the current state (2026-07-28), found an inactive workflow
`k6J5ND9PWrZfAD9A` created 2026-07-21 — **before** this migration and
before the Airtable quota crisis. It's a webhook that validates/scores
engagement events and writes to PageStats/PointsLedger/LastDrive, but via
n8n's native **Airtable** node (not Data Tables) — meaning it still calls
Airtable's real API under the hood and would hit the exact same quota
problem this migration exists to solve. This is almost certainly what
track.js's original comment meant by "the dedicated server-side n8n path
exists but isn't in use right now, per Chris's call" — Chris apparently
had this built earlier and chose not to switch to it, keeping the direct
client-side Airtable calls instead.

It's inactive and not called by anything, so it's harmless as-is. It's
now superseded by this migration's Data-Table-backed workflows (PageStats
- Track Pageview, PointsLedger - Track Action) and can be deleted in a
cleanup pass once the new backend is live — not urgent, flagging for
awareness so there aren't two different "engagement tracking" webhooks
floating around. (Its Airtable credential, `O7t9flm8SZd3Ba0v` "Airtable
Personal Access Token account", was reused for the one-time Aug 1 export
workflow above rather than creating a duplicate credential.)

## Scope decision: store.html's purchase/plate-granting code NOT rewired

store.html has **7 distinct places** that PATCH a member's plate fields —
not one uniform "grant a plate" call site like the original doc assumed.
Reading the actual code turned up real differences in what each one does:
- `setActivePlate()` / `selectPlate()` (already-owned plate) — just flips
  `PlateStyle`, no purchase, no grant.
- At least 4 more PATCH sites around the featured-plate, bundle, Pick-5,
  and single-plate PayPal `onApprove` handlers — each likely sets a
  different combination of fields per bundle type, not read in full.

I did **not** rewrite these. Reasons, in order:
1. **It's real payment logic.** A wrong field mapping here either fails to
   grant something a buyer paid for, or grants the wrong thing — the kind
   of bug that's expensive to discover after the fact and impossible to
   verify without a live PayPal sandbox run, which an unattended session
   can't do.
2. **It's already fully gated off.** `STORE_MAINTENANCE = true` means none
   of these 7 call sites are reachable by a real visitor right now — there
   is zero urgency, and the guardrail explicitly says don't touch that flag.
3. **The 3 workflows exist and are tested** (Grant Plate, Check Pending
   Prize, Redeem Code) — the backend side of this is done. What's left is
   specifically the careful 1:1 mapping of each of the 7 PATCH sites to the
   right webhook call, which deserves a session where the exact bundle
   field semantics get read in full and ideally checked against a sandbox
   purchase, not a blind overnight rewrite.

**Next session should:** read store.html's `applySinglePlate()` and the
~4 PayPal `onApprove` handlers in full, map each to Grant Plate/Redeem
Code with the right field payload, wire it behind the same
`USE_N8N_BACKEND` flag pattern used in the other 3 files, and test against
a PayPal sandbox transaction before considering it done.

## Cutover + real-data-migration plan for Aug 1

**Everything above is inert until manually flipped.** `USE_N8N_BACKEND =
false` in track.js, members.html, and lastdrive.html (store.html has no
flag yet — nothing to flip, it's still 100% Airtable). Flipping requires
editing the flag in each file and does not require Chris to know n8n
internals.

**Before flipping anything:**
1. **Aug 1 — Airtable quota resets.** Run the workflow **"ONE-TIME: Aug 1
   Airtable to Data Table Migration"** (`JYgaHxAS3ErBAGX5` in the same n8n
   project) — built and validated 2026-07-28, left **inactive** on purpose
   since it's meant to be manually executed once from the n8n editor, not
   auto-triggered. It reads every row from the 4 real Airtable tables
   (using the same Airtable credential the old "Track Engagement — Ingest"
   workflow used — see note below) and inserts them into the matching
   Data Table with the camelCase mapping from the Schema section above.
   **Running it twice duplicates every row — there's no dedupe.** The
   workflow has a sticky note with this same warning. If a re-run is ever
   needed, clear the Data Table first (Data table node, table resource,
   "clear" operation).
2. **Verify counts match** — row count per table, plus spot-check a
   handful of real gamertags via the Find Profile/List Members webhooks
   against the Airtable UI directly, before trusting the import.
3. **Finish store.html** per the Scope decision above — the 3 backend
   workflows are ready, the client wiring isn't.
4. **Chris reviews and explicitly approves** flipping `USE_N8N_BACKEND` to
   `true` — this session should not flip it unilaterally even after data
   import, since it changes what real visitors' actions write to.

**Flipping the switch, once approved:**
1. Set `USE_N8N_BACKEND = true` in track.js, members.html, lastdrive.html
   (and store.html once its wiring exists).
2. Smoke-test each flow manually against the live webhooks: verify player
   lookup, member search, signup (both Drive Lead and Participant paths,
   including an Approval-Required drive to check the `joinStatus` fix),
   pageview tracking, a scored action, and the cooldown block.
3. Watch n8n execution history for the first real hour of traffic —
   `mcp__n8n__search_executions` per workflow — to catch anything the
   build-and-test pass missed.
4. Once stable, the Airtable-path functions (the `*Airtable()` half of
   every rewired function) and the embedded `AT_TOKEN` become dead code —
   safe to delete in a follow-up cleanup pass, not urgent.

**Rollback:** flip `USE_N8N_BACKEND` back to `false`. Both code paths stay
in the file side by side specifically so this is a one-line revert, not a
redeploy-from-git operation.

## Schema

n8n Data Table columns must match `^[a-zA-Z][a-zA-Z0-9_]*$` (letters/
numbers/underscore, no spaces) — Airtable field names with spaces were
converted to camelCase. Field values/semantics are otherwise unchanged from
the Airtable base (`appVViGbmcu5gbn8B`, "56ViceLane Last Drive").

### `LastDrive` (id `qAuBlJIozGJbHzLb`) — was Airtable table "Last Drive"

| n8n column      | type    | was (Airtable)     | notes |
|---|---|---|---|
| name             | string  | Name                | |
| gamertag         | string  | Gamertag            | primary lookup key, not enforced-unique by n8n — dedupe logic must live in the workflow |
| email            | string  | Email                | |
| platform         | string  | Platform             | |
| region           | string  | Region                | |
| stagingTime      | string  | Staging Time          | |
| stagingLocation  | string  | StagingLocation       | |
| chat             | string  | Chat                  | |
| chatOther        | string  | ChatOther             | |
| crewName         | string  | CrewName              | |
| driveType        | string  | Drive Type            | |
| passiveMode      | boolean | Passive Mode          | |
| isOrganizer      | boolean | IsOrganizer           | |
| showOnWall       | boolean | ShowOnWall            | |
| petitionOptIn    | boolean | Petition Opt In       | |
| signupType       | string  | SignupType            | "Drive Lead" \| "Participant" |
| accessType       | string  | AccessType            | default "Open" |
| joinStatus       | string  | JoinStatus            | "Active" |
| linkedSlot       | string  | LinkedSlot            | composite key: `platform\|\|region\|\|staging\|\|slot` |
| signupNumber     | number  | SignupNumber          | founder-plate ordinal, <=100 |
| plateStatus      | string  | PlateStatus           | "Free Premium" \| "Standard" \| "Single Nameplate" \| "Prize Nameplate" |
| plateStyle       | string  | PlateStyle            | active plate id |
| ownedPlates      | string  | OwnedPlates           | comma-joined plate id list (kept as string to match existing `buildOwnedFromRecord`/`.split(',')` client logic) |
| giftPlate        | string  | GiftPlate             | |
| points           | number  | Points                | lifetime total |
| weekPoints       | number  | WeekPoints            | resets weekly (see Friday Winner Selection workflow) |
| pointsWeekKey    | string  | PointsWeekKey         | ISO week key, e.g. `2026-W30` |
| lastPointAt      | string  | LastPointAt           | ISO timestamp, used for the 4s anti-spam cooldown in track.js |

### `PointsLedger` (id `2emP6NAqQnMMspLe`)

| n8n column | type    | was (Airtable) |
|---|---|---|
| gamertag   | string  | Gamertag |
| action     | string  | Action — "Article Read" / "Blotter Read" / "Editor/Trevor Read" / "Reply Posted" / "Affiliate Visit" |
| points     | number  | Points |
| ref        | string  | Ref (article slug or similar) |
| weekKey    | string  | WeekKey |
| processed  | boolean | Processed |

### `PageStats` (id `FUVndPfz2zKxW99Z`)

| n8n column | type   | was (Airtable) |
|---|---|---|
| slug       | string | Slug — unique per article |
| views      | number | Views |
| weekViews  | number | WeekViews |
| weekKey    | string | WeekKey |
| lastVisit  | string | LastVisit (ISO timestamp) |

### `Redemptions` (id `WhKndJ7fdBSXYVwR`)

| n8n column | type   | was (Airtable) |
|---|---|---|
| code       | string | Code — VL-XXXX-XXXX prize codes |
| gamertag   | string | Gamertag |
| reason     | string | Reason (e.g. "Top 3 this week", "Trevor's Pick") |
| status     | string | Status — "Issued" \| (redeemed state) |

## Every client-side Airtable call site (final list, 15 total)

Originally documented as 12 (below, unmarked); 3 more turned up while
actually reading store.html/members.html/lastdrive.html in full during the
client-wiring pass (marked **new**).

- `store.html` — `verifyPlayer()` (GET filter by Gamertag+Email),
  `setActivePlate()` / `selectPlate()` for already-owned plates (PATCH,
  **new** — not a purchase, just switches active style), ~4 PayPal
  `onApprove` purchase handlers across featured/bundle/Pick-5/single-plate
  (PATCH, **not individually read/mapped — see Scope decision**),
  `checkForPendingPrize()` (GET Redemptions), `grantRedeemedPlate()` (PATCH
  + Redemptions update), `loadFounderCount()` (GET count)
- `members.html` — `findProfile()` (GET filter by Gamertag),
  `loadMemberData()` (**new** — paginated bulk read for wall-of-honor
  stats + featured drive-lead cards)
- `lastdrive.html` — Drive Lead signup (POST), Participant signup (POST),
  `getSignupNumber()` (GET count), `isFirstSignup()` (**new** — per-slot
  availability check, 4 parallel calls per region click),
  `searchFriend()` (**new** — same shape as members.html's `findProfile()`
  but a separate implementation), `loadCounts()` (**new** — per-platform
  signup counts shown on the page)

Each becomes one n8n webhook-triggered workflow reading/writing the Data
Tables above instead of Airtable's REST API (several call sites share a
workflow where the underlying query is identical — see the table above).
Webhooks require no client-embedded write credential — n8n's webhook URL
itself is the only thing exposed to the browser, same trust model as the
existing Friday Frequency serve webhook already in production.
