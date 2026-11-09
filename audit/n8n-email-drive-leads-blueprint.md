# n8n Workflow Blueprint: Email All Drive Leads

**Status: not built/activated — this is a spec to build from in n8n's UI.**
I can't reach n8n from this sandbox (network policy block on this Claude
Code environment, see `audit/daily-checklist.md` Urgent section), so I
can't import or test this myself. Written precisely enough that building
it directly in n8n's editor should take about 5 minutes.

## Why this doesn't exist yet
There's no "bulk email the signups" pipeline anywhere in the current n8n
setup — only transactional, event-triggered emails (e.g. the "you'll
receive an email when approved" flow in `lastdrive.html`). This is a new,
manually-triggered workflow.

## Nodes

1. **Manual Trigger** (or a webhook if you want to fire it from `admin.html`
   with a button — manual is safer to start with, no accidental re-sends).

2. **HTTP Request — Get Signups**
   - Method: GET
   - URL: same as `admin.html` uses — `https://n8n.56vicelane.com/webhook/admin-list-signups`
     (or, better: whatever internal node/credential that webhook itself
     calls under the hood — Airtable base `appVViGbmcu5gbn8B`, table
     `Last Drive`, per `NEXT-SESSION.md` — query that directly inside n8n
     instead of hopping back out to the public webhook, since you're
     already inside n8n at that point).
   - **I can't confirm from here whether the raw response includes an
     `email` field** — `admin.html`'s own JS only mapped a subset of
     fields (just fixed a bug where it was dropping `Email`/`Region`/
     `SignupType`/`StagingTime` from its CSV export, see latest commit).
     Check the actual JSON this node returns before building the filter
     below — if `email` isn't in it, you'll need to go to the Airtable
     table directly instead.

3. **Filter node** — keep only records where:
   - `isOrganizer` (or `IsOrganizer`) is `true`
   - `email` is non-empty

4. **Split In Batches** (batch size 1, or small batches like 10 with a
   short delay between — avoids tripping Gmail's sending rate limits)

5. **Send Email node** (Gmail SMTP credential — the one Chris already set
   up per `NEXT-SESSION.md`'s "Gmail SMTP" note)
   - To: `{{$json.email}}`
   - Subject: `10 Days to Launch, 9 Days to The Last Drive — Here's What To Do Now`
   - Body (plain text or simple HTML, personalized):

```
Hey {{$json.gamertag}},

Quick one — we're down to 10 days until GTA6 launches, which means The
Last Drive is just 9 days away (November 18). Time to lock things in.

A few things to take care of this week:

1. Add everyone who's joined your drive.
Check who's signed up under your slot and make sure they're added as
in-game friends now — don't wait until the night of. If anyone's fallen
through the cracks, reach out and confirm they're still in.

2. Make your arrangements.
Confirm your platform, region, staging time, and meeting spot if you
haven't already. The clearer this is now, the smoother the 18th goes.

3. Claim your Discord channel.
Head to #last-drive on our Discord (https://discord.gg/ewdRcjsbg5) and
claim a channel/thread for your drive specifically — this is the easiest
way to coordinate directly with your riders, confirm gamertags, and
handle last-minute changes without things getting lost in the main
channel.

You signed up to lead this — thank you for that. With 166 drivers and
growing counting on drive leads like you, getting these three things
locked in this week makes all the difference for how the night actually
goes.

See you on the road,
The 56ViceLane Team
```

   - Update the day counts (10/9) if you build and send this on a
     different day than today (2026-11-09).

6. **(Optional) Log to Discord or a Google Sheet** — one line per send,
   so there's a record of who got the email and when, matching the
   "log every scheduled post" pattern already used elsewhere in CLAUDE.md.

## Before activating
- Confirm the `email` field actually exists in whatever node 2 returns —
  I could not verify this from my sandbox.
- Send yourself a single test email first (filter to just your own
  gamertag) before running it against the full Drive Lead list.
- Once this works, it's reusable for any future "message all drive
  leads" need — just re-trigger it manually with updated subject/body.
