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
- [ ] Webhook workflows (one per client-side Airtable call site)
- [ ] Client-side JS rewired to call webhooks instead of Airtable directly
- [ ] Real-data export/import plan for Aug 1
- [ ] Chris's review + go-live decision

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

## Every current client-side Airtable call site (to be replaced 1:1)

- `store.html` — `verifyPlayer()` (GET filter by Gamertag+Email), `applySinglePlate()` /
  bundle purchase handlers (PATCH), `checkForPendingPrize()` (GET Redemptions),
  `grantRedeemedPlate()` (PATCH + Redemptions update), `loadFounderCount()` (GET count)
- `members.html` — `findProfile()` (GET filter by Gamertag)
- `lastdrive.html` — Drive Lead signup (POST), Participant signup (POST),
  `getSignupNumber()` (GET count)
- `track.js` — anonymous pageview (GET+PATCH/POST PageStats), scored action
  write (POST PointsLedger + PATCH LastDrive rollup), cooldown check (GET
  LastPointAt)

Each becomes one n8n webhook-triggered workflow reading/writing the Data
Tables above instead of Airtable's REST API. Webhooks should require no
client-embedded write credential — n8n's webhook URL itself is the only
thing exposed to the browser, same trust model as the existing Friday
Frequency serve webhook already in production.
