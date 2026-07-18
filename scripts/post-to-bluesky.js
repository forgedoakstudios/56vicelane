const { BskyAgent } = require('@atproto/api');
const fs = require('fs');
const path = require('path');

const queuePath = path.join(__dirname, '..', 'social-queue.json');
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

var MIME_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

/* Bluesky rejects any blob over 2,000,000 bytes outright. Stay under that
   with margin so we don't even attempt an upload that's guaranteed to fail. */
var MAX_IMAGE_BYTES = 1900000;

async function uploadImageEmbed (agent, imagePath, alt) {
  var fullPath = path.join(__dirname, '..', imagePath);
  var imageBytes = fs.readFileSync(fullPath);
  if (imageBytes.length > MAX_IMAGE_BYTES) {
    throw new Error(imagePath + ' is ' + imageBytes.length + ' bytes, over the ' + MAX_IMAGE_BYTES + ' byte cap');
  }
  var mimeType = MIME_TYPES[path.extname(imagePath).toLowerCase()] || 'image/jpeg';
  var uploaded = await agent.uploadBlob(imageBytes, { encoding: mimeType });
  return { $type: 'app.bsky.embed.images', images: [{ image: uploaded.data.blob, alt: alt || '' }] };
}

/* Posts text with an optional image. If the image is oversized, missing,
   or the upload/post fails for any reason, falls back to a text-only post
   rather than leaving the whole item stuck unposted forever. Returns true
   if a post went out (with or without the image), false only if both the
   image attempt and the plain-text retry failed. */
async function postWithFallback (agent, id, text, imagePath, imageAlt) {
  if (imagePath) {
    try {
      var embed = await uploadImageEmbed(agent, imagePath, imageAlt);
      await agent.post({ text: text, createdAt: new Date().toISOString(), embed: embed });
      return true;
    } catch (err) {
      console.error('Image attempt failed for ' + id + ', retrying without image:', err.message || err);
    }
  }
  try {
    await agent.post({ text: text, createdAt: new Date().toISOString() });
    return true;
  } catch (err) {
    console.error('Failed to post ' + id + ':', err);
    return false;
  }
}

function daysUntil (dateStr, now) {
  var target = new Date(dateStr + 'T00:00:00Z');
  var today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Math.round((target - today) / 86400000);
}

/* Builds "🚗 125 days until The Last Drive · 🎮 126 days until GTA6" from
   post.countdowns. Skips any target date that has already passed; returns
   '' once every target date is behind us, so the post goes dormant. */
function buildCountdownText (post, now) {
  var parts = [];
  for (var i = 0; i < post.countdowns.length; i++) {
    var c = post.countdowns[i];
    var days = daysUntil(c.date, now);
    var prefix = c.emoji ? c.emoji + ' ' : '';
    if (days > 0) {
      parts.push(prefix + days + ' day' + (days === 1 ? '' : 's') + ' until ' + c.label);
    } else if (days === 0) {
      parts.push(prefix + c.label + ' is TODAY');
    }
  }
  return parts.join(' · ');
}

async function run () {
  const agent = new BskyAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: process.env.BLUESKY_HANDLE,
    password: process.env.BLUESKY_APP_PASSWORD,
  });

  const now = new Date();
  var updated = false;

  for (var i = 0; i < queue.length; i++) {
    var post = queue[i];

    if (post.type === 'recurring-countdown') {
      var todayStr = now.toISOString().slice(0, 10);
      if (post.lastPostedDate === todayStr) continue;

      var threshold = new Date(todayStr + 'T' + (post.postAt || '15:00') + ':00Z');
      if (now < threshold) continue;

      var countdownText = buildCountdownText(post, now);
      if (!countdownText) continue;

      var recurringText = (post.textPrefix ? post.textPrefix + ' ' : '') + countdownText +
        (post.textSuffix ? ' ' + post.textSuffix : '');
      if (post.url) recurringText += ' ' + post.url;

      var recurringOk = await postWithFallback(agent, post.id, recurringText, post.image, post.imageAlt);
      if (recurringOk) {
        console.log('Posted: ' + post.id + ' (' + todayStr + ')');
        post.lastPostedDate = todayStr;
        updated = true;
      }
      continue;
    }

    if (post.posted) continue;

    /* Breaking items skip the scheduledFor gate entirely — they post the
       moment this script runs, instead of waiting for their queued time. */
    if (!post.breaking) {
      var due = new Date(post.scheduledFor);
      if (due > now) continue;
    }

    var text = post.breaking ? '🚨 BREAKING: ' + post.text : post.text;
    if (post.url) text += ' ' + post.url;

    var ok = await postWithFallback(agent, post.id, text, post.image, post.imageAlt);
    if (ok) {
      console.log('Posted: ' + post.id);
      post.posted = true;
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
  }
}

run();
