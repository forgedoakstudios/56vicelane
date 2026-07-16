const { BskyAgent } = require('@atproto/api');
const fs = require('fs');
const path = require('path');

const queuePath = path.join(__dirname, '..', 'social-queue.json');
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));

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
      await agent.post({
        text: text,
        createdAt: new Date().toISOString(),
      });
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
