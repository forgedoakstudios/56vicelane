const fs = require('fs');
const path = require('path');
const https = require('https');

/* Calls the n8n "Generate Article Images" workflow right after a draft
   goes live, gets back 3-5 original Gemini-generated images (1 hero +
   2-4 inline, per design-system-addendum.md's master prompt formula),
   writes them into /images/, and wires them into the article: hero
   image tag + og:image/twitter:image meta, plus inline images dropped
   after body subheadings.

   The webhook URL comes from the N8N_IMAGE_WEBHOOK_URL secret, same
   pattern as notify-social-blast.js. Missing secret, webhook failure,
   or any parsing hiccup = skip quietly and leave the article exactly
   as the draft author wrote it. Never fail the publish run over
   image generation. */

const SITE_URL = 'https://56vicelane.com';
const IMAGES_DIR = path.join(__dirname, '..', 'images');

function getTag (content, attr, name) {
  const re = new RegExp(`<meta\\s+${attr}=["']${name}["']\\s+content=(["'])([\\s\\S]*?)\\1`, 'i');
  const reReversed = new RegExp(`<meta\\s+content=(["'])([\\s\\S]*?)\\1\\s+${attr}=["']${name}["']`, 'i');
  const match = content.match(re) || content.match(reReversed);
  return match ? match[2] : '';
}

function decodeEntities (str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function buildPayload (filePath, content) {
  const slug = path.basename(filePath, '.html');
  const ogTitle = getTag(content, 'property', 'og:title') || getTag(content, 'name', 'title');
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].replace(/\s*\|\s*56ViceLane\s*$/, '').trim() : '';
  const title = decodeEntities(ogTitle || pageTitle);
  const excerpt = decodeEntities(getTag(content, 'property', 'og:description') || getTag(content, 'name', 'description'));
  const category = decodeEntities(getTag(content, 'name', 'category')) || 'GTA6 News';

  return { title: title, slug: slug, excerpt: excerpt, category: category };
}

function postJson (webhookUrl, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const url = new URL(webhookUrl);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 120000, // image generation is slow — give it real headroom
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error('Webhook responded ' + res.statusCode + ': ' + data.slice(0, 500)));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error('Could not parse webhook response as JSON: ' + err.message));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(new Error('Webhook request timed out')); });
    req.write(body);
    req.end();
  });
}

function writeImages (images) {
  const written = [];
  for (const img of images) {
    if (!img || !img.fileName || !img.base64) continue;
    const safeName = path.basename(img.fileName); // no path traversal from webhook response
    const dest = path.join(IMAGES_DIR, safeName);
    fs.writeFileSync(dest, Buffer.from(img.base64, 'base64'));
    written.push({ slot: img.slot, fileName: safeName, altText: img.altText || '' });
  }
  return written;
}

