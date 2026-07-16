const https = require('https');
const fs = require('fs');
const path = require('path');

/* Free Google News RSS search, no API key. Each query covers one of the
   three topics you asked to track. */
var QUERIES = [
  { id: 'gta6', label: 'GTA 6', q: '("GTA 6" OR "GTA VI" OR "Grand Theft Auto 6" OR "Grand Theft Auto VI")' },
  { id: 'gta5', label: 'GTA 5 / GTA V', q: '("GTA 5" OR "GTA V" OR "Grand Theft Auto V") -"GTA VI"' },
  { id: 'gtaonline', label: 'GTA Online', q: '("GTA Online" OR "GTA V Online")' },
];

var scanDir = path.join(__dirname, '..', 'news-scan');
var seenPath = path.join(scanDir, 'seen-links.json');
var seen = fs.existsSync(seenPath) ? JSON.parse(fs.readFileSync(seenPath, 'utf8')) : [];
var seenSet = new Set(seen);

function fetchRss (url, redirectsLeft) {
  if (redirectsLeft === undefined) redirectsLeft = 5;
  return new Promise(function (resolve, reject) {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 56ViceLaneNewsScan/1.0' } }, function (res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
        res.resume();
        return resolve(fetchRss(res.headers.location, redirectsLeft - 1));
      }
      var data = '';
      res.on('data', function (chunk) { data += chunk; });
      res.on('end', function () { resolve(data); });
    }).on('error', reject);
  });
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
    var source = extractTag(block, 'source');
    if (title && link) {
      items.push({ title: decodeXml(title), link: link.trim(), pubDate: pubDate, source: decodeXml(source) });
    }
  }
  return items;
}

async function run () {
  if (!fs.existsSync(scanDir)) fs.mkdirSync(scanDir, { recursive: true });

  var groups = [];
  var totalNew = 0;

  for (var i = 0; i < QUERIES.length; i++) {
    var query = QUERIES[i];
    var url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(query.q + ' when:1d') +
      '&hl=en-US&gl=US&ceid=US:en';

    var items = [];
    try {
      var xml = await fetchRss(url);
      items = parseItems(xml);
    } catch (err) {
      console.error('Fetch failed for ' + query.label + ':', err.message);
    }

    var fresh = [];
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      if (seenSet.has(item.link)) continue;
      seenSet.add(item.link);
      fresh.push(item);
    }
    if (fresh.length > 0) {
      groups.push({ label: query.label, items: fresh });
      totalNew += fresh.length;
    }
  }

  var now = new Date();
  if (totalNew > 0) {
    var lines = ['# GTA News Scan — ' + now.toISOString().slice(0, 16).replace('T', ' ') + ' UTC', ''];
    for (var g = 0; g < groups.length; g++) {
      lines.push('## ' + groups[g].label, '');
      for (var k = 0; k < groups[g].items.length; k++) {
        var it = groups[g].items[k];
        lines.push('- [' + it.title + '](' + it.link + ')' +
          (it.source ? ' — ' + it.source : '') + (it.pubDate ? ' — ' + it.pubDate : ''));
      }
      lines.push('');
    }
    var stamp = now.toISOString().slice(0, 16).replace(/[:T]/g, '-');
    fs.writeFileSync(path.join(scanDir, stamp + '.md'), lines.join('\n') + '\n');
    console.log('Wrote ' + totalNew + ' new item(s) to news-scan/' + stamp + '.md');
  } else {
    console.log('No new items found this scan.');
  }

  fs.writeFileSync(seenPath, JSON.stringify(Array.from(seenSet), null, 2));
}

run().catch(function (err) {
  console.error(err);
  process.exit(1);
});
