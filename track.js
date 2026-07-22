/* track.js — 56ViceLane engagement tracking
   Writes directly to Airtable using the same embedded token already used
   on store.html/members.html (the dedicated server-side n8n path exists
   but isn't in use right now, per Chris's call — running on the old
   client token instead).

   Two independent things happen on include:
   1. Anonymous pageview -> PageStats (Views/WeekViews), no identity needed.
      Feeds the parked Top Stories = most-visited feature.
   2. If a gamertag is known (localStorage, set once a visitor verifies on
      store.html/members.html) and this page declares a data-track-action,
      a scored PointsLedger row is written + rolled up onto their Last
      Drive record. Points values are intentionally never shown here or
      anywhere public-facing.

   Anti-spam: before awarding, re-reads the member's own LastPointAt from
   Airtable and skips the write if less than COOLDOWN_MS has passed. This
   is a real deterrent against naive rapid-fire scripts and stops any
   genuine human from being credited for physically-impossible back-to-back
   actions, but it is not a hard security boundary — the token is visible
   in page source, so a determined attacker could still pace requests
   around the cooldown. Acceptable tradeoff for what's at stake (a free
   nameplate), not appropriate for anything higher-value. */
(function () {
  var AT_TOKEN = 'pattxJ12NQzpHMejD.2eb992f22f1a43e032d866df028dbb33958635234f6cfd30769e3e12f10d5588';
  var AT_BASE  = 'appVViGbmcu5gbn8B';
  var AT_H     = { 'Authorization': 'Bearer ' + AT_TOKEN, 'Content-Type': 'application/json' };
  var LAST_DRIVE_URL    = 'https://api.airtable.com/v0/' + AT_BASE + '/Last%20Drive';
  var POINTS_LEDGER_URL = 'https://api.airtable.com/v0/' + AT_BASE + '/PointsLedger';
  var PAGE_STATS_URL    = 'https://api.airtable.com/v0/' + AT_BASE + '/PageStats';

  var RATES = {
    'Article Read':       1,
    'Blotter Read':       2,
    'Editor/Trevor Read': 3,
    'Reply Posted':       5,
    'Affiliate Visit':    10
  };
  var COOLDOWN_MS = 4000; // minimum gap between any two scored point events per member

  function isoWeekKey(d) {
    var date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    var dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
    return date.getUTCFullYear() + '-W' + String(weekNo).padStart(2, '0');
  }

  function currentGamertag() {
    try { return (localStorage.getItem('56vl-gamertag') || '').trim(); }
    catch (e) { return ''; }
  }

  /* ── anonymous pageview -> PageStats — always runs, no identity needed ── */
  function trackPageview(slug) {
    if (!slug) return;
    var filter = encodeURIComponent('{Slug}="' + slug + '"');
    fetch(PAGE_STATS_URL + '?filterByFormula=' + filter + '&maxRecords=1', { headers: AT_H })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var rec = d.records && d.records[0];
        var weekKey = isoWeekKey(new Date());
        var priorViews     = rec ? (rec.fields.Views || 0) : 0;
        var priorWeekViews = rec ? (rec.fields.WeekViews || 0) : 0;
        var priorWeekKey   = rec ? (rec.fields.WeekKey || '') : '';
        var newWeekViews   = (priorWeekKey === weekKey) ? priorWeekViews + 1 : 1;
        var fields = {
          Slug: slug,
          Views: priorViews + 1,
          WeekViews: newWeekViews,
          WeekKey: weekKey,
          LastVisit: new Date().toISOString()
        };
        if (rec) {
          fetch(PAGE_STATS_URL + '/' + rec.id, { method: 'PATCH', headers: AT_H, body: JSON.stringify({ fields: fields }) }).catch(function () {});
        } else {
          fetch(PAGE_STATS_URL, { method: 'POST', headers: AT_H, body: JSON.stringify({ fields: fields }) }).catch(function () {});
        }
      })
      .catch(function () {});
  }

  /* ── scored member action -> PointsLedger + Last Drive rollup ── */
  function trackAction(action, ref) {
    var gamertag = currentGamertag();
    var points = RATES[action];
    if (!gamertag || !points) return;

    var filter = encodeURIComponent('LOWER({Gamertag})="' + gamertag.toLowerCase() + '"');
    fetch(LAST_DRIVE_URL + '?filterByFormula=' + filter + '&maxRecords=1', { headers: AT_H })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var rec = d.records && d.records[0];
        if (!rec) return;
        var fields = rec.fields;

        var lastAt = fields.LastPointAt ? new Date(fields.LastPointAt).getTime() : 0;
        if (Date.now() - lastAt < COOLDOWN_MS) return; // cooldown — block rapid-fire abuse

        var weekKey = isoWeekKey(new Date());
        var priorPoints     = fields.Points || 0;
        var priorWeekPoints = fields.WeekPoints || 0;
        var priorWeekKey    = fields.PointsWeekKey || '';
        var newWeekPoints   = (priorWeekKey === weekKey) ? priorWeekPoints + points : points;

        fetch(POINTS_LEDGER_URL, {
          method: 'POST', headers: AT_H,
          body: JSON.stringify({ fields: {
            Gamertag: gamertag, Action: action, Points: points,
            Ref: ref || '', WeekKey: weekKey, Processed: false
          } })
        }).catch(function () {});

        fetch(LAST_DRIVE_URL + '/' + rec.id, {
          method: 'PATCH', headers: AT_H,
          body: JSON.stringify({ fields: {
            Points: priorPoints + points,
            WeekPoints: newWeekPoints,
            PointsWeekKey: weekKey,
            LastPointAt: new Date().toISOString()
          } })
        }).catch(function () {});
      })
      .catch(function () {});
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