function setHeroImage (content, fileName, altText) {
  const publicPath = '/images/' + fileName;
  const heroStyle = 'width:100%;aspect-ratio:2.4/1;object-fit:cover;object-position:center;border-radius:8px;margin:20px 0 28px;display:block;';

  // Known hero hooks used across existing templates — update src/alt in place if found.
  if (/id="article-hero"/.test(content)) {
    content = content.replace(/(<img[^>]*id="article-hero"[^>]*src=")[^"]*(")/i, `$1${publicPath}$2`);
    content = content.replace(/(<img[^>]*id="article-hero"[^>]*alt=")[^"]*(")/i, `$1${altText.replace(/"/g, '&quot;')}$2`);
    return { content, updated: true };
  }
  if (/class="article-hero-img"/.test(content)) {
    content = content.replace(/(<img[^>]*class="article-hero-img"[^>]*src=")[^"]*(")/i, `$1${publicPath}$2`);
    return { content, updated: true };
  }
  if (/class="article-hero"/.test(content)) {
    content = content.replace(/(<img[^>]*class="article-hero"[^>]*src=")[^"]*(")/i, `$1${publicPath}$2`);
    return { content, updated: true };
  }

  // No known hero slot — insert a fresh one right after the first <h1>.
  const h1Match = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/i);
  if (!h1Match) return { content, updated: false };
  const heroTag = `\n\n  <img src="${publicPath}" alt="${altText.replace(/"/g, '&quot;')}" style="${heroStyle}">\n`;
  content = content.replace(h1Match[0], h1Match[0] + heroTag);
  return { content, updated: true };
}

function setMetaImages (content, fileName) {
  const publicUrl = SITE_URL + '/images/' + fileName;
  content = content.replace(
    /(<meta\s+property=["']og:image["']\s+content=)(["'])[\s\S]*?\2/i,
    `$1"${publicUrl}"`
  );
  content = content.replace(
    /(<meta\s+name=["']twitter:image["']\s+content=)(["'])[\s\S]*?\2/i,
    `$1"${publicUrl}"`
  );
  return content;
}

function insertInlineImages (content, inlineImages) {
  if (inlineImages.length === 0) return content;
  const inlineStyle = 'width:100%;border-radius:8px;margin:24px 0;display:block;';

  const h2Matches = [...content.matchAll(/<\/h2>/gi)];
  let queue = inlineImages.slice();

  // Spread inline images after every other </h2> close tag, in document order,
  // adjusting offsets as each insertion shifts subsequent match positions.
  let offset = 0;
  for (let i = 1; i < h2Matches.length && queue.length > 0; i += 2) {
    const img = queue.shift();
    const insertAt = h2Matches[i].index + h2Matches[i][0].length + offset;
    const tag = `\n  <img src="/images/${img.fileName}" alt="${(img.altText || '').replace(/"/g, '&quot;')}" style="${inlineStyle}">\n`;
    content = content.slice(0, insertAt) + tag + content.slice(insertAt);
    offset += tag.length;
  }

  // Leftover images (not enough subheadings to space them against) — append
  // just before the article body closes, using whatever marker exists.
  if (queue.length > 0) {
    const tags = queue.map((img) =>
      `\n  <img src="/images/${img.fileName}" alt="${(img.altText || '').replace(/"/g, '&quot;')}" style="${inlineStyle}">\n`
    ).join('');
    if (content.includes('<!-- end article-body -->')) {
      content = content.replace('<!-- end article-body -->', tags + '<!-- end article-body -->');
    } else if (/<\/article>/i.test(content)) {
      content = content.replace(/<\/article>/i, tags + '</article>');
    }
    // If neither marker exists, leave the leftovers unplaced rather than guessing wrong.
  }

  return content;
}

async function run () {
  const webhookUrl = process.env.N8N_IMAGE_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('N8N_IMAGE_WEBHOOK_URL not set — skipping article image generation.');
    return;
  }

  const filePath = process.argv[2];
  if (!filePath || !fs.existsSync(filePath)) {
    console.error('Article file not found: ' + filePath);
    return;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const payload = buildPayload(filePath, original);

  let response;
  try {
    response = await postJson(webhookUrl, payload);
  } catch (err) {
    console.error('Article image generation failed (publish continues): ' + err.message);
    return;
  }

  const images = Array.isArray(response.images) ? response.images : [];
  if (images.length === 0) {
    console.log('Image generation returned no images — leaving article as-is.');
    return;
  }

  const written = writeImages(images);
  const hero = written.find((img) => img.slot === 'hero');
  const inline = written.filter((img) => img.slot !== 'hero');

  let content = original;
  if (hero) {
    const heroResult = setHeroImage(content, hero.fileName, hero.altText);
    content = heroResult.content;
    content = setMetaImages(content, hero.fileName);
  }
  content = insertInlineImages(content, inline);

  fs.writeFileSync(filePath, content);
  console.log('Wrote ' + written.length + ' image(s) and updated ' + filePath);
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Article image generation crashed (publish continues): ' + err.message);
  });
}

module.exports = { buildPayload, setHeroImage, setMetaImages, insertInlineImages };
