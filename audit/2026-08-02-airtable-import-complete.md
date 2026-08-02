# Aug 1 Airtable → n8n Historical Data Import — Complete, 2026-08-02

Confirmed live that the Airtable quota reset as expected: `list_tables_for_base`
succeeded with a full schema response (previously 429'd with "API billing
plan limit exceeded... monthly limit"). This unblocked the one-time
historical import (`JYgaHxAS3ErBAGX5`, "ONE-TIME: Aug 1 Airtable to Data
Table Migration") that had been sitting ready since 2026-07-27.

## A real bug was caught before it did lasting damage

First run (execution #2616) reported `status: success`, but checking the
actual inserted data (not just the status) showed every row was blank —
name, gamertag, email, everything defaulted to `""`/`0`/`false`. Root
cause: the four "Map Fields" code nodes read `item.json.Gamertag` etc.
directly, but n8n's Airtable node nests actual field values under
`item.json.fields.Gamertag` — every read silently failed and fell back to
its `|| ""` default instead of erroring.

**Fixed:** all four Map nodes (`Map LastDrive Fields`, `Map PointsLedger
Fields`, `Map PageStats Fields`, `Map Redemptions Fields`) now read from
`item.json.fields`. Cleared the 41 corrupted LastDrive rows and 64
corrupted PageStats rows (added temporary `Clear Corrupted ... Rows`
data-table-clear nodes, wired before their respective Search nodes so
future re-runs can't accidentally skip the clear step), then re-ran
(execution #2617) with real data confirmed in the output.

## Verification (per the original cutover plan's requirement)

Row counts checked directly against live Airtable, not assumed:

| Table | Airtable count | n8n Data Table count after import |
|---|---|---|
| LastDrive | 41 | 41 |
| PointsLedger | 0 | 0 |
| PageStats | 64 | 64 |
| Redemptions | 0 | 0 |

PointsLedger and Redemptions are genuinely empty in Airtable right now —
not a fetch failure (the Redemptions branch happens to reference its
Airtable table by name instead of ID, unlike the other three; worth a
look eventually, but the empty result was confirmed correct against a
proper by-ID query, so it didn't affect this import).

Also spot-checked one real record field-by-field: Airtable's "Bob" /
`Frite_sauce_` (PS5, NA East, Pier, Free Premium, founder plate, signup
#7) matches the imported n8n row exactly across every field.

The one-time migration workflow has been updated in place (description +
sticky note) marking it complete and warning against a second run — no
dedupe exists, re-running would duplicate all 105 real rows.

## Also this session

- **G FUEL affiliate approval (Awin, publisher ID 3009641)** — already
  correctly logged in `audit/2026-07-28-affiliate-program-signups.md`
  and the daily checklist; confirmed current, no update needed.

## Still ahead before `USE_N8N_BACKEND` goes live

Per the original cutover plan, flipping `track.js`/`members.html`/
`lastdrive.html`'s `USE_N8N_BACKEND` flag to `true` — the step that makes
real visitor signups/points/lookups write to n8n instead of Airtable —
is a separate, explicit decision from the historical import above.
The import being verified correct is what makes that flip *safe* to
consider now; it isn't itself the flip. Held for Chris's explicit
go-ahead, same as previously agreed.
