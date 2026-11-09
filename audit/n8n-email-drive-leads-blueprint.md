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

---

# n8n Workflow Blueprint: Admin Password Reset

**Status: frontend done and shipped to `main`; backend not built (same
n8n-reachability block as above).** Added 2026-11-09 after Chris got
locked out of `/admin` with no password recovery and no plaintext
password stored anywhere (correct — it should never be in the repo).

## What's live now (`admin.html`)
- "Forgot password?" link on the login gate → reveals a "Send Reset
  Link" button → POSTs `{gamertag: 'Musashi13'}` to
  `https://n8n.56vicelane.com/webhook/admin-request-password-reset`.
- A separate reset-password view, shown automatically when the page
  loads with `?reset=TOKEN` in the URL (i.e. the link from the emailed
  reset) → takes a new password + confirmation, POSTs
  `{gamertag, token, newPassword}` to
  `https://n8n.56vicelane.com/webhook/admin-reset-password`.
- Both webhook URLs are wired in but **neither endpoint exists in n8n
  yet** — clicking "Send Reset Link" right now will just fail with a
  connection/parse error until the workflow below is built.

## Nodes needed in n8n

**Workflow A — `admin-request-password-reset`**
1. Webhook (POST), path `admin-request-password-reset`.
2. Generate a random token (Crypto/Code node — e.g. a UUID or 32-char
   random string) and an expiry timestamp (now + 30 min is reasonable).
3. Store `{token, expiresAt}` somewhere n8n can read back later — a
   dedicated Airtable table, or n8n's own static data / a key-value
   store node, whatever's already the pattern elsewhere in this n8n
   instance.
4. Send Email node (same Gmail SMTP credential as the Drive Lead
   blueprint above) to **`forgedoakstudios@gmail.com`** — hardcode this
   exact address in the node itself, don't take an email as input from
   the request, or anyone could trigger a reset email to an address
   they control. With a link:
   `https://56vicelane.com/admin?reset={{token}}`
5. Respond to Webhook: `{"success": true}`

**Workflow B — `admin-reset-password`**
1. Webhook (POST), path `admin-reset-password`.
2. Look up the submitted `token` in wherever Workflow A stored it.
   - Not found → respond `{"success": false, "error": "Reset link invalid or expired. Request a new one."}`
   - Found but past `expiresAt` → same error response, and delete the
     expired token.
3. If valid: update the stored admin password (wherever
   `admin-verify-password` currently reads it from — same credential/
   field) to `newPassword` from the request body.
4. Delete/invalidate the used token so the link can't be replayed.
5. Respond: `{"success": true}`

## Before activating
- Same caveat as the Drive Lead workflow: I can't build, import, or
  test this from my sandbox (network policy block, see
  `audit/daily-checklist.md` Urgent). This needs building directly in
  n8n's editor.
- Hardcode the destination email in Workflow A — don't make it an
  input. This is the one security-sensitive piece: an open "reset
  request" endpoint that emails whatever address is provided would let
  anyone lock the real admin out.
- Test end-to-end once built: request a reset, confirm the email
  arrives, click the link, confirm `/admin?reset=...` shows the new
  form, set a new password, confirm `adminLogin()` works with it
  afterward.
