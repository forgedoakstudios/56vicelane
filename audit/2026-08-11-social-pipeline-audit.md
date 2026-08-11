# Social pipeline audit: launch-week readiness

**Audit date:** August 11, 2026
**Source:** External audit provided by Chris, logged verbatim for the permanent record. Per Chris's instruction, this is queued behind finishing the site audit (2026-08-11-external-site-audit.md) — not started yet.

You have a functional distribution system, but as designed it will **not** get you to 100 quality posts per week — and more importantly, it will not convert launch-week attention into Last Drive signups. Here is what I would change before November 18.

---

## The core problem

Your pipeline is built around **one article → four identical blasts**. That is publishing, not social media. It explains exactly what you are already seeing:

- Facebook wins because the format (title + excerpt + raw link) is native to how people consume FB.
- IG/X/Bluesky die because "headline + link + hashtags" is the worst-performing format on all three of those platforms in 2026.
- TikTok/YouTube get skipped entirely, which is where your best-performing content historically lives.

You are optimizing for **operational efficiency** (one push, four platforms) at the cost of **platform-native engagement**. During launch week, that tradeoff will cost you the most attention you will ever get.

---

## What is actually working — and why

**Facebook (3 days old, outperforming everything combined):**
This is real, but read it correctly before you over-index. A 3-day-old page with high early traction is usually benefiting from (a) the initial reach boost Meta gives new pages, (b) friends-of-admins seeding, and (c) an algorithm that has not yet decided what you are. That boost fades in 2–4 weeks. **Your window to convert FB reach into Discord members and Last Drive signups is right now, not November 17.**

**Lean into FB, but with intent:**
- Every FB post should have a **Last Drive CTA in the first comment** (link in first comment often outperforms link in post on FB).
- Post 2–3x/day on FB minimum during launch week, not just article blasts.
- Run a **FB Group** parallel to the Page — Groups have much higher organic reach than Pages in 2026, and your community-first positioning is Group-native.
- Go Live on FB from a Last Drive convoy on Nov 18. Live gets the strongest algorithmic push on FB.

---

## What is broken

### 1. The instant blast is your biggest liability

Firing identical content to X, IG, FB, and Discord the moment an article goes live is convenient but produces four bad posts instead of four good ones. Each platform needs its own asset.

**Minimum per-platform adaptation:**

| Platform | What the blast should actually be |
|---|---|
| **X/Twitter** | Thread opener (hook, no link) + reply with link + reply with image. Single link-tweets are throttled. |
| **Instagram** | Carousel or Reel, never a link-in-bio text block. IG suppresses reach on posts that read like link dumps. |
| **Facebook** | Current format is fine — but add first-comment CTA and native image, not link preview thumbnail. |
| **Discord** | Rich embed is good; add a role ping (`@news` opt-in role) and a reaction prompt to drive thread activity. |
| **Bluesky** | Native post with image, no hashtag block (hashtags underperform on Bluesky), link inline. |

If Blotato cannot generate per-platform variants, add a **Claude/GPT node in n8n before the blast** that takes the article and outputs five platform-specific drafts. That is a one-day build and it will double your engagement immediately.

### 2. "Auto-schedule with HITL broken" during launch week is a serious risk

You are about to publish breaking news at the highest-attention moment in your site's history, with:
- AI-generated art
- Persona bylines (not real journalists)
- Auto-blast to five platforms
- No human approval gate

**One wrong leak rating, one hallucinated spec, one misattributed source** goes out across five platforms simultaneously and lands on Discord as an embed before anyone sees it. Rockstar-adjacent communities are unforgiving about this.

**Minimum fix before Nov 18:**
- Restore HITL, even as a 60-second Slack/Discord approval ping.
- Or: build a **two-tier blast** — Tier 1 (confirmed/Rockstar Newswire) auto-fires; Tier 2 (rumor/leak/analysis) requires approval.
- Every auto-fired post logs a "kill switch" URL to `/audit` that can retract from all five platforms in one click.

### 3. Bluesky being on a separate queue guarantees it will be forgotten

During a 100-post week, "queued explicitly" means "not posted." Either move Bluesky into the instant blast or accept that it is not a launch-week channel and stop counting it.

### 4. YouTube and TikTok being manual means they will not happen

You already said TikTok/YouTube historically produce your best reactive content. Excluding them from the pipeline during launch week is the single largest opportunity cost in this plan.

**Minimum viable video pipeline for Nov 18:**
- **One person on standby Nov 17–19** whose only job is 60–90 second reaction Shorts/TikToks.
- Template: cold open (3s) → what dropped → what it means → Last Drive CTA (join tonight).
- Repurpose every video to Reels, Shorts, and TikTok simultaneously (Metricool, Buffer, or OpusClip can do this).
- Vertical video from the Nov 18 convoy itself — driver POV, radio chatter, wall-of-plates screen — is the single most sharable content you will produce all year.

