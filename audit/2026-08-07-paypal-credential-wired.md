# PayPal purchase verification — credential wired, 2026-08-07

Closes the gap flagged since 2026-08-05: the "Store - Verify Purchase
(PayPal)" n8n workflow (`hnNwToGNUpmPzICA`) shipped with server-side order
verification but no PayPal API credential attached to its "Get PayPal
Token" node — every purchase would have failed server-side with no
fallback to the old direct-grant path. Flagged in 3 consecutive daily
checklists (8/5, 8/6, 8/7) before Chris confirmed he thought it was
already resolved.

## What was done

Attached the existing "PayPal API - Live" credential (`fcGRMnI5FdGTtTh4`,
created by Chris) to the "Get PayPal Token" node.

## Verification

Ran a manual test execution (id `2764`) with a synthetic, deliberately
invalid order ID:
- "Get PayPal Token" — succeeded, returned a real OAuth access token from
  PayPal's live API (real `app_id`, real scopes) — confirms the credential
  itself is valid and correctly wired.
- "Get Order Details" — correctly returned `RESOURCE_NOT_FOUND` /
  `INVALID_RESOURCE_ID` for the fake order ID, exactly the behavior wanted
  (rejects orders that don't exist rather than granting anything).
- "Validate Order" → workflow correctly resolved to "Order not completed"
  and responded with a failure, not a grant.

No real money moved, no real order was touched. A genuine purchase with a
real completed PayPal order ID should now verify correctly end-to-end —
worth Chris doing one real low-value purchase himself to confirm the full
round-trip (including the plate/bundle actually getting granted) before
fully trusting this in production.

## Status

Store purchases should now be working again as of this fix. Removed from
the daily checklist's urgent section as of the 8/7 regen's next pass.
