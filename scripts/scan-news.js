const https = require('https');
const fs = require('fs');
const path = require('path');

/* Free Bing News RSS search, no API key. Each query covers one of the
   three topics you asked to track. Bing (unlike Google News RSS) gives
   direct publisher links instead of an obfuscated redirect token, which
   is what makes real backlinks/accreditation possible here. */
var QUERIES = [
  { id: 'gta6', label: 'GTA 6', q: '("GTA 6" OR "GTA VI" OR "Grand Theft Auto 6" OR "Grand Theft Auto VI")' },
  { id: 'gta5', label: 'GTA 5 / GTA V', q: '("GTA 5" OR "GTA V" OR "Grand Theft Auto V") -"GTA VI"' },
  { id: 'gtaonline', label: 'GTA Online', q: '("GTA Online" OR "GTA V Online")' },
];

var TOP_N = 3;
var RETENTION_DAYS = 14;
var MAX_AGE_HOURS = 30;
var REDIRECT_WRAPPER_HOSTS = ['news.google.com', 'bing.com', 'www.bing.com', 'msn.com', 'www.msn.com'];

/* Rough, transparent heuristic since there's no LLM in this pipeline —
   not editorial judgment, just keyword-based triage to surface the
   most likely-important items out of everything found each scan. */
var TRUSTED_SOURCES = [
  'ign', 'gamespot', 'eurogamer', 'polygon', 'pc gamer', 'kotaku', 'vg247',
  'rockstar', 'take-two', 'reuters', 'bloomberg', 'variety', 'the verge',
  'video games chronicle', 'push square', 'game developer', 'newzoo',
  'gamesradar', 'rock paper shotgun', 'the gamer', 'nme', 'insider gaming',
  'wccftech', 'dexerto', 'gameinformer', 'destructoid',
];

var HIGH_SIGNAL_WORDS = [
  'official', 'confirmed', 'confirms', 'announces', 'announcement', 'rockstar games',
  'take-two', 'release date', 'trailer', 'launch', 'pre-order', 'preorder', 'record',
  'exclusive', 'lawsuit', 'trial', 'sentenced', 'delay', 'delayed',
];

var SPECULATIVE_WORDS = [
  'could', 'might', ' may ', 'predicts', 'prediction', 'analyst', 'rumor', 'rumour',
  'reportedly', 'claims', 'speculat',
];

var scanDir = path.join(__dirname, '..', 'news-scan');
var seenPath = path.join(scanDir, 'seen-links.json');
var seen = fs.existsSync(seenPath) ? JSON.parse(fs.readFileSync(seenPath, 'utf8')) : [];
var seenSet = new Set(seen);

function fetchUrl (url, redirectsLeft) {
  if (redirectsLeft === undefined) redirectsLeft = 5;
  return new Promise(function (resolve, reject) {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 56ViceLaneNewsScan/1.0' } }, function (res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
        res.resume();
        var nextUrl = res.headers.location;
        if (nextUrl.indexOf('http') !== 0) nextUrl = new URL(nextUrl, url).toString();
        resolve(fetchUrl(nextUrl, redirectsLeft - 1));
        return;
      }
      var data = '';
      res.on('data', function (chunk) { data += chunk; });
      res.on('end', function () { resolve({ body: data, finalUrl: url, statusCode: res.statusCode }); });
    }).on('error', reject);
  });
}

function isWrapperHost (hostname) {
  return REDIRECT_WRAPPER_HOSTS.some(function (h) { return hostname === h || hostname.slice(-h.length - 1) === '.' + h; });
}

/* Bing gives direct links most of the time, so skip the network round
   trip when the host already looks like the real publisher. When it is
   a known aggregator/redirect host, follow it (and fall back to a
   <link rel="canonical"> in the response body) to reach the actual
   source. If neither works, keep the original link rather than
   shipping a broken one. */
async function resolveArticleLink (rawUrl) {
  var hostname = '';
  try { hostname = new URL(rawUrl).hostname; } catch (err) { /* leave blank, treat as non-wrapper below */ }
  if (!hostname || !isWrapperHost(hostname)) return rawUrl;

  try {
    var result = await fetchUrl(rawUrl);
    var finalHost = '';
    try { finalHost = new URL(result.finalUrl).hostname; } catch (err) { /* fall through to canonical check */ }
    if (finalHost && !isWrapperHost(finalHost)) return result.finalUrl;

    var m = result.body && result.body.match(/<link rel="canonical" href="([^"]+)"/);
    if (m) {
      var canonicalHost = '';
      try { canonicalHost = new URL(m[1]).hostname; } catch (err) { /* ignore, skip fallback */ }
      if (canonicalHost && !isWrapperHost(canonicalHost)) return m[1];
    }
  } catch (err) {
    console.error('Could not resolve link for ' + rawUrl + ':', err.message);
  }
  return rawUrl;
}

