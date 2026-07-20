# Trailer 3 Reaction — Fire-Fast Template

Fill the [brackets], post immediately. Don't wait for a full article —
get the reaction out in minutes, follow with a proper article within the
hour once there's time to actually watch it a few times.

## Immediate social post (X + Bluesky + Instagram)

```
IT'S HERE. The GTA6 trailer 3 just dropped, and [ONE LINE: what's new —
new location? new characters? release date confirmed?].

This is it — everything we've been waiting for. What did you think? Does
it live up to the hype, or what was your reaction?

#GTA6 [link once article/YouTube reaction is up]
```

Voice notes (from brand-voice.md): crank the energy, don't hedge on
first impressions, close with the engagement question — not a yes/no,
something that actually pulls people into the replies.

## Fast article skeleton (fill in within the hour)

**Title:** [Trailer 3 headline — what's the single biggest reveal?]

**Hook paragraph:** Lead with the reveal itself, plainly stated.

**Body:** Break down 3-5 concrete things shown (new footage, confirmed
details, callbacks to trailers 1/2). Speculation clearly labeled as
speculation, per house style — still confident, still engaging, just
tagged as theory when it is one.

**Closing:** Engagement-driving question, not a simple one. Something
like: "Which shot got you the most — [specific scene A] or [specific
scene B]? Tell us why."

## Checklist when it actually drops

1. Post the social reaction within minutes (use the template above,
   don't overthink it).
2. Watch the trailer 2-3 times, take notes on concrete reveals.
3. Write the article, publish it (bypasses the scheduled 8am/4pm queue —
   this goes straight to `articles/` immediately, not through
   `drafts/`).
4. Rebuild: `node tools/build-articles.js && node tools/build-sitemap.js`
5. Queue Bluesky + social blast:
   `node scripts/queue-article-post.js "articles/<slug>.html"`
   `N8N_ARTICLE_WEBHOOK_URL="https://n8n.56vicelane.com/webhook/article-published" node scripts/notify-social-blast.js "articles/<slug>.html"`
6. Commit and push.
