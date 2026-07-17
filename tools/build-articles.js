const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = './articles';
const OUTPUT_FILE = './articles.json';

// Load existing articles.json to preserve permanent entries
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
} catch (e) {
  console.log('No existing articles.json — starting fresh');
}

// Keep permanent articles (like GTACON tracker, Last Drive event page)
const permanent = existing.filter(a => a.permanent === true);

// Meta/OG content is raw HTML attribute text — decode entities so a title
// that needed &quot; to hold a literal quote mark doesn't show up on-site
// as literal "&quot;" text.
function decodeEntities(str) {
  return String(str)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

// Dates already in articles.json, by slug — trusted over file mtime so a
// CI rebuild never re-stamps existing articles (in a fresh checkout every
// file's mtime is the checkout time, which used to overwrite every date
// with the run date on every workflow run)
const existingDates = new Map(
  existing.filter(a => a.slug && a.date).map(a => [a.slug, a.date])
);

// Parse a visible byline date like "June 4, 2026" to ISO
const MONTHS = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};
function parseLongDate(s) {
  const m = /^([A-Z][a-z]+) (\d{1,2}), (\d{4})$/.exec(String(s).trim());
  if (!m || !MONTHS[m[1]]) return '';
  return m[3] + '-' + String(MONTHS[m[1]]).padStart(2, '0') + '-' + String(m[2]).padStart(2, '0');
}

// Read all HTML files from /articles folder
const files = fs.readdirSync(ARTICLES_DIR)
  .filter(f => f.endsWith('.html'))
  .map(f => {
    const filePath = path.join(ARTICLES_DIR, f);
    const content = fs.readFileSync(filePath, 'utf8');
    const stat = fs.statSync(filePath);

    // Pull metadata from HTML meta tags. The content capture stops at
    // whichever quote character opened it (via backreference) rather than
    // at "either quote", so an apostrophe inside double-quoted content
    // (e.g. content="Here's the story") doesn't truncate the match.
    const getMeta = (name) => {
      const match = content.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=(["'])([\\s\\S]*?)\\1`, 'i'))
        || content.match(new RegExp(`<meta\\s+content=(["'])([\\s\\S]*?)\\1\\s+name=["']${name}["']`, 'i'));
      return match ? match[2] : '';
    };

    // Pull OG tags as fallback
    const getOG = (prop) => {
      const match = content.match(new RegExp(`<meta\\s+property=["']og:${prop}["']\\s+content=(["'])([\\s\\S]*?)\\1`, 'i'))
        || content.match(new RegExp(`<meta\\s+content=(["'])([\\s\\S]*?)\\1\\s+property=["']og:${prop}["']`, 'i'));
      return match ? match[2] : '';
    };

    // Pull title from <title> tag
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].replace(' | 56ViceLane', '').trim() : '';

    // Pull H1 as headline fallback
    const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : '';

    // Get slug from filename
    const slug = f.replace('.html', '');

    // Get date: meta tag > visible byline > date already in articles.json
    // > file modified time (last resort only — meaningless in CI checkouts)
    const metaDate = getMeta('date') || getMeta('article:published_time');
    const bylineMatch = content.match(/📅\s*([A-Z][a-z]+ \d{1,2}, \d{4})/)
      || content.match(/class="(?:article-)?meta"[^>]*>[\s\S]{0,200}?([A-Z][a-z]+ \d{1,2}, \d{4})/)
      || content.match(/class="byline"[^>]*>[\s\S]{0,300}?([A-Z][a-z]+ \d{1,2}, \d{4})/);
    const bylineDate = bylineMatch ? parseLongDate(bylineMatch[1]) : '';
    const fileDate = stat.mtime.toISOString().split('T')[0];
    const date = metaDate || bylineDate || existingDates.get(slug) || fileDate;

    // Get image from OG or meta
    const image = getOG('image') || getMeta('image') || 'gta6-hero.png';
    // Strip path — just keep filename
    const imageFile = image.split('/').pop();

    // Get category
    const category = getMeta('category') || getOG('section') || 'GTA6 News';

    // Get excerpt
    const excerpt = decodeEntities(getMeta('description') || getOG('description') || '');

    // Get emoji from meta or default
    const emoji = getMeta('emoji') || '🎮';

    // Get headline (subtitle)
    const headline = decodeEntities(getMeta('headline') || h1 || '');

    const title = decodeEntities(getMeta('title') || getOG('title') || pageTitle);

    return {
      emoji,
      title,
      slug,
      url: '/articles/' + slug,
      headline,
      category,
      date,
      excerpt,
      image: imageFile,
      permanent: false
    };
  })
  // Filter out any that failed to get a title
  .filter(a => a.title && a.title.length > 0)
  // Sort newest first
  .sort((a, b) => new Date(b.date) - new Date(a.date));

// Permanent entries pass through untouched except a missing url
permanent.forEach(p => { if (!p.url && p.slug) p.url = '/articles/' + p.slug; });

// Merge: permanent entries first, then auto-built articles
// Avoid duplicates by slug
const permanentSlugs = new Set(permanent.map(p => p.slug));
const filtered = files.filter(f => !permanentSlugs.has(f.slug));

const final = [...permanent, ...filtered];

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(final, null, 2));
console.log(`✅ articles.json rebuilt — ${final.length} articles (${permanent.length} permanent + ${filtered.length} auto)`);