---

## 100 posts/week: does the math work?

100 posts / 7 days = ~14/day. Across your active platforms:

| Platform | Posts/day | Posts/week | Realistic? |
|---|---|---|---|
| X | 4–6 | 30–42 | Yes, needed |
| Instagram | 1–2 (feed) + 3–5 stories | 25–35 | Yes |
| Facebook (Page + Group) | 2–3 | 15–20 | Yes |
| Bluesky | 2–3 | 15–20 | Yes |
| Discord | 3–5 announcements | 20–30 | Yes |
| TikTok | 1–2 | 7–14 | Requires the standby person |
| YouTube Shorts | 1 | 7 | Same person as TikTok |

**Total ceiling: ~150/week.** 100 is achievable — but only if you stop treating "one article = four posts" as your unit of production.

### The content mix that actually works during launch week

Do not make 100 posts about the same article. Aim for this ratio:

- **25% news/updates** (article blasts, Rockstar drops, retailer leaks)
- **25% Last Drive event promotion** (countdown, convoy spotlights, driver features, "spots remaining")
- **20% community UGC** (repost driver plates, gamertags on the Wall, fan art)
- **15% reactive/hot-take** (video-native — this is your TikTok/Shorts lane)
- **10% legacy/nostalgia** (GTA5 memories, "where were you when," best moments)
- **5% commerce** (plates, merch — soft-sell only, don't spam during launch)

---

## The launch-week countdown structure

You have ~14 weeks until Nov 18. Structure the volume ramp so you are not burned out by the actual event:

**Now → T-8 weeks:** Baseline 20–30 posts/week. Test what works per platform. Build the video pipeline. Fix HITL.

**T-8 → T-4:** 40–60 posts/week. Introduce the countdown clock. Start "Meet a Drive Lead" series (great UGC + creator recruitment).

**T-4 → T-1:** 70–90 posts/week. Daily convoy spotlights. Daily Wall of Honor additions posted publicly ("Welcome driver #247 — [gamertag] — [platform]").

**Launch week (Nov 12–19):** 100+/week. Multiple daily posts per platform. Live coverage Nov 18.

**Nov 18 itself:** Live-post the event. FB Live, IG Live, Discord stage, X real-time thread, TikTok/Shorts recaps every 2 hours. This is a **10–15 post day on its own** if done right.

**Nov 19 (GTA6 launch):** Pivot to "The Last Drive happened — here is what we did" recap content. This is your highest-shareability day of the year.

---

## Specific recommendations, ranked

### Do this week
1. Add a per-platform variant generator (LLM node) to the n8n blast so X, IG, Bluesky get native formats instead of headline+link.
2. Restore HITL, or split the blast into confirmed-auto vs rumor-approval tiers.
3. Move Bluesky into the instant blast or drop it from the plan.
4. Recruit the Nov 17–19 video standby person now — not in November.
5. Launch a Facebook Group parallel to the Page and cross-promote.

### Do within 30 days
6. Build a countdown-post template library (14 weeks × 7 days = 98 pre-planned posts you can slot in around news).
7. Start a "Drive Lead of the Week" feature — solves both content volume and creator recruitment.
8. Add first-comment CTA automation on FB blasts.
9. Set up UGC ingestion: a `#56vicelane` hashtag monitor + a Discord `#share-your-plate` channel that auto-forwards to a moderation queue for reposting.
10. Add analytics per platform per post-type so you know by October what to double down on for launch week.

### Do before Nov 12
11. Pre-produce 20–30 evergreen launch-week posts (GTA5 nostalgia, "how to prep," Drive Lead intros) so the pipeline is not 100% dependent on live news.
12. Write the Nov 18 live-coverage playbook: who posts what, from where, every 30 minutes.
13. Write the Nov 19 recap post the week before — you will not have time to write it on the day.
14. Kill-switch drill: practice retracting a bad post across all five platforms in under 5 minutes.

---

## The one thing I would change today

**Stop measuring success by posts published. Start measuring by Last Drive signups attributed to each platform.**

Add a UTM parameter to every outbound link (`?utm_source=fb&utm_medium=blast&utm_campaign=lastdrive`) and put a weekly dashboard in front of yourself that shows:

- Signups per platform per week
- Cost per signup (if you run any paid)
- Discord joins per platform
- Convoy selections per platform

By early October you will know exactly which of your six platforms deserve the launch-week volume and which you can quietly deprioritize. Right now you are guessing based on impressions, and impressions on X/IG/Bluesky are not converting.

---

**Bottom line:** The pipeline is a good v1. For launch week you need (a) per-platform native variants, (b) a working approval gate, (c) a real video pipeline for TikTok/Shorts, (d) a countdown content calendar that is not dependent on news drops, and (e) conversion tracking so 100 posts/week actually produces measurable Last Drive momentum instead of just noise.
