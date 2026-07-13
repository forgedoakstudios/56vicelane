/* ============================================================
   56ViceLane — sitemap.xml generator
   Run by the Auto-Update workflow after build-articles.js, so
   every article push refreshes the sitemap Google crawls via
   Search Console. Never hand-edit sitemap.xml (REBUILD-PLAN rule).
   Article lastmod comes from the real per-article date in
   articles.json; core pages use the build date.
   ============================================================ */
const fs = require('fs');

const SITE = 'https://56vicelane.com';
const OUTPUT = './sitemap.xml';
const today = new Date().toISOString().split('T')[0];

// Core pages: [path, changefreq, priority]
const CORE = [
  ['/', 'daily', '1.0'],
  ['/news', 'daily', '0.9'],
  ['/lastdrive', 'weekly', '0.9'],
  ['/wall', 'daily', '0.9'],
  ['/members', 'daily', '0.8'],
  ['/store', 'weekly', '0.8'],
  ['/gear', 'weekly', '0.7'],
  ['/forum', 'weekly', '0.6'],
  ['/gta6.html', 'weekly', '0.8'],
  ['/tools', 'monthly', '0.5'],
  ['/tools/weekly-bonuses', 'weekly', '0.6'],
  ['/about', 'monthly', '0.4'],
  ['/contact', 'monthly', '0.4'],
  ['/archive', 'weekly', '0.5'],
  ['/privacy', 'yearly', '0.2'],
  ['/terms', 'yearly', '0.2']
];

const articles = JSON.parse(fs.readFileSync('./articles.json', 'utf8'));

function urlEntry(loc, lastmod, changefreq, priority) {
  return '  <url>\n' +
    '    <loc>' + loc + '</loc>\n' +
    '    <lastmod>' + lastmod + '</lastmod>\n' +
    '    <changefreq>' + changefreq + '</changefreq>\n' +
    '    <priority>' + priority + '</priority>\n' +
    '  </url>';
}

const entries = [];
CORE.forEach(function (p) {
  entries.push(urlEntry(SITE + p[0], today, p[1], p[2]));
});
articles.forEach(function (a) {
  if (!a.slug) return;
  entries.push(urlEntry(SITE + '/articles/' + a.slug, a.date || today, 'monthly', '0.7'));
});

const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  entries.join('\n') + '\n' +
  '</urlset>\n';

fs.writeFileSync(OUTPUT, xml);
console.log('✅ sitemap.xml rebuilt — ' + CORE.length + ' core pages + ' + articles.length + ' articles');
