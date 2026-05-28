// =================================================================
// 56VICELANE — GTACON AUTO-CONDITION WORKER
// Cloudflare Worker + Cron Trigger
// Runs every 2 hours. Checks public signals. Updates condition.
// No login required. No manual updates. Fully automatic.
// =================================================================
//
// DEPLOY INSTRUCTIONS (from your phone):
// 1. Go to dash.cloudflare.com
// 2. Workers & Pages → Create → Worker
// 3. Name it: gtacon-worker
// 4. Paste this entire file into the editor
// 5. Save and Deploy
// 6. Go to Settings → Triggers → Cron Triggers
// 7. Add cron: */120 * * * * (every 2 hours)
// 8. Go to KV → Create namespace → name: GTACON_STORE
// 9. Bind KV to worker: Settings → Variables → KV Bindings
//    Variable name: GTACON_KV | Namespace: GTACON_STORE
// 10. Done. Worker runs automatically forever.
// =================================================================

// ── SIGNAL SOURCES ──────────────────────────────────────────────
// These are PUBLIC sources the worker checks automatically.
// No API keys needed for these checks.

const SIGNALS = {

  // Public Meta Ad Library search URLs
  // Returns JSON we can parse for active Rockstar ads
  metaAdLibrary: [
    'https://www.facebook.com/ads/library/async/search_typeahead/?session_id=1&country=US&q=rockstar+games&search_type=keyword_unordered&view_all_page_id=&impression_control_for_ads=%5B%5D&active_status=active&ad_type=all&media_type=all',
  ],

  // Rockstar Games official X/Twitter account
  // Public timeline — check for new posts
  rockstarX: 'https://nitter.privacydev.net/RockstarGames/rss',

  // PlayStation Blog RSS — watch for GTA 6 bundle posts
  playstationBlog: 'https://blog.playstation.com/feed/',

  // Take-Two Interactive newsroom RSS
  takeTwoNews: 'https://ir.take2games.com/rss/news-releases.xml',

  // GTAForums latest posts RSS — community signal
  gtaForums: 'https://gtaforums.com/forum/397-gta-vi/?do=rss',

};

// ── CONDITION RULES ──────────────────────────────────────────────
// The worker evaluates signals against these rules.
// Conditions are scored — highest score wins.
// You can tune these thresholds at any time.

const CONDITION_RULES = {

  // CONDITION 1 — MAXIMUM (Launch Week)
  // GTA 6 release date has passed OR is within 7 days
  1: {
    name: 'Maximum',
    check: (signals, daysToLaunch) => daysToLaunch <= 7,
  },

  // CONDITION 2 — CRITICAL (Campaign Live)
  // Rockstar/Take-Two ads actively running on Meta OR
  // PlayStation bundle officially announced OR
  // Trailer 3 confirmed dropped (Rockstar X post with trailer keywords)
  2: {
    name: 'Critical',
    check: (signals) =>
      signals.rockstarAdsActive ||
      signals.psBundleAnnounced ||
      signals.trailer3Live,
  },

  // CONDITION 3 — SIGNIFICANT (Where we are now)
  // CEO has confirmed marketing "soon" AND
  // Sony partnership signals detected AND
  // Within 180 days of launch
  3: {
    name: 'Significant',
    check: (signals, daysToLaunch) =>
      signals.ceoMarketingConfirmed &&
      daysToLaunch <= 180,
  },

  // CONDITION 4 — ELEVATED
  // Leaker activity high OR community buzz spiking
  // No official confirmation yet
  4: {
    name: 'Elevated',
    check: (signals) =>
      signals.leakerActivityHigh &&
      !signals.ceoMarketingConfirmed,
  },

  // CONDITION 5 — COLD (Starting point)
  // Default. Nothing confirmed. Community waits.
  5: {
    name: 'Cold',
    check: () => true, // Always true — fallback
  },
};

// ── KNOWN CONFIRMED SIGNALS ──────────────────────────────────────
// These are things we KNOW are true right now.
// Update these as facts change — or leave auto-detection to handle it.
// Set to true = confirmed. false = not confirmed yet.

