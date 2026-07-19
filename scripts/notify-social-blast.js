const fs = require('fs');
const path = require('path');
const https = require('https');

/* Notifies the n8n "Article → Social Blast" workflow that an article just
   published, so it fans the article out to X and Instagram via Blotato.
   Called from publish-articles.yml right after a draft goes live.

   The webhook URL comes from the N8N_ARTICLE_WEBHOOK_URL secret — the repo
   is public, so the URL can't live in this file or anyone could trigger
   posts to our social accounts. Missing secret = skip quietly, never fail
   the publish run over a social notification. */

const SITE_URL = 'https://56vicelane.com';

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

function buildPayload (filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const slug = path.basename(filePath, '.html');

  const ogTitle = getTag(content, 'property', 'og:title') || getTag(content, 'name', 'title');
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].replace(/\s*\|\s*56ViceLane\s*$/, '').trim() : '';
  const title = decodeEntities(ogTitle || pageTitle);

  const excerpt = decodeEntities(getTag(content, 'property', 'og:description') || getTag(content, 'name', 'description'));

  const ogImage = getTag(content, 'property', 'og:image') || getTag(content, 'name', 'image');
  const imageFile = ogImage ? ogImage.split('/').pop() : 'gta6-hero.png';

  return {
    title: title,
    url: SITE_URL + '/articles/' + slug,
    excerpt: excerpt,
    image: SITE_URL + '/images/' + imageFile,
  };
}

function run () {
  const webhookUrl = process.env.N8N_ARTICLE_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('N8N_ARTICLE_WEBHOOK_URL not set — skipping social blast notification.');
    return;
  }

  const filePath = process.argv[2];
  if (!filePath || !fs.existsSync(filePath)) {
    console.error('Article file not found: ' + filePath);
    return;
  }

  const payload = JSON.stringify(buildPayload(filePath));
  const url = new URL(webhookUrl);

  const req = https.request({
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
    timeout: 15000,
  }, (res) => {
    console.log('Social blast webhook responded: ' + res.statusCode);
    res.resume();
  });

  req.on('error', (err) => {
    console.error('Social blast notification failed (publish continues): ' + err.message);
  });
  req.on('timeout', () => {
    console.error('Social blast notification timed out (publish continues).');
    req.destroy();
  });

  req.write(payload);
  req.end();
}

run();
