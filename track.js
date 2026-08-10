/* track.js — 56ViceLane engagement tracking
   Calls the n8n Track Pageview / Track Action webhooks server-side; no
   Airtable credential is ever shipped to the browser.

   Two independent things happen on include:
   1. Anonymous pageview -> PageStats (Views/WeekViews), no identity needed.
      Feeds the parked Top Stories = most-visited feature.
   2. If a gamertag is known (localStorage, set once a visitor verifies on
      store.html/members.html) and this page declares a data-track-action,
      a scored PointsLedger row is written + rolled up onto their Last
      Drive record. Points values are intentionally never shown here or
      anywhere public-facing.

   Anti-spam: the Track Action webhook re-reads the member's own
   LastPointAt server-side and skips the write if less than COOLDOWN_MS
   has passed, atomically with the ledger insert + rollup. */
(function () {
  var N8N_TRACK_PAGEVIEW_URL = 'https://n8n.56vicelane.com/webhook/track-pageview';
  var N8N_TRACK_ACTION_URL   = 'https://n8n.56vicelane.com/webhook/track-action';

  var RATES = {
    'Article Read':       1,
    'Blotter Read':       2,
    'Editor/Trevor Read': 3,
    'Reply Posted':       5,
    'Affiliate Visit':    10
  };

  function currentGamertag() {
    try { return (localStorage.getItem('56vl-gamertag') || '').trim(); }
    catch (e) { return ''; }
  }

  function trackPageview(slug) {
    if (!slug) return;
    fetch(N8N_TRACK_PAGEVIEW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: slug })
    }).catch(function () {});
  }

  function trackAction(action, ref) {
    var gamertag = currentGamertag();
    var points = RATES[action];
    if (!gamertag || !points) return;
    /* Cooldown check happens server-side inside this one call — the
       webhook reads LastPointAt, checks it, and does the ledger insert +
       LastDrive rollup atomically. Response is {awarded:false,
       reason:"cooldown"} if blocked, ignored here either way since points
       are never shown client-side. */
    fetch(N8N_TRACK_ACTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gamertag: gamertag, action: action, points: points, ref: ref || '' })
    }).catch(function () {});
  }

  var thisScript = document.currentScript;
  var declaredAction = thisScript ? thisScript.getAttribute('data-track-action') : null;
  var slug = window.location.pathname.replace(/\/+$/, '').split('/').pop() || 'home';

  trackPageview(slug);
  if (declaredAction) trackAction(declaredAction, slug);

  /* Exposed so reply-submission and affiliate-link handlers (wired
     separately) can award their own actions on demand, e.g.:
     window.vfTrack('Reply Posted', articleSlug)
     window.vfTrack('Affiliate Visit', outboundUrl) */
  window.vfTrack = trackAction;
})();