function extractTag (block, tag) {
  var m = block.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>'));
  if (!m) return '';
  return m[1].replace('<![CDATA[', '').replace(']]>', '').trim();
}

function decodeXml (str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractSource (block) {
  var candidates = ['News:Source', 'source', 'Source'];
  for (var i = 0; i < candidates.length; i++) {
    var val = extractTag(block, candidates[i]);
    if (val) return val;
  }
  return '';
}

function parseItems (xml) {
  var items = [];
  var blocks = xml.split('<item>').slice(1);
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i].split('</item>')[0];
    var title = extractTag(block, 'title');
    var link = extractTag(block, 'link');
    var pubDate = extractTag(block, 'pubDate');
    var source = extractSource(block);
    if (title && link) {
      items.push({ title: decodeXml(title), link: link.trim(), pubDate: pubDate, source: decodeXml(source) });
    }
  }
  return items;
}

function isRecent (pubDate) {
  if (!pubDate) return true;
  var parsed = Date.parse(pubDate);
  if (isNaN(parsed)) return true;
  return (Date.now() - parsed) <= MAX_AGE_HOURS * 60 * 60 * 1000;
}

function scoreItem (item) {
  var score = 0;
  var titleLower = ' ' + item.title.toLowerCase() + ' ';
  var sourceLower = (item.source || '').toLowerCase();

  if (TRUSTED_SOURCES.some(function (s) { return sourceLower.indexOf(s) !== -1; })) score += 3;
  HIGH_SIGNAL_WORDS.forEach(function (w) { if (titleLower.indexOf(w) !== -1) score += 2; });
  SPECULATIVE_WORDS.forEach(function (w) { if (titleLower.indexOf(w) !== -1) score -= 1; });
  if (/\$[\d,.]+\s?(million|billion|m|b)\b/i.test(item.title)) score += 2;

  return score;
}

function cleanupOldScans () {
  if (!fs.existsSync(scanDir)) return;
  var files = fs.readdirSync(scanDir).filter(function (f) { return f.endsWith('.md'); });
  var cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  files.forEach(function (f) {
    var m = f.match(/^(\d{4}-\d{2}-\d{2})-(\d{2})-(\d{2})\.md$/);
    if (!m) return;
    var fileTime = new Date(m[1] + 'T' + m[2] + ':' + m[3] + ':00Z').getTime();
    if (fileTime < cutoff) {
      fs.unlinkSync(path.join(scanDir, f));
      console.log('Deleted expired scan file (>' + RETENTION_DAYS + 'd old): ' + f);
    }
  });
}

async function run () {
  if (!fs.existsSync(scanDir)) fs.mkdirSync(scanDir, { recursive: true });

  cleanupOldScans();

  var candidates = [];

  for (var i = 0; i < QUERIES.length; i++) {
    var query = QUERIES[i];
    var url = 'https://www.bing.com/news/search?q=' + encodeURIComponent(query.q) + '&format=RSS';

    var items = [];
    try {
      var result = await fetchUrl(url);
      items = parseItems(result.body);
    } catch (err) {
      console.error('Fetch failed for ' + query.label + ':', err.message);
    }

    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      if (!isRecent(item.pubDate)) continue;
      if (seenSet.has(item.link)) continue;
      seenSet.add(item.link);
      item.topic = query.label;
      item.score = scoreItem(item);
      candidates.push(item);
    }
  }

  candidates.sort(function (a, b) { return b.score - a.score; });
  var top = candidates.slice(0, TOP_N);

  if (top.length > 0) {
    for (var k = 0; k < top.length; k++) {
      top[k].resolvedLink = await resolveArticleLink(top[k].link);
    }

    var now = new Date();
    var lines = [
      '# GTA News Scan — ' + now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
      '',
      'Top ' + top.length + ' by relevance score, out of ' + candidates.length + ' new item(s) seen this scan.',
      '',
    ];
    for (var n = 0; n < top.length; n++) {
      var it = top[n];
      lines.push('### ' + (n + 1) + '. ' + it.title);
      lines.push('- **Topic:** ' + it.topic);
      lines.push('- **Source:** ' + (it.source || 'Unknown'));
      lines.push('- **Published:** ' + (it.pubDate || 'Unknown'));
      lines.push('- **Relevance score:** ' + it.score);
      lines.push('- **Link:** ' + it.resolvedLink);
      lines.push('');
    }
    var stamp = now.toISOString().slice(0, 16).replace(/[:T]/g, '-');
    fs.writeFileSync(path.join(scanDir, stamp + '.md'), lines.join('\n') + '\n');
    console.log('Wrote top ' + top.length + ' of ' + candidates.length + ' new item(s) to news-scan/' + stamp + '.md');
  } else {
    console.log('No new items found this scan.');
  }

  fs.writeFileSync(seenPath, JSON.stringify(Array.from(seenSet), null, 2));
}

run().catch(function (err) {
  console.error(err);
  process.exit(1);
});
