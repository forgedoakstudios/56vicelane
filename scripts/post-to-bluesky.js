const { BskyAgent } = require('@atproto/api');
const fs = require('fs');
const path = require('path');

const queuePath = path.join(__dirname, '..', 'social-queue.json');
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

var MIME_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

async function run() {
  const agent = new BskyAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: process.env.BLUESKY_HANDLE,
    password: process.env.BLUESKY_APP_PASSWORD,
  });

  const now = new Date();
  var updated = false;

  for (var i = 0; i < queue.length; i++) {
    var post = queue[i];
    if (post.posted) continue;
    var due = new Date(post.scheduledFor);
    if (due > now) continue;

    var text = post.text;
    if (post.url) text += ' ' + post.url;

    try {
      var postRecord = {
        text: text,
        createdAt: new Date().toISOString(),
      };

      if (post.image) {
        var imageBytes = fs.readFileSync(path.join(__dirname, '..', post.image));
        var mimeType = MIME_TYPES[path.extname(post.image).toLowerCase()] || 'image/jpeg';
        var uploaded = await agent.uploadBlob(imageBytes, { encoding: mimeType });
        postRecord.embed = {
          $type: 'app.bsky.embed.images',
          images: [{ image: uploaded.data.blob, alt: post.imageAlt || '' }],
        };
      }

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
