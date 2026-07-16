const { BskyAgent } = require('@atproto/api');
const fs = require('fs');
const path = require('path');

const queuePath = path.join(__dirname, '..', 'social-queue.json');
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

var MIME_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

async function uploadImageEmbed (agent, imagePath, alt) {
  var imageBytes = fs.readFileSync(path.join(__dirname, '..', imagePath));
  var mimeType = MIME_TYPES[path.extname(imagePath).toLowerCase()] || 'image/jpeg';
  var uploaded = await agent.uploadBlob(imageBytes, { encoding: mimeType });
  return { $type: 'app.bsky.embed.images', images: [{ image: uploaded.data.blob, alt: alt || '' }] };
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

      try {
        var recurringRecord = { text: recurringText, createdAt: new Date().toISOString() };
        if (post.image) recurringRecord.embed = await uploadImageEmbed(agent, post.image, post.imageAlt);
        await agent.post(recurringRecord);
        console.log('Posted: ' + post.id + ' (' + todayStr + ')');
        post.lastPostedDate = todayStr;
        updated = true;
      } catch (err) {
        console.error('Failed to post ' + post.id + ':', err);
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

    try {
      var postRecord = { text: text, createdAt: new Date().toISOString() };
      if (post.image) postRecord.embed = await uploadImageEmbed(agent, post.image, post.imageAlt);

      await agent.post(postRecord);
      console.log('Posted: ' + post.id);
      post.posted = true;
      updated = true;
    } catch (err) {
      console.error('Failed to post ' + post.id + ':', err);
    }
  }

  if (updated) {
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
  }
}

run();
