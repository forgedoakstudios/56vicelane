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

// Read all HTML files from /articles folder
const files = fs.readdirSync(ARTICLES_DIR)
  .filter(f => f.endsWith('.html'))
  .map(f => {
    const filePath = path.join(ARTICLES_DIR, f);
    const content = fs.readFileSync(filePath, 'utf8');
    const stat = fs.statSync(filePath);

    // Pull metadata from HTML meta tags
    const getMeta = (name) => {
      const match = content.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, 'i'))
        || content.match(new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+name=["']${name}["']`, 'i'));
      return match ? match[1] : '';
    };

    // Pull OG tags as fallback
    const getOG = (prop) => {
      const match = content.match(new RegExp(`<meta\\s+property=["']og:${prop}["']\\s+content=["']([^"']+)["']`, 'i'))
        || content.match(new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']og:${prop}["']`, 'i'));
      return match ? match[1] : '';
    };

    // Pull title from <title> tag
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].replace(' | 56ViceLane', '').trim() : '';

    // Pull H1 as headline fallback
    const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const h1 = h1Match ? h1Match[1].trim() : '';

    // Get slug from filename
    const slug = f.replace('.html', '');

    // Get date from meta or file modified date
    const metaDate = getMeta('date') || getMeta('article:published_time');
    const fileDate = stat.mtime.toISOString().split('T')[0];
    const date = metaDate || fileDate;

    // Get image from OG or meta
    const image = getOG('image') || getMeta('image') || 'gta6-hero.png';
    // Strip path — just keep filename
    const imageFile = image.split('/').pop();

    // Get category
    const category = getMeta('category') || getOG('section') || 'GTA6 News';

    // Get excerpt
    const excerpt = getMeta('description') || getOG('description') || '';

    // Get emoji from meta or default
    const emoji = getMeta('emoji') || '🎮';

    // Get headline (subtitle)
    const headline = getMeta('headline') || h1 || '';

    const title = getMeta('title') || getOG('title') || pageTitle;

    return {
      emoji,
      title,
      slug,
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

// Merge: permanent entries first, then auto-built articles
// Avoid duplicates by slug
const permanentSlugs = new Set(permanent.map(p => p.slug));
const filtered = files.filter(f => !permanentSlugs.has(f.slug));

const final = [...permanent, ...filtered];

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(final, null, 2));
console.log(`✅ articles.json rebuilt — ${final.length} articles (${permanent.length} permanent + ${filtered.length} auto)`);
