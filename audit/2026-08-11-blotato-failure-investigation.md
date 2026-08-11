# Blotato Failure Investigation — 2026-08-11

**Trigger:** Chris forwarded 3 Blotato "post has failed to publish" emails
from 2026-08-10 (6:01pm, 8:00pm x2 CT). Investigated each via real n8n
execution data and Blotato's actual error responses rather than the email
previews alone.

## Finding 1 — Instagram content restriction (2 of 3 failures)

- **"What's one thing you want in GTA6..."** (Evergreen Recycle Poster,
  6pm CT run) and **"This is the one 56ViceLane event..."** (Last Drive
  Push, 8pm CT run) both failed on Instagram only — the Twitter/Facebook
  versions of the same content, submitted in the same batch, published
  fine.
- Real Blotato error on both: *"Error posting to Instagram: We restrict
  certain activity to protect our community. Tell us if you think we made
  a mistake."*
- Both were caught and Discord-alerted correctly by `Blotato - Check Post
  Status` (built 2026-08-10) — that monitor worked exactly as designed for
  these two.
- Likely cause: Meta's automated spam/rate-limit detection reacting to the
  posting-volume ramp that went live the same day (Last Drive Push 2x→6x
  scaling). Per Chris's call (2026-08-11): leave posting frequency as-is
  for now — IG already has near-zero traction, not worth adjusting the
  ramp plan over occasional restricted posts. Revisit if it escalates or
  risks the account itself.

## Finding 2 — Silent logging gap (1 of 3 failures) — real bug, now fixed

- **"Sports Cars Nameplate Bundle"** (Evergreen Recycle Poster, 1pm CT
  run) never reached Blotato's async status check at all. Traced via n8n
  execution data: `Post to Blotato` succeeded for all 3 platform versions
  (valid submission IDs returned for all 3), but the downstream `Log
  Submissions` node — which writes to the `SocialPostLog` table the
  30-min monitor reads from — never executed for this run. Not an error,
  just absent from the execution's run data.
- The same workflow's 6pm run *the same day*, identical config, logged
  correctly. This looks like a transient write hiccup, not a config bug —
  but with only 2 real data points (the node was added 2026-08-10), the
  exact root cause isn't confirmed.
- Because nothing got logged, `Blotato - Check Post Status` had no row to
  check and never alerted Discord. **Blotato's own email was the only
  record of this failure anywhere** — a real gap in the monitoring system
  that was specifically built to prevent exactly this kind of blind spot.

### Fix applied (2026-08-11)

Added `retryOnFail: true, maxTries: 2, waitBetweenTries: 2000ms,
alwaysOutputData: true` to the `Log Submissions` node in all 3 workflows
sharing this identical pattern (`Evergreen Recycle Poster`, `Last Drive
Push (ramping to launch)`, `Friday Frequency — Generate & Post`) —
published live in all three. Guards against a transient write failure
being silently absorbed; `onError` deliberately left at default
(`stopWorkflow`) so a genuine unrecoverable failure now shows as a
visible error execution in n8n instead of a silent "success" with a
missing row.

**Not yet done, worth flagging:** this mitigates the most likely cause
but doesn't prove it. If a silent logging gap recurs after this fix, that
points to something deeper (possibly an n8n execution-data-retrieval
quirk under parallel branches/batching) worth a closer look or an n8n
support ticket — not something fixable by node config alone.