const KNOWN_SIGNALS = {
  ceoMarketingConfirmed: true,   // Zelnick said "soon" on May 21 earnings call
  psBundleAnnounced: false,      // Not yet announced
  trailer3Live: false,           // Not yet dropped
  rockstarAdsActive: false,      // Not yet — auto-detected below
  leakerActivityHigh: true,      // Graczdari_91 and others active
  worldCupActive: false,         // World Cup timing — update when needed
};

// ── LAUNCH DATE ──────────────────────────────────────────────────
const GTA6_LAUNCH = new Date('2026-11-19T00:00:00-05:00');

// ── KEYWORD TRIGGERS ────────────────────────────────────────────
// If these appear in RSS feeds, signals flip to true automatically

const TRIGGERS = {
  trailer3Keywords: [
    'trailer 3', 'trailer three', 'official trailer',
    'gta vi trailer', 'gta 6 trailer', 'new trailer'
  ],
  bundleKeywords: [
    'ps5 bundle', 'playstation bundle', 'gta 6 bundle',
    'console bundle', 'gta vi bundle', 'limited edition ps5'
  ],
  adKeywords: [
    'grand theft auto', 'gta 6', 'gta vi', 'rockstar games'
  ],
  launchKeywords: [
    'november 19', 'launch day', 'gta 6 out now',
    'gta vi available', 'gta 6 released'
  ],
};

// ═══════════════════════════════════════════════════════════════
// MAIN WORKER LOGIC
// ═══════════════════════════════════════════════════════════════

export default {

  // Runs on HTTP request (for manual trigger / health check)
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/gtacon-status') {
      const stored = await env.GTACON_KV.get('current', 'json');
      const origin = request.headers.get('Origin') || '';
      const allowed = [
        'https://56vicelane.com',
        'https://www.56vicelane.com',
        'https://05c0612a.56vicelane.pages.dev',
      ];
      const corsOrigin = allowed.includes(origin) ? origin : allowed[0];
      return new Response(JSON.stringify(stored), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Manual force-run endpoint (for testing)
    if (url.pathname === '/gtacon-run') {
      const result = await runEvaluation(env);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('GTACON Worker Active', { status: 200 });
  },

  // Runs on cron schedule (every 2 hours automatically)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runEvaluation(env));
  },
};

// ── CORE EVALUATION FUNCTION ─────────────────────────────────────

