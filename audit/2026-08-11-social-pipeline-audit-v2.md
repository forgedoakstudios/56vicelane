# Social strategy assessment (second review) — 2026-08-11

**Source:** Second external review, logged verbatim for the permanent record. Distinct from `2026-08-11-social-pipeline-audit.md` (first review) — overlaps heavily but models "100 posts/week" differently (100 total placements from ~26 master assets across 7 platforms, vs. the first audit's ~150/week raw per-platform post counts). Reconcile before building against either.

Your pipeline is **fast and operationally solid**. The missing layer is not distribution—it is **platform-native packaging, engagement after publishing, and automated verification safeguards**.

The key decision:

> **Treat 100 posts as 100 platform placements built from roughly 26 strong master assets—not 100 separate link posts.**

If you mean 100 posts **per platform**, that is excessive. If you mean 100 total placements across seven channels, it averages only two to four posts per platform per day and is workable.

Rockstar currently lists **Thursday, November 19, 2026** as the GTA VI release date, making **November 12–18** the clean seven-day pre-launch window for this campaign.

---

# What already works

## 1. Your speed advantage is real

Article publishing immediately triggers X, Instagram, Facebook, and Discord. That is exactly what you want for genuinely time-sensitive announcements.

Keep this.

## 2. Your Facebook prioritization is correct

Your own performance data says Facebook is working. Lean into it rather than allocating equal effort simply because every account exists.

However, prioritize **original Facebook posts and Reels**, not only links. Meta says it is giving original creator content more reach while reducing duplicative, low-value and spam-like publishing. It also specifically warns against flooding feeds with excessive hashtags and distracting captions.

## 3. Separating video-native platforms is correct

TikTok and YouTube should not receive an automated article card masquerading as video. A reactive presenter-led explanation is much better:

- What happened?
- What does it mean?
- What is still unknown?
- Why should players care?

## 4. The audit trail is valuable

Keep `/audit`, but expand it to capture:

- Article ID
- Source status
- Caption sent
- Media hash
- Destination platform
- Platform post ID
- Publish timestamp
- UTM parameters
- Success/failure status
- Retry count
- Correction status

---

# Where the current system falls short

## 1. It is distribution-first, not engagement-first

The current automatic product is essentially:

> Headline + excerpt + link

That distributes an article but rarely starts a conversation.

Every important story should produce at least three different social angles:

1. **The fact:** What happened?
2. **The implication:** Why does it matter?
3. **The conversation:** What does the audience think?

The article blast can remain automatic. The second and third angles should be added to the scheduled queue.

---

## 2. The same article shape is being applied everywhere

Each platform needs a different job.

### Facebook

Use three assets around major stories:

- **Link post:** Direct reporting
- **Native Reel:** Reach and discovery
- **Text/image discussion:** Comments and community

Recommended Facebook caption:

> **Rockstar just confirmed [fact].**
> Here is what changed, what didn't, and what it means for November 19.
>
> **What is your first reaction—good move or bad move?**
> [URL]

Do not use large hashtag blocks. One or two relevant tags are enough.

### Facebook Page versus Groups

Your description combines Page and Group behavior, but they should have separate templates:

- **Page:** Link preview or native visual, concise context, direct question
- **Groups:** Text-led discussion, raw URL where that works better, customized to each group's rules

Do not send identical automated group copy repeatedly.

---

### Instagram

The automatic title/excerpt post should be the **minimum fallback**, not the finished product.

For important articles:

1. Publish a Reel or four-to-six-slide carousel.
2. Share it to Stories.
3. Add a direct Story link sticker.
4. Use "link in bio" only as the backup CTA.

Instagram's Story link sticker sends people directly to the destination, making it much stronger than relying only on the bio.

A breaking carousel could be:

1. **Rockstar just confirmed…**
2. What happened
3. What changed
4. What remains unconfirmed
5. What it means for players
6. Read the full verified report

---

### X

Your automated headline post is fine, but avoid letting most of the account become repetitive links. X explicitly prohibits bulk duplicative content and repeatedly publishing links without meaningful commentary.

For major stories:

- **Post 1:** Confirmed fact + link
- **Reply 1:** What changed
- **Reply 2:** What remains unknown
- **Reply 3:** Specific audience question

Do not automatically add `#GTA6` to every post. Use it selectively when it improves discovery rather than as a permanent suffix.

---

### Bluesky

The structural weakness is breaking-news latency.

Add an **emergency Bluesky queue action** to the article workflow:

```text
if story_tier == "breaking":
    create_bluesky_queue_item(priority="immediate")
```

It does not need to bypass your queue architecture. It needs to enter the queue with a publish time of "now."

The account still needs conversations, replies and participation in GTA-related feeds. A scheduled link-only account will have difficulty establishing itself there.

---

### Discord

Discord should not simply mirror the website.

Each embed should offer three actions:

- **Read the report**
- **Discuss the news**
- **Join The Last Drive**

Recommended flow:

1. Instant embed in `#gta-news`
2. No `@everyone` unless it is an official major announcement
3. Thirty minutes later, post a concise "What this means" summary
4. Pull the best community question into the next social post

That turns Discord into your research and retention layer.

---

### TikTok and YouTube

Manual publishing is acceptable. An undefined manual process is not.

Create a fixed service level:

- **Tier-one official announcement:** Video published within 30–45 minutes
- **Major credible report:** Within two hours
- **Normal article:** Same day if it has a genuine visual angle
- **Weak video angle:** No forced upload

Pre-build a vertical breaking-news template:

```text
0–2 sec: The claim/hook
2–8 sec: What happened
8–20 sec: What it means
20–30 sec: What is not confirmed
30–40 sec: Question or Last Drive CTA
```

YouTube recommends sustainable quality rather than maximizing upload frequency, and its recommendation system focuses on whether viewers choose, watch and enjoy each video. Shorts can also point viewers toward a related video on your channel.

---

# Recommended 100-post structure

## November 12–18, 2026

Build **26 master assets** and adapt them into **100 platform placements**:

| Master content | Quantity | Distribution | Placements |
|---|---:|---|---:|
| News/article packages | 6 | FB, IG, X, Bluesky, Discord | 30 |
| Vertical video masters | 8 | FB Reels, IG Reels, TikTok, YouTube | 32 |
| Community prompts | 7 | FB, X, Bluesky, Discord | 28 |
| Countdown/conversion Stories | 5 | Facebook and Instagram | 10 |
| **Total** | **26 assets** | | **100** |

### Platform totals

| Platform | Posts |
|---|---:|
| Facebook | 26 |
| Instagram | 19 |
| X | 13 |
| Bluesky | 13 |
| Discord | 13 |
| TikTok | 8 |
| YouTube | 8 |
| **Total** | **100** |

This properly favors Facebook while protecting capacity for video.

## Daily ramp

- **November 12:** 10
- **November 13:** 11
- **November 14:** 11
- **November 15:** 12
- **November 16:** 14
- **November 17:** 18
- **November 18:** 24

The 24 on November 18 are spread over seven destinations, not dumped into one feed.

---

# Editorial mix

Across those 100 placements:

- **30%:** Verified GTA VI news and analysis
- **25%:** The Last Drive conversion
- **20%:** Community and user-generated content
- **15%:** GTA V nostalgia
- **5%:** Practical launch preparation
- **5%:** Store and commercial posts

Do not publish fabricated speculation simply to fill a quota. If there are fewer than six legitimate news packages, replace the gap with:

- Last Drive profiles
- GTA V retrospective content
- Community submissions
- Character/location explainers
- Confirmed-facts roundups
- "What Rockstar has not announced" posts

---

# Recurring engagement series

## 1. Your Last…

A daily nostalgia prompt:

- Your last car in GTA Online
- Your last Los Santos sunset
- Your last heist
- Your last apartment
- Your last radio station
- Your last wanted level
- Your last crew photo

CTA:

> Post yours with `#TheLastDrive` and tag 56ViceLane.

## 2. Confirmed / Reported / Rumor

Use consistent visual colors:

- **Green:** Officially confirmed
- **Amber:** Credible report
- **Red:** Rumor or leak
- **Gray:** Disproven/outdated

This can become one of your recognizable formats.

## 3. What Rockstar Didn't Say

After every announcement:

> Rockstar confirmed X. It did **not** confirm Y or Z.

This format is useful, shareable and protects editorial credibility.

## 4. One Minute in Los Santos

Short GTA V nostalgia clips with:

- One memorable location
- One community story
- One piece of history
- One Last Drive CTA

## 5. Drive Lead Spotlight

Feature a real participant:

- Platform
- Region
- Convoy time
- Favorite GTA memory
- Reason for leading
- Direct signup CTA

## 6. Vice City Verdict

One precise debate question:

- Which GTA has the best radio?
- Controller or keyboard?
- Story first or exploration first?
- Jason or Lucia first?
- Midnight session or sleep first?

Avoid generic "thoughts?" captions. Ask questions that are easy to answer.

---

# Add automated safeguards without restoring HITL

You can preserve auto-scheduling while reducing editorial risk.

## Verification gate

Every article needs:

```yaml
status: confirmed | reported | rumor | disproven
story_tier: breaking | major | standard | community
primary_source:
secondary_sources:
published_at_utc:
facts:
not_confirmed:
correction_required: false
video_angle: true | false
generated_visual: true | false
cta:
```

### Rules

- **Confirmed:** Requires a primary source such as Rockstar or Take-Two.
- **Reported:** Requires a named, attributable publisher or source.
- **Rumor:** Must use "rumor," "claim" or "reportedly" in the headline and social copy.
- **No source URL:** No automatic publishing.
- **Source conflict:** Pause distribution and log it.
- **Article update:** Do not rebroadcast unless the update materially changes the story.

## Correction workflow

Add one correction trigger that:

1. Updates the article.
2. Adds a correction box.
3. Posts the correction to every destination that received the original.
4. Replies to the original post where possible.
5. Updates Discord's embed or adds a correction message.
6. Marks all related post IDs in `/audit`.

Do not silently change a materially incorrect article.

---

# Generated-art policy

Generated visuals are workable for features and nostalgia. They are risky for breaking news if viewers can mistake them for screenshots, leaks or official promotional art.

Use an on-image label:

> **56ViceLane Editorial Illustration**

Also:

- Never call it a screenshot.
- Never imply Rockstar supplied it.
- Do not use fake Rockstar UI.
- Prefer a branded typography card for major official announcements.
- Store the generation prompt and image hash in `/audit`.

YouTube requires disclosure when synthetic content creates a realistic-looking scene that did not occur, while X may label synthetic or manipulated media.

---

# Engagement operations

Publishing is only half the job.

For each major post:

### First 15 minutes

- Confirm the post rendered correctly.
- Check the link and image.
- Pin a useful question.
- Answer early substantive comments.

### First hour

- Identify repeated audience questions.
- Turn the strongest question into a follow-up post.
- Save strong comments for screenshots or quote cards.
- Move deeper discussion into Discord where appropriate.

### After 24 hours

Classify the post:

- High reach, low clicks
- Low reach, high engagement
- High clicks, low conversion
- High conversion
- Total miss

Then alter the next hook, format or CTA—not just the posting time.

---

# Measurement

Give every link a platform- and format-specific UTM:

```text
utm_source=facebook
utm_medium=organic_social
utm_campaign=last_drive_launch_week
utm_content=story-id_reel_hook-a
```

Track:

1. Reach
2. Engaged views or watch time
3. Comments and shares per 1,000 people reached
4. Profile visits
5. Website sessions
6. Discord joins
7. Last Drive registrations
8. Convoy selections
9. Email signups
10. Registrations per 1,000 people reached

Your primary launch-week metric should be:

> **Verified Last Drive registrations attributed to social content.**

Your secondary metric should be:

> **Percentage of those registrants who select a convoy or join Discord.**

---

# Bottom line

**Keep the existing automation.** It is a good breaking-news distribution system.

Before launch week, add:

1. A verification gate
2. An immediate Bluesky queue path
3. Instagram Story links
4. A video publishing SLA
5. Per-platform copy rather than universal excerpts
6. A correction webhook
7. Generated-art disclosures
8. UTMs and conversion reporting
9. A first-hour comment workflow

The strongest interpretation of your target is **100 placements from 26 strong master assets**. That gives you high visibility without turning 56ViceLane into an automated link feed.
