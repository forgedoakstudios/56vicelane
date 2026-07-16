const https = require('https');
const fs = require('fs');
const path = require('path');

/* Free, official RSS feeds from major gaming outlets, no API key. Each
   feed carries everything that outlet publishes; we filter locally for
   GTA mentions. This gives real, direct, pre-accredited publisher links
   for free — unlike scraping Google/Bing News search, whose links are
   wrapped redirects and whose search endpoints are easy to get blocked
   on since they aren't meant to be consumed this way. */
var FEEDS = [
  { name: 'IGN', url: 'https://www.ign.com/rss/articles/feed' },
  { name: 'GameSpot', url: 'https://www.gamespot.com/feeds/mashup/' },
  { name: 'Eurogamer', url: 'https://www.eurogamer.net/feed' },
  { name: 'PC Gamer', url: 'https://www.pcgamer.com/rss/' },
  { name: 'Polygon', url: 'https://www.polygon.com/rss/index.xml' },
  { name: 'VG247', url: 'https://www.vg247.com/feed' },
  { name: 'Rock Paper Shotgun', url: 'https://www.rockpapershotgun.com/feed' },
  { name: 'GamesRadar', url: 'https://www.gamesradar.com/rss/' },
  { name: 'Dexerto', url: 'https://www.dexerto.com/feed/' },
  { name: 'Insider Gaming', url: 'https://insider-gaming.com/feed/' },
  { name: 'The Gamer', url: 'https://www.thegamer.com/feed/' },
];

/* Checked in this order — GTA Online must come before GTA 5/V, since
   "GTA V Online" would otherwise false-match the GTA 5 pattern first. */
var TOPICS = [
  { id: 'gta6', label: 'GTA 6', re: /\bgta\s?vi\b|grand theft auto vi|\bgta\s?6\b|grand theft auto 6/i },
  { id: 'gtaonline', label: 'GTA Online', re: /gta online|gta v online/i },
  { id: 'gta5', label: 'GTA 5 / GTA V', re: /\bgta\s?v\b|grand theft auto v\b|\bgta\s?5\b|grand theft auto 5/i },
];

var TOP_N = 3;
var RETENTION_DAYS = 14;
var MAX_AGE_HOURS = 48;

/* A handful of feed hosts (feedburner etc.) still wrap their links —
   only these get a network round trip to reach the real publisher URL.
   Everything else from FEEDS above is already a direct link. */
var REDIRECT_WRAPPER_HOSTS = ['feedproxy.google.com', 'feeds.feedburner.com'];

/* Rough, transparent heuristic since there's no LLM in this pipeline —
   not editorial judgment, just keyword-based triage to surface the
   most likely-important items out of everything found each scan. */
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

async function resolveArticleLink (rawUrl) {
  var hostname = '';
  try { hostname = new URL(rawUrl).hostname; } catch (err) { /* leave blank, treat as non-wrapper below */ }
  if (!hostname || !isWrapperHost(hostname)) return rawUrl;

  try {
    var result = await fetchUrl(rawUrl);
    var finalHost = '';
    try { finalHost = new URL(result.finalUrl).hostname; } catch (err) { /* keep original on failure */ }
    if (finalHost && !isWrapperHost(finalHost)) return result.finalUrl;
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

function parseItems (xml) {
  var items = [];
  var blocks = xml.split('<item>').slice(1);
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i].split('</item>')[0];
    var title = extractTag(block, 'title');
    var link = extractTag(block, 'link');
    var pubDate = extractTag(block, 'pubDate');
    var description = extractTag(block, 'description');
    if (title && link) {
      items.push({
        title: decodeXml(title),
        link: link.trim(),
        pubDate: pubDate,
        description: decodeXml(description).replace(/<[^>]+>/g, ''),
      });
    }
  }
  return items;
}

function matchTopic (item) {
  var haystack = item.title + ' ' + item.description;
  for (var i = 0; i < TOPICS.length; i++) {
    if (TOPICS[i].re.test(haystack)) return TOPICS[i];
  }
  return null;
}

function isRecent (pubDate) {
  if (!pubDate) return true;
  var parsed = Date.parse(pubDate);
  if (isNaN(parsed)) return true;
  return (Date.now() - parsed) <= MAX_AGE_HOURS * 60 * 60 * 1000;
}

function scoreItem (item) {
  var score = 3; // baseline: every source here is already a trusted major outlet
  var titleLower = ' ' + item.title.toLowerCase() + ' ';

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

  for (var i = 0; i < FEEDS.length; i++) {
    var feed = FEEDS[i];
    var items = [];
    try {
      var result = await fetchUrl(feed.url);
      items = parseItems(result.body);
    } catch (err) {
      console.error('Fetch failed for ' + feed.name + ':', err.message);
      continue;
    }

    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      if (!isRecent(item.pubDate)) continue;
      if (seenSet.has(item.link)) continue;
      var topic = matchTopic(item);
      if (!topic) continue;

      seenSet.add(item.link);
      item.topic = topic.label;
      item.source = feed.name;
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
      lines.push('- **Source:** ' + it.source);
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
