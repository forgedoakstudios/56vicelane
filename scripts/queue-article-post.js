const fs = require('fs');
const path = require('path');

/* Reads one or more just-published article HTML files and appends a
   Bluesky queue entry for each, scheduled to post immediately (picked up
   on the next hourly post-to-bluesky.js run). Called from
   publish-articles.yml right after a draft is moved into articles/. */

const SITE_URL = 'https://56vicelane.com';
const queuePath = path.join(__dirname, '..', 'social-queue.json');

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

function buildQueueEntry (filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const slug = path.basename(filePath, '.html');

  const ogTitle = getTag(content, 'property', 'og:title') || getTag(content, 'name', 'title');
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].replace(/\s*\|\s*56ViceLane\s*$/, '').trim() : '';
  const title = decodeEntities(ogTitle || pageTitle);

  const description = decodeEntities(getTag(content, 'property', 'og:description') || getTag(content, 'name', 'description'));

  const ogImage = getTag(content, 'property', 'og:image') || getTag(content, 'name', 'image');
  const imageFile = ogImage ? ogImage.split('/').pop() : 'gta6-hero.png';

  const url = SITE_URL + '/articles/' + slug;

  let text = description || title;
  const maxTextLen = 260 - (url.length + 1);
  if (text.length > maxTextLen) text = text.slice(0, maxTextLen - 1).trim() + '…';
  text += ' ' + url;

  return {
    id: 'auto-publish-' + slug,
    text: text,
    url: url,
    image: 'images/' + imageFile,
    imageAlt: title,
    scheduledFor: new Date().toISOString(),
    posted: false,
  };
}

function run () {
  const filePaths = process.argv.slice(2);
  if (filePaths.length === 0) {
    console.log('No article paths given — nothing to queue.');
    return;
  }

  const queue = fs.existsSync(queuePath) ? JSON.parse(fs.readFileSync(queuePath, 'utf8')) : [];
  const existingIds = new Set(queue.map((q) => q.id));
  let added = 0;

  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) {
      console.error('Skipping missing file: ' + filePath);
      continue;
    }
    const entry = buildQueueEntry(filePath);
    if (existingIds.has(entry.id)) {
      console.log('Already queued, skipping: ' + entry.id);
      continue;
    }
    queue.push(entry);
    existingIds.add(entry.id);
    added++;
    console.log('Queued Bluesky post for ' + path.basename(filePath) + ': ' + entry.id);
  }

  if (added > 0) {
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
  }
}

run();