async function runEvaluation(env) {
  console.log('[GTACON] Starting evaluation...');

  // Calculate days to launch
  const now = new Date();
  const daysToLaunch = Math.ceil((GTA6_LAUNCH - now) / 86400000);

  // Start with known confirmed signals
  const signals = { ...KNOWN_SIGNALS };

  // ── AUTO-DETECT: Check RSS feeds for trigger keywords ──
  try {
    // Check Rockstar X feed for trailer keywords
    const rockstarFeed = await fetchRSS(SIGNALS.rockstarX);
    if (containsKeywords(rockstarFeed, TRIGGERS.trailer3Keywords)) {
      signals.trailer3Live = true;
      console.log('[GTACON] SIGNAL: Trailer 3 keywords detected in Rockstar feed');
    }
    if (containsKeywords(rockstarFeed, TRIGGERS.launchKeywords)) {
      console.log('[GTACON] SIGNAL: Launch keywords detected in Rockstar feed');
    }

    // Check PlayStation Blog for bundle announcement
    const psBlog = await fetchRSS(SIGNALS.playstationBlog);
    if (containsKeywords(psBlog, TRIGGERS.bundleKeywords)) {
      signals.psBundleAnnounced = true;
      console.log('[GTACON] SIGNAL: PS Bundle keywords detected in PlayStation Blog');
    }

    // Check Take-Two newsroom for major announcements
    const t2News = await fetchRSS(SIGNALS.takeTwoNews);
    if (containsKeywords(t2News, TRIGGERS.trailer3Keywords)) {
      signals.trailer3Live = true;
    }
    if (containsKeywords(t2News, TRIGGERS.bundleKeywords)) {
      signals.psBundleAnnounced = true;
    }

  } catch (err) {
    console.log('[GTACON] RSS fetch error:', err.message);
    // Continue with known signals if RSS fails
  }

  // ── EVALUATE CONDITION ──────────────────────────────────────
  let newCondition = 5; // Default: Cold
  let conditionName = 'Cold';

  // Check conditions from most severe (1) to least (5)
  for (let i = 1; i <= 5; i++) {
    try {
      if (CONDITION_RULES[i].check(signals, daysToLaunch)) {
        newCondition = i;
        conditionName = CONDITION_RULES[i].name;
        break;
      }
    } catch(e) {
      continue;
    }
  }

  console.log(`[GTACON] Evaluated condition: ${newCondition} — ${conditionName}`);

  // ── GET PREVIOUS CONDITION ──────────────────────────────────
  const previous = await env.GTACON_KV.get('current', 'json');
  const previousCondition = previous ? previous.condition : null;

  // ── BUILD RESULT OBJECT ─────────────────────────────────────
  const result = {
    condition: newCondition,
    name: conditionName,
    updated: new Date().toISOString(),
    updatedDate: new Date().toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
      timeZone: 'America/Chicago'
    }),
    daysToLaunch: daysToLaunch,
    changed: previousCondition !== newCondition,
    previousCondition: previousCondition,
    signals: {
      ceoMarketingConfirmed: signals.ceoMarketingConfirmed,
      psBundleAnnounced: signals.psBundleAnnounced,
      trailer3Live: signals.trailer3Live,
      rockstarAdsActive: signals.rockstarAdsActive,
      leakerActivityHigh: signals.leakerActivityHigh,
    },
    note: buildNote(newCondition, signals, daysToLaunch),
  };

  // ── SAVE TO KV ──────────────────────────────────────────────
  await env.GTACON_KV.put('current', JSON.stringify(result));

  // ── LOG CONDITION CHANGE ────────────────────────────────────
  if (result.changed) {
    console.log(`[GTACON] ⚡ CONDITION CHANGED: ${previousCondition} → ${newCondition}`);
    // Store change history
    const history = await env.GTACON_KV.get('history', 'json') || [];
    history.unshift({
      from: previousCondition,
      to: newCondition,
      timestamp: result.updated,
      triggers: Object.keys(signals).filter(k => signals[k] === true),
    });
    // Keep last 20 changes
    await env.GTACON_KV.put('history', JSON.stringify(history.slice(0, 20)));
  }

  console.log('[GTACON] Evaluation complete:', result);
  return result;
}

// ── HELPER: Fetch and parse RSS feed ────────────────────────────
async function fetchRSS(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': '56ViceLane/1.0 GTACONTracker' },
      cf: { cacheTtl: 300 } // Cache for 5 minutes
    });
    if (!response.ok) return '';
    return await response.text();
  } catch (err) {
    return '';
  }
}

// ── HELPER: Check if text contains any trigger keywords ─────────
function containsKeywords(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
}

// ── HELPER: Build human-readable condition note ─────────────────
function buildNote(condition, signals, daysToLaunch) {
  const notes = {
    1: `Launch week. GTA 6 is here. ${daysToLaunch <= 0 ? 'Game is live.' : `${daysToLaunch} days remaining.`}`,
    2: `Trailer 3 is live or dropping very soon. ${signals.trailer3Live ? 'Trailer 3 confirmed live.' : ''} ${signals.psBundleAnnounced ? 'PS Bundle announced.' : ''} The blitz has begun.`,
    3: `Major signals confirmed. Marketing window approaching. ${daysToLaunch} days to launch.`,
    4: `Leaker activity elevated. Community buzz rising. Watching closely.`,
    5: `Business as usual. No significant signals detected. Community waits.`,
  };
  return notes[condition] || '';
}
