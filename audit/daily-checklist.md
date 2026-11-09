# 56ViceLane — Daily Checklist

**Generated:** 2026-11-09 (Central Time)
**How this works:** one list, updated daily. Check things off yourself by
editing this file (change `- [ ]` to `- [x]`), or tell me and I'll check
them off. Each day I regenerate this — anything still unchecked carries
forward, anything new gets added, and you get a fresh copy to download.
Full history/detail always lives in `THIS-WEEK.md` and `NEXT-SESSION.md`
(note: those two files haven't been kept current since late July — this
checklist and the dated `/audit` reports are the more reliable day-to-day
source right now).

---

## Standing decision (2026-08-18)

**Site stays live through GTA6's Nov 19 launch. If growth by then isn't
strong, Chris is done with it.** Not open-ended — a real, growth-gated
checkpoint, not just "keep going." Context: Chris had a real "is this
worth it" moment this week ($200+ in, $0.99 ROI, retention cliffing to
near-zero by day 5). Landed on riding out the ~90 days to launch rather
than stopping now, since GTA6 search/social interest climbing hard
pre-launch is the one thing that could genuinely change the traffic
picture — but that's a bet on the next 90 days, not a guarantee, and the
decision point is real if it doesn't pan out.

## 🚨 Urgent

- [ ] **The entire content pipeline sat dark for 48 days (2026-09-14 through
      2026-10-31) — no breaking articles, no digest drafts, no daily
      checklist regen, despite real GTA6 news happening that whole time.**
      Confirmed via direct repo audit today (2026-11-01): `git log` on
      `main` between those dates shows only `News scan: ...` and "Mark
      posted items in social queue" bot commits — the news-scan GitHub
      Action itself kept running fine the entire time (hundreds of runs),
      but the session-based Routines that turn scan results into articles
      (`56ViceLane News → Breaking Article`, `56ViceLane News → Draft
      Digest`, `56ViceLane Daily Checklist`) produced zero output in that
      window — no new entries in `drafted-links.json`, no new files in
      `articles/`, no new daily-checklist commits. This checklist you're
      reading was still showing 2026-09-14 as its Generated date right up
      until this regen. All three Routines resumed firing and were
      processed normally starting today (2026-11-01) — nothing scored
      7+ or 4-6 in the reports checked since resumption, so no backlog of
      *missed* 7+ stories is confirmed, but a 48-day gap this size means
      real breaking-tier news very likely went uncovered. Worth a
      decision: was this a trigger/scheduling outage on the platform
      side, or something else? If it happens again, it needs to surface
      somewhere more visible than "the checklist silently stopped
      updating."
- [ ] **news-scan's GitHub Actions cron stall count is NOT reliably
      tracked across the 48-day gap above (2026-09-14 through 2026-10-31)
      — nobody was checking during that window.** Last confirmed count
      before the gap: 41 separate stalls across 2026-08-27 through 9/14.
      Resumed active tracking 2026-11-01: 2 stalls caught and fixed that
      day (03:40→06:51 UTC gap, ~3h11m; 07:46→10:51 UTC gap, ~3h5m). 4
      more caught and fixed across the Nov 1 evening–Nov 2 early-afternoon
      stretch (19:18→22:52 UTC gap ~3.5h; 00:05→02:52 UTC gap ~2h46m;
      02:52→06:55 UTC gap ~4h; 10:24→13:13 UTC gap ~2h48m) — all
      re-dispatched via `workflow_dispatch` and confirmed resumed clean.
      4 more caught and fixed across the Nov 2 afternoon–Nov 3 midday
      stretch (13:13→15:17 UTC gap ~2h; 15:18→17:43 UTC gap ~2h25m;
      21:14→00:51 UTC gap ~3.5h; 04:50→08:51 UTC gap ~4h) — all resumed
      clean. 3 more caught and fixed across the Nov 3 afternoon–Nov 4
      midday stretch (13:24→16:51 UTC gap ~3.5h; 20:42→00:51 UTC gap ~4h;
      02:30→06:51 UTC gap ~4h21m) — all resumed clean. 3 more caught and
      fixed across the Nov 4 evening–Nov 5 midday stretch (20:28→00:52
      UTC gap ~4h24m; 02:38→06:52 UTC gap ~4h14m; the 06:52 re-dispatch
      didn't get the schedule itself to resume on its own, so a second
      re-dispatch at 08:52 was needed before natural `schedule`-event
      runs resumed — confirmed healthy again at the 10:09 and 12:36 UTC
      reports). One gap this same stretch (roughly 00:52→04:51 UTC)
      looked like a stall at first glance but checking `actions_list`
      showed the cron had actually fired fine at 01:12 and 02:38, just
      finding zero new RSS items both times — correctly left alone, no
      re-dispatch needed. Running total now
      57. The underlying pattern described below (from
      before the gap) still holds — the cron itself clearly kept running
      throughout the 48 days (hundreds of commits), so whatever caused
      the content-pipeline silence above likely was NOT this same cron
      issue — each
      requiring a manual `workflow_dispatch` to unstick it after gaps of
      ~2-4+ hours (normal cadence is ~90 min-2 hr).
      Plenty of other gaps across this same stretch were checked and
      confirmed genuinely clean/quiet, not stalls — including extended,
      genuinely quiet runs of cycles overnight 9/4-into-9/5, 9/5-into-9/6,
      and again 9/6-into-9/7 where the cron fired on schedule every time
      but found zero new RSS items for several consecutive cycles, which
      is a useful data point: **the stall pattern and the "quiet night"
      pattern can look identical from a report-gap alone and need the
      same `actions_list` gap-check every time — check the actual
      last-run timestamp, not just whether a new report file exists.**
      The workflow itself isn't disabled or failing — GitHub's scheduled-
      trigger dispatch just stops invoking it after some hours of normal
      firing. 22 occurrences in under 3 weeks is well past "occasional
      flake" — this needs a real structural fix (e.g. a redundant cron
      entry at a different offset, or moving the trigger to n8n once
      that's back up) rather than continued manual re-dispatching every
      cycle. No code-level fix implemented yet; flagging again for a
      decision on whether to invest in one.
- [ ] **Root cause of the n8n unreachability finally identified, 2026-11-09:
      it's a session-level network policy block, not n8n itself being
      down.** Checked the proxy's own diagnostic endpoint
      (`$HTTPS_PROXY/__agentproxy/status`) directly instead of just
      curling n8n again — it shows `n8n.56vicelane.com:443` getting a
      403 on CONNECT with reason "policy denial or upstream failure,"
      which per this environment's own proxy docs means the host simply
      isn't on this session's allowed-egress list. That's a different
      problem than "n8n is broken" — it explains why Chris and n8n's own
      automations reach it fine (confirmed via his Gmail showing past
      successful email activity) while this session has never been able
      to reach it at all. **Fix is on Chris's end: update this Claude
      Code environment's network policy to allow `n8n.56vicelane.com`,**
      not a retry or code-level workaround. Until that's done, every
      n8n-dependent step (images, Discord posts, admin data pulls, any
      new workflow build) stays blocked from inside a session, same as
      the item below.
- [ ] **n8n's MCP token has now been down 74+ days running (2026-08-19
      through 2026-11-01, re-tested and reconfirmed broken again today
      via fresh curl to `n8n.56vicelane.com/webhook/article-images` —
      still exit 56/000, CONNECT rejected by the egress proxy), degrading
      every breaking- and digest-article run whenever one actually
      happens.** No breaking/digest article needed it during today's
      resumption (nothing scored 7+ or 4-6 yet), but the outage itself is
      confirmed still live. Every time an article does need it: image
      generation failed (generic
      `gta6-hero.png` placeholder used instead of real hero/inline art)
      — the direct HTTP fallback to `n8n.56vicelane.com` is also blocked
      by this sandbox's egress proxy (curl exit 56/000, CONNECT rejected
      by the proxy's organization policy), so there's still no working
      path. On breaking articles this also meant no Discord post and no
      video-SLA alert — on 9/3's DualSense breaking article, direct
      egress to `discord.com` itself was also tried as a fallback and
      confirmed blocked the same way, so there is genuinely no reachable
      path for that step right now, not just an n8n-specific gap.
      Articles still published/drafted fine (text/build/dedup-state all
      unaffected), just missing real images + Discord + SLA alert every
      time. This is a clear, persistent pattern, not a fluke — worth
      checking why the n8n MCP connection isn't staying authorized
      between sessions; a longer-lived credential or different auth
      approach is probably needed. Full detail:
      `audit/2026-08-19-news-scan-articles-log.md` through
      `audit/2026-09-03-news-scan-articles-log.md`.
- [ ] **Sitemap resubmitted 2026-11-09 — confirmed Success, 123 pages
      discovered.** "Last read" hadn't updated yet as of the resubmit
      screenshot (still showing the prior Nov 5 read), which is expected
      — Google re-crawls asynchronously. Checking back in a few days to
      confirm "Last read" actually advances and the "not indexed" count
      drops. Leaving unchecked until that's confirmed, not just
      submitted.
- [ ] **Manual cleanup needed: 2 wrong Instagram posts + 2 wrong Facebook
      posts went out 2026-08-14.** A bug in how I fired the "video SLA"
      Discord reminder re-triggered the entire social blast instead of
      just Discord, posting garbled internal text ("🎥 VIDEO SLA —
      Tier-1 breaking story... Angle: cold open...") to real IG/FB
      instead of a real caption. Twitter got lucky (failed on a length
      limit, no bad tweet went out). Full detail:
      `audit/2026-08-14-news-scan-articles-log.md`. Needs your manual
      delete/edit on IG + FB; the underlying workflow bug also needs
      fixing before the video-SLA step runs again.
- [ ] Revoke the OLD (pre-8/3) Airtable Personal Access Token in Airtable's
      token settings — still open, Chris to do on his own timeline. This is
      now the only thing standing between the site and being fully off the
      old exposed token.
- [ ] **`/streams` watch page + sitewide "Watch" nav shipped straight to
      `main` on 2026-08-10 without a recorded approval session.** Still
      unresolved as of this checklist — flagging again so it doesn't
      quietly drop. Either confirm you did approve this out-of-band, or
      take a look now that it's already live. Detail:
      `audit/2026-08-10-90-day-push-ramp-and-streams-page.md`.
- [ ] **`news-scan/drafted-links.json` has now drifted out of sync
      between `main` and this dev branch eight times (2026-08-26,
      2026-08-28, 2026-08-30, 2026-08-31, 2026-09-02, 2026-09-10,
      2026-09-14, 2026-11-05), all caught and corrected same session
      before causing any actual duplicate-drafting.** Root cause varies:
      sometimes a digest-routine sync push to `main` landing before a
      later routine re-pulls; the 9/10, 9/14, and 11/5 occurrences were
      all the breaking-article routine's own entries (DualSense
      pre-order-chaos, the Stephen Root actor confirmation, and today's
      Zelnick/Cyberpunk-2077 article plus its 2 duplicate/skip log
      entries) never syncing back to this dev branch — same root cause
      every time: the breaking routine still has no sync-to-dev step of
      its own, only the digest routine syncs in that direction. Eight
      occurrences now means this needs an actual process fix (always
      re-pull/diff-check this file at the start of a turn, and give the
      breaking-article routine its own sync-to-dev step) rather than
      repeat manual correction each time it happens.

## Needs a decision from you

- [ ] **`admin-list-signups` n8n webhook may not be returning an `email`
      field at all, 2026-11-09 finding.** After fixing `admin.html`'s
      CSV-export mapping bug, Chris still didn't see emails in the
      export — pointing to the webhook's own response-shaping node
      (right before its "Respond to Webhook" step) likely stripping
      email out server-side, same pattern as the "Compare Password"
      node investigation. Chris worked around it and got the Drive Lead
      emails some other way to send today's email, but the underlying
      gap is still open — worth checking that workflow's response node
      and adding `email` (verify the real field name in the Data Table
      first) if it's missing, so the CSV export reliably works going
      forward without a manual workaround each time.
- [ ] **No "email all drive leads" capability exists yet — building it now,
      but it needs n8n reachable to actually go live (see Urgent, the
      network-policy item).** Chris asked 2026-11-09 for a 10-days-to-
      launch / 9-days-to-Last-Drive email to all Drive Leads (add riders,
      confirm arrangements, claim a Discord channel under #last-drive to
      coordinate). No existing pipeline sends this — `admin.html` has an
      Email column in its CSV export and an `admin-list-contacts` n8n
      webhook, but nothing wired to actually send mail to that list.
      Drafted the email copy already (ready to use). Building an
      importable n8n workflow (Gmail SMTP node, per the SMTP credential
      Chris set up per `NEXT-SESSION.md`) now — but it can't be tested or
      activated until n8n is reachable again, so this needs Chris to
      either send today's email manually in the meantime, or fix the
      network policy first.
- [ ] **1 new digest-tier article drafted 2026-11-08, needs your go-ahead:**
      "GTA6 Physical Copies: Code-In-Box, No Disc" (score 5, Polygon,
      corroborated across Kotaku/Men's Journal). Julian Ashworth byline,
      `source-status: reported`. Held on this dev branch, not shipped.
- [ ] **Breaking article published 2026-11-05, needs no approval (already
      live) but flagging the social-pipeline gap:** "Take-Two CEO Suggests
      Rockstar Avoided a Cyberpunk 2077-Style Launch With GTA6's Delays"
      (score 7, GamesRadar, reporting a WSJ interview) — Zelnick described
      a competitor's launch that "had to pull the title after shipping"
      without naming it; read by GamesRadar and others as a Cyberpunk 2077
      reference, but he didn't confirm that directly, so `source-status:
      reported`. Marcus Webb byline. Pushed straight to `main`. Bluesky
      queued fine; X/IG/FB/Discord social-blast failed (n8n still down)
      and — new this time — **the video-SLA Discord alert also could not
      be sent at all, not even via the risky re-trigger-the-whole-webhook
      workaround**, because this session has no way to resolve the
      Discord webhook URL without going through n8n, and direct
      `discord.com` egress is also blocked. Whoever's on video duty needs
      to check this article manually — no automated ping went out. Full
      log: `audit/2026-11-05-news-scan-articles-log.md`.
- [ ] **7 new digest-tier articles drafted 2026-11-04 afternoon, never
      logged in this checklist until now (drafted after that day's
      regen), need your go-ahead:** "How To Claim Your GTA6 Preorder
      Bonus Through GTA+" (Marcus Webb), "Ubisoft's Next Division 2
      Project Might Be Walking Right Into GTA6's Launch" (Marcus Webb),
      "Does GTA6 Have A 60 FPS Mode? Every Confirmed And Rumored Graphics
      Setting" (Julian Ashworth), "Is GTA6 Out Yet? What To Actually
      Track On Launch Day" (Danny Marchetti), "GTA6 Preorders Have
      Reportedly Already Topped $730 Million" (Marcus Webb), "Xbox Built
      An Alligator-Shaped Series X For GTA6 — And You Can Win It" (Marcus
      Webb), and "Rockstar May DMCA GTA6 Spoilers Even After Launch"
      (Ezra Voss). All `source-status: reported`, all placeholder hero
      images (n8n outage). Held on this dev branch, not shipped. Digest
      backlog now verified at 48 articles (direct `articles/` diff
      against `main`) — genuinely worth a batch review pass, it keeps
      growing.
- [ ] **2 new digest-tier articles drafted 2026-11-02, need your go-ahead:**
      "Walmart's GTA6 Preorder Bonus Is A Mystery 'Surprise And Delight'
      Bag" (score 5, Insider Gaming, single-source — could not
      independently corroborate the bag's contents, so written with
      "according to Insider Gaming" hedging throughout) and "Every GTA6
      Trailer Released So Far — The Full Timeline" (score 5, Insider
      Gaming recap of the two real GTA6 trailers — Dec 2023 reveal and
      the Aug 2026 Netflix Extended Look). Marcus Webb and Danny
      Marchetti bylines respectively, both `source-status: reported`.
      Both hit the n8n image outage (see Urgent) — placeholder hero used
      for both. Held on this dev branch, not shipped. Digest backlog now
      verified at 41 articles (direct `articles/` diff against `main`) —
      genuinely worth a batch review pass, it keeps growing.
- [ ] **New digest-tier article drafted 2026-09-13, needs your go-ahead:**
      "Rockstar Says GTA5's NPCs Already Looked Dated — Here's How GTA6
      Fixes It" (score 5, GamesRadar, corroborated across Kotaku/SVG) —
      Rockstar had to visibly raise the bar on NPC realism/behavior since
      GTA5's own NPCs already looked dated at that game's 2013 launch.
      Reg Calloway byline (retro/nostalgia/franchise-history beat — the
      story measures GTA6 against GTA5's own past), `source-status:
      confirmed`. Related links to the trailer-1 "not fully formed"
      piece, the no-first-person-mode piece, and the Zelnick 13-year-wait
      piece — all verified to exist. Held on this dev branch, not
      shipped. Digest backlog now verified at 39 articles (direct
      `articles/` diff against `main`) — genuinely worth a batch review
      pass at this point, it keeps growing.
- [ ] **New digest-tier article drafted 2026-09-12, needs your go-ahead:**
      "Rockstar Says Hackers Tried To Blackmail It Over GTA6 Leaks — And
      Drones Were Used To Spy On Devs" (score 5, The Gamer, corroborated
      across GamesRadar/Yahoo/ReadDork) — new tribunal testimony revealing
      blackmail attempts and drone surveillance aimed at Rockstar's GTA6
      development; checked against the existing tribunal article, genuine
      new detail, not a duplicate. Ezra Voss byline, `source-status:
      confirmed`. Held on this dev branch, not shipped. Digest backlog now
      verified at 38 articles (direct `articles/` diff against `main`) —
      genuinely worth a batch review pass at this point.
- [ ] **2 new digest-tier articles drafted 2026-09-11, need your go-ahead:**
      "GTA6 Is Going To Be Huge — So Why Is Take-Two's Stock Having A Bad
      Year?" (score 5, GameSpot, consolidating two related GameSpot pieces
      — year-to-date stock decline tied to leak fallout, plus the routine
      CFO stock sale correctly framed as non-newsworthy) and "Miami Beach
      Approves $4 Million GTA6 Ad Campaign — City Wants More" (score 5,
      Dexerto, corroborated across GamesRadar/Kotaku/Sportskeeda) — a
      genuine escalation of the already-drafted Miami marketing pushback
      story (commissioners voted 4-3 to approve, city now negotiating for
      more). Marcus Webb and Danny Marchetti bylines respectively, both
      `source-status: confirmed`. Held on this dev branch, not shipped.
      Digest backlog now verified at 37 articles (direct `articles/` diff
      against `main`) — genuinely worth a batch review pass at this point.
- [ ] **New digest-tier article drafted 2026-09-10, needs your go-ahead:**
      "Rockstar Admits GTA6 'Wasn't Fully Formed' When Trailer 1 Dropped
      In 2023" (score 5, GameSpot, corroborated across GamesRadar and
      others) — Rockstar North's Rob Nelson reveals the Tom Petty song
      was an internal "mission statement," complementing (not
      duplicating) the existing trailer-song-backstory article. Danny
      Marchetti byline, `source-status: confirmed`. Held on this dev
      branch, not shipped. Digest backlog is now verified at 35 articles
      (direct `articles/` diff against `main`) — genuinely worth a batch
      review pass at this point.
- [ ] **New digest-tier article drafted 2026-09-09, needs your go-ahead:**
      "Zelda: Ocarina Of Time Remake Confirmed For November 5 — Two
      Weeks Ahead Of GTA6" (score 5, GameSpot, corroborated across
      RPGFan/ScreenRant/Beebom/GameInformer) — Nintendo's remake lands
      on Switch 2 two weeks before GTA6, following the established
      competitive-timing template (Squadron 42, Ananta, No Rest for the
      Wicked). Marcus Webb byline, `source-status: confirmed`. Held on
      this dev branch, not shipped. Digest backlog is now verified at
      34 articles (direct `articles/` diff against `main`) — genuinely
      worth a batch review pass, this keeps growing.
- [ ] **2 new digest-tier articles drafted 2026-09-08, need your go-ahead:**
      "GTA6's Regional Launch Times Revealed — Some Players Get In Nearly
      19 Hours Before Others" (score 5, consolidated from IGN/Dexerto/
      Insider Gaming — all the same New Zealand-trick/staggered-unlock
      story) and "This GTA6 Fan's Girlfriend Gave Him The Ultimate VIP
      Pre-Order Treatment" (score 5, Dexerto human-interest piece). Both
      Danny Marchetti byline, both `source-status: reported`, placeholder
      hero image (n8n outage, see Urgent). Held on this dev branch, not
      shipped. Digest backlog is now verified at 33 articles (direct
      `articles/` diff against `main`) — this keeps growing and is
      genuinely worth a batch review pass.
- [ ] **2 new digest-tier articles drafted 2026-09-07, need your go-ahead:**
      "GTA6's Trailer 1 Song, 'Love Is A Long Road,' Explained" (score 5,
      The Gamer) — the Tom Petty deep-cut backstory behind the trailer's
      needle-drop, corroborated via WebSearch across several outlets;
      and "A Fan Built A LEGO GTA6 Set And It's So Good It's A Shame
      There's No Official Version" (score 5, GamesRadar) — a fan-built
      MOC, `source-status: confirmed` on the build itself existing.
      Camille Duarte and Danny Marchetti bylines respectively. Held on
      this dev branch, not shipped. **Doing a proper recount of the
      digest backlog this pass (diffing `articles/` between this branch
      and `main` directly, rather than incrementing a running tally) —
      the real number is 31 digest articles now sitting on this branch
      awaiting review, higher than the previously-tracked count. Worth
      a real batch pass, this has gotten long.**
- [ ] **New digest-tier article drafted 2026-09-05, needs your go-ahead:**
      "YouTube Updates Gaming Violence Monetization Rules Ahead Of GTA6
      Launch" (score 5, Dexerto) — a monetization-policy update relevant
      to creators planning day-one GTA6 content. Marcus Webb byline,
      `source-status: reported` since the exact policy wording hasn't
      been independently verified beyond this one outlet. Held on this
      dev branch, not shipped. Also skipped a duplicate the same day
      (IGN's rehash of the already-covered China-censorship/Bilibili
      story). `drafted-links.json` confirmed in sync with `main` before
      editing — no drift this time. This makes 22 digest articles now
      queued for review — genuinely worth a batch pass, the backlog
      keeps growing.
- [ ] **New digest-tier article drafted 2026-09-04, needs your go-ahead:**
      "GTA6 Marketing Plans Hit A Roadblock With Miami Officials" (score
      5, The Gamer) — Miami-Dade police and a local sheriff publicly
      pushed back on a proposed marketing tie-in leaning into the city's
      Vice City identity, escalating across 5 total outlets over several
      days and ending in the sheriff formally rejecting the proposal.
      Danny Marchetti byline (no specialist beat fit cleanly),
      `source-status: confirmed` given the strength of direct-quote
      corroboration. Held on this dev branch, not shipped. While drafting
      this one, also caught and fixed a real `drafted-links.json`
      sync-drift — this dev branch's copy was 3 entries behind `main`
      (missing the 9/3 DualSense breaking-tier sync, which the
      breaking-article routine still doesn't push back to dev on its
      own) — confirmed `main` was a clean superset before merging it in
      as the new base. This makes 21 digest articles now queued for
      review — genuinely worth a batch pass, the backlog keeps growing.
- [ ] **2 new digest-tier articles drafted 2026-09-03, need your go-ahead:**
      "GTA6 Is Already Being Officially Censored In China" (score 5, The
      Gamer) — a trimmed Bilibili cut of the Extended Look, standard
      practice for the market but a real signal Rockstar is actively
      pursuing a sanctioned China release; and "GTA6 Honor System
      Officially Has A Point Of No Return" (score 5, The Gamer) — push
      your in-game reputation far enough into infamy and there's no
      redemption arc back to "good" for that playthrough. Marcus Webb
      and Danny Marchetti bylines respectively (honor-system story
      didn't cleanly fit a specialist beat, defaulted to Danny per the
      persona rules), both `source-status: confirmed`, placeholder hero
      images (n8n outage, see Urgent). Held on this dev branch, not
      shipped. Also skipped 2 other score 5-6 items the same day as not
      genuine new GTA6 stories: an IGN interview about a different
      game's launch date (GTA6 only mentioned as competing timing) and
      an IGN "fans tracking oxygen levels at Rockstar HQ" piece that
      turned out (verified via WebSearch) to be a rehash of a June 2026
      viral meme, not fresh reporting. This makes 20 digest articles now
      queued for review — genuinely worth a batch pass, the backlog
      keeps growing.
- [ ] **2 new digest-tier articles drafted 2026-09-02, need your go-ahead:**
      "GTA6's Extended Look Was Netflix's Biggest Show Last Week — 31.1
      Million Views" (score 5, PC Gamer) — topped Netflix's global
      charts in 87/93 countries, beating scripted shows like The
      Whisper Man; and "Take-Two's Hunt For The GTA6 Leaker Narrows To
      Two Identified Suspects" (score 5, Dexerto) — investigation moved
      from broad Discord subpoenas to 1-2 specifically identified
      people, filing sealed. Marcus Webb and Ezra Voss bylines
      respectively, both `source-status: reported`, placeholder hero
      images (n8n outage, see Urgent). Held on this dev branch, not
      shipped. This makes 18 digest articles now queued for review —
      genuinely worth a batch pass, the backlog keeps growing.
- [ ] **New digest-tier article drafted 2026-09-01, needs your go-ahead:**
      "GTA6 Gets Even More New Screenshots As Rockstar Locks In For
      November Launch" (score 5, IGN) — 99 images released (3 new),
      covering an interrogation scene, a convertible cruise, and
      character customization. Camille Duarte byline (character/
      culture beat), `source-status: reported`. Placeholder hero image
      (n8n outage, see Urgent). Held on this dev branch, not shipped.
      This makes 16 digest articles now queued for review.
- [ ] **2 new digest-tier articles drafted 2026-08-31, need your go-ahead:**
      "Take-Two Widens GTA6 Leak Subpoena To X — Sets September 4
      Deadline" (score 5, The Gamer) — genuine escalation of the
      already-drafted subpoena story (X added, specific data demands,
      hard deadline); and "GTA6 Officially References Clair Obscur:
      Expedition 33" (score 5, The Gamer) — a background trailer poster
      easter egg. Both Ezra Voss byline, `source-status: reported`,
      placeholder hero image (n8n outage, see Urgent). Held on this dev
      branch, not shipped. This makes 15 digest articles now queued for
      review — the backlog keeps growing, genuinely worth a batch pass.
- [ ] **New digest-tier article drafted 2026-08-30, needs your go-ahead:**
      "The Witcher 4 Confirms A Physical Edition — But It's Following
      GTA6's Playbook" (score 5, The Gamer). CD Projekt RED confirmed a
      physical edition with no guaranteed disc, explicitly following
      GTA6's download-code approach — genuine tie-in, cross-links to
      the existing disc-doesn't-make-sense article. Danny Marchetti
      byline, `source-status: reported`. Placeholder hero image (n8n
      outage, see Urgent). Held on this dev branch, not shipped. This
      makes 13 digest articles now queued for review — the backlog
      keeps growing, genuinely worth a batch pass.
- [ ] **New digest-tier article drafted 2026-08-23, needs your go-ahead:**
      "GTA6 Leaker Burns $1 Million In Crypto After 8th Leak" (score 5,
      The Gamer). Ezra Voss byline (leaks beat), `source-status:
      reported`. Placeholder hero image (n8n outage, see Urgent). Held
      on this dev branch, not shipped. This makes 5 digest articles now
      queued for review — worth a batch pass when you have time.
- [ ] **2 new digest-tier articles drafted 2026-08-22, need your go-ahead:**
      "Xbox Says It's Working Closely With Rockstar To Protect GTA6's IP"
      (score 5, Marcus Webb byline) and "GTA6 Leak Hubs Are Reportedly
      Down — But The Leaker Isn't Done Yet" (score 5, Ezra Voss byline —
      same-day whiplash between "leaks might be over" and "leaker's
      still active"). Both `source-status: reported`, placeholder hero
      images (n8n outage, see Urgent). Held on this dev branch, not
      shipped.
- [ ] **New digest-tier article drafted 2026-08-21, needs your go-ahead:**
      "Take-Two Subpoenas Microsoft And Discord In The Hunt For The GTA6
      Leaker" (score 5, corroborated across IGN/GamesRadar/Dexerto).
      Ezra Voss byline (leaks/investigative beat), `source-status:
      reported`. Placeholder hero image (n8n outage, see Urgent). Held
      on this dev branch, not shipped.
- [ ] **New digest-tier article drafted 2026-08-19, needs your go-ahead:**
      "GTA6 Believed To Have Sold Almost 4.5 Million Pre-Orders" (score
      5, The Gamer). Marcus Webb byline (business beat),
      `source-status: reported` — an outside analyst estimate, not an
      official Take-Two figure. Real hero + 2 inline images. Held on
      this dev branch, not shipped.
- [ ] **"Even The US Military Is Respecting The GTA6 Launch" — Army
      re-enlist digest article, still needs your go-ahead.** You
      personally flagged this one (news-scan scored it a 2, you called it
      as a real 5-6 human-interest/clickbait story) and then flagged two
      more issues after the first draft: the title was too flat and the
      hero/inline images came out dark and tactical instead of matching
      the site's Vice City look. Both fixed — retitled throughout, images
      regenerated with a prompt steered toward off-duty/neon-sunset
      framing instead of literal soldier/battalion content. Trevor byline,
      `source-status: reported`. Still held on this dev branch — not
      pushed to `main`, not queued to social.
- [ ] **New digest-tier article drafted 2026-08-18, needs your go-ahead:**
      "There's No Official GTA6 Headset Yet — But The LucidSound LS500
      Gets Close" (score 5, GamesRadar). Julian Ashworth byline
      (hardware/gear beat), `source-status: reported` since it's an
      unlicensed product with no real Rockstar/Take-Two tie-in — flagged
      clearly in the piece itself. Real hero + 2 inline images. Held on
      this dev branch, not shipped.
- [ ] **Blotato cancelled 2026-08-16 — 4 bad live IG/FB posts from the
      2026-08-14 video-SLA incident still need your manual delete/edit,
      and there's now no Blotato dashboard to check post status in.**
      Chris cancelled Blotato outright (traction wasn't there, and
      posting to channels that weren't sending visitors wasn't worth
      paying for). Shut down cleanly same day: disabled the "Post to
      Blotato" node in all 4 hybrid workflows (Article → Social Blast,
      Friday Frequency, Last Drive Push, Evergreen Recycle Poster) while
      leaving each workflow's independent Discord-posting leg and — for
      Friday Frequency — the Gemini content-generation/Store Edition
      pipeline untouched and still running. Fully deactivated the 2
      Blotato-only workflows (`Blotato - Check Post Status`, `Daily Last
      Drive Countdown → X`). X/Instagram/Facebook auto-posting is now
      off entirely; Discord (direct webhook) and Bluesky (queue) remain
      the live auto-posting paths. CLAUDE.md's posting-mode section
      updated to match. The 2 wrong IG + 2 wrong FB posts from 8/14 are
      still sitting live on those accounts — I have no way to remove them
      from here; that part is on you whenever you get to it.
- [ ] **5 news-scan articles awaiting review, 2026-08-14.** 2 breaking
      (score 7+) already pushed live to `main`: Take-Two declining to
      share raw pre-order numbers, and Rockstar/NoPixel V roleplay beta
      news. 3 digest-tier (score 4-6) held on this dev branch for your
      go-ahead: Target's 20% student/teacher pre-order discount, a rival
      PC title landing GTA6's same release date, and an analyst claim
      that pre-orders alone could cover the production budget. All 5
      marked `source-status: reported` (WebFetch was blocked for every
      outlet this run, so nothing could be independently corroborated —
      written with "according to [outlet]" attribution throughout, not
      stated as settled fact). Full log:
      `audit/2026-08-14-news-scan-articles-log.md`.
- [ ] **Gmail cleanup (receipts category + $99 emails + babylovegrowth
      emails)** — you asked for this, but you've also said you're done
      re-authorizing the Gmail connector every time it drops. Recommended
      path: build it as native Gmail filters instead (runs inside Gmail
      itself, no connector/reconnect dependency at all). I need the exact
      sender/subject pattern for the "$99" emails to write an accurate
      filter — say the word and I'll draft the filter queries for you to
      paste into Gmail's filter settings once.
- [ ] **Piper voice-latency fix — mid-troubleshooting, not yet confirmed
      working.** Background service is running (heartbeat confirmed
      ticking), but a real test produced no audio — traced to the service
      generating audio files it wasn't reliably playing/cleaning up. A
      fixed `jarvis-service.ps1` has been sent (collapses multi-line text
      before sending to Piper, plays every file it generates, logs
      failures instead of hiding them) — still needs a fresh test after
      replacing the file and restarting the service.
- [ ] **Do one real, low-value test purchase on the store** to confirm the
      PayPal fix works end-to-end in production, including the plate/bundle
      actually getting granted — the synthetic test only proved the
      credential and rejection logic, not a full real grant.
- [ ] **AI video — Blotato's own video path is gone now that Blotato is
      cancelled; OpenArt testing (prompt notes in
      `audit/ai-video-prompt-notes.md`) is whatever's left to build on.**
- [ ] **Video-SLA Discord alert needs a real fix — skipped twice now
      (2026-08-14, 2026-08-18)** on breaking-article publishes. The only
      currently-reachable path (re-triggering the article webhook with
      substitute text) is the exact mechanism that caused the 8/14
      duplicate/garbled-post incident. Needs a dedicated Discord-only
      endpoint/node separate from the article-announcement path before
      this can run automatically again — not something to keep silently
      skipping.
- [ ] **Dell monitor swap — still drafted, needs your merge approval.**
      Unchanged, sitting on `claude/dell-monitor-swap`.
- [ ] **More affiliate programs — Turtle Beach and Impact network still
      not applied to.** `gear.html` links a Turtle Beach product via the
      existing Amazon Associates tag — that's not the same as a direct
      Turtle Beach affiliate relationship, so this is still genuinely open.
- [ ] Weekly Winner Selection — rewired off Airtable, tested clean, left
      inactive. Enabling it is your call.
- [ ] External citation links in article bodies and live redirect/404
      behavior still haven't been checked (the 7/31 audit hit a 403 on
      outbound calls).
- [ ] **gear.html's `amzn.to` short links may still be tracking under the
      old Amazon tag.** The new tag (`forgedoakstud-20`) is live everywhere
      I have direct control, but gear.html's "Check Price" buttons use
      Amazon's own shortened URLs — the tag is baked in at creation time
      via Amazon's link tool, invisible and unreachable from here. Worth
      checking in Associates Central whether those need regenerating.
- [ ] **Full sitewide nav standardization (Watch/Leaderboard/Streams links)
      and full source-status rollout across all leak/breaking articles** —
      the 2026-08-11 external audit's "within 2 weeks" items. The 48-hour
      safety/trust items from that same audit are done (see below); these
      two are the broader sitewide follow-through, not started as a full
      pass yet.
- [x] ~~Instagram anti-spam~~ — moot as of 2026-08-16, Blotato (the only
      IG-posting path) is cancelled entirely. See the Blotato-cancellation
      item above.

## Shelved — revisit late August 2026

- [ ] AdSense — no longer just a resubmission-timing question. AdSense was
      **removed sitewide 2026-08-12** after triggering a Google Safe
      Browsing "Deceptive pages" flag (malvertising via the ad network, not
      a code compromise — confirmed via Google's own "Review successful"
      follow-up email after the removal). Whether to pursue AdSense again
      at all, and when, is now a bigger question than just site-age timing.

## Cancelled / not pursuing

- [x] ~~Trevor/Danny per-platform social accounts~~ — cancelled 2026-07-28.
- [x] ~~Adult-toy-store affiliate invite~~ — "just a funny thought."

## Done recently

- [x] **Drive Lead countdown email sent 2026-11-09** — 10 days to
      launch / 9 days to The Last Drive, covering adding riders,
      confirming arrangements, and claiming a #last-drive Discord
      channel. Sent manually from Chris's personal Gmail (Bcc, ~20+
      recipients) rather than through n8n, since n8n is still
      unreachable from this sandbox. Along the way: fixed the
      `admin.html` CSV export bug (Email/Region/SignupType/StagingTime
      columns were silently blank), diagnosed that the password-reset
      pipeline doesn't exist yet when Chris got locked out of `/admin`,
      shipped a "Forgot password?" frontend (not yet backed by a real
      n8n workflow — spec in
      `audit/n8n-email-drive-leads-blueprint.md`), and walked through
      n8n directly to find the real admin password (stored in an n8n
      Data Table, `adminPass` field, table ID `qAuBlJlozGJbHzLb`,
      checked via the "Compare Password" node in the "Admin - Verify
      Password" workflow) so Chris could reset it himself without
      waiting on the email pipeline.
- [x] **GSC sitemap resubmitted 2026-11-09** — see Urgent above, still
      confirming "Last read" actually advances.
- [x] **Daily "11 days out" countdown launched 2026-11-08, now on day 2
      (2026-11-09).** New standing rule through GTA6 launch (Nov 19):
      one Editor's Desk + one Trevor's Take post every day, escalating
      tone (Editor's heartburn bit, Trevor's "undercover op winding
      down" bit) — replaces the normal weekly cadence until launch. Also
      fixed a real bug while setting this up: the `/editor` and `/trevor`
      archive pages have been silently showing "Nothing archived yet"
      since they launched, because `build-articles.js` never captured
      the `<meta name="column">` tag the archives filter on. Fixed the
      build script and backfilled all 5 pre-existing Editor's Desk/
      Trevor's Take articles — both archives now populate correctly,
      most-recent-first. Set up a daily scheduled Routine to keep this
      running automatically through launch day without needing a manual
      trigger each day. A scheduled Routine firing confirmed this is
      running as day 2 ("10 days out") shipped clean today.
- [x] **Wall of Honor split into two 4-column tiers, 2026-11-08.** First
      100 signups (founder plates) now render in their own labeled
      section; everyone after #100 renders in a separate "Participants"
      section below. Verified with mocked Playwright data (100/20 split
      exactly right) before shipping. Held on a branch pending approval
      initially, then pushed to `main` once Chris confirmed.
- [x] **New `/videos` page shipped, 2026-11-08.** Curated GTA video
      rotation (creator embeds, not re-hosted clips — avoids any DMCA/
      rights risk) with channel attribution; 2 SpeirsTheAmazingHD videos
      live, more to come as Chris sends links.
- [x] **Last Drive milestone + Drive Lead comms shipped, 2026-11-08.**
      166 drivers / 100+ Discord members milestone banner added to
      `lastdrive.html`, plus new Drive Lead ↔ participant communication
      instructions pointing to the `#last-drive` Discord channel.
- [x] **Diagnosed the real cause of this session's n8n unreachability,
      2026-11-09** (see Urgent — it's a network policy block on this
      Claude Code environment, not n8n being down; confirmed via the
      proxy's own status endpoint rather than just re-curling n8n).
- [x] **2026-11-04 evening through 2026-11-05 midday: 1 breaking article
      published, 2 items correctly skipped, 3 more cron stalls, an 8th
      `drafted-links.json` sync-drift caught and fixed.** Published
      "Take-Two CEO Suggests Rockstar Avoided a Cyberpunk 2077-Style
      Launch With GTA6's Delays" (see Needs a decision above for full
      detail) straight to `main`. Also correctly skipped two other
      score-7+ items the same scan: IGN's $750M preorder story (score 9)
      was the same running Sensor Tower estimate already covered via
      Dexerto hours earlier at $730M — not a new number, just a second
      outlet; and IGN's Sony/Wolverine PlayStation-earnings story (score
      7) turned out to tie to GTA6 only through one outlet's speculative
      inference about Sony's forecast guidance, not anything Sony or
      Take-Two actually said about GTA6 — correctly left undrafted rather
      than stretched into a GTA6 story. Caught and re-dispatched 3 more
      news-scan cron stalls (see Urgent for the running count, now 57),
      including one that needed a second re-dispatch because the first
      didn't get the schedule to resume on its own. Also caught and fixed
      the 8th `drafted-links.json` sync-drift occurrence — this dev
      branch was missing today's own breaking-tier entries (same
      still-unfixed root cause as the 9/10 and 9/14 occurrences, see
      Urgent). Digest backlog now at 48 (direct `articles/` diff against
      `main`) — 7 of those were drafted yesterday afternoon but never
      made it into a checklist until this regen (see Needs a decision).
- [x] **2026-11-03 afternoon through 2026-11-04 midday: quiet stretch,
      one near-miss breaking story correctly caught and skipped, plus 3
      more cron stalls.** 3 outlets (IGN, Dexerto, The Gamer) scored 7 on
      a GTA6 preload/install-size/physical-map "confirmation" story —
      verified before drafting and found it didn't hold up: the preload
      date was already covered by an existing July article, independent
      WebSearch showed the install-size and global-release-time claims
      are NOT actually officially confirmed (still leak-based/conflicting
      despite the "confirmed" framing in headlines), and the physical
      Leonida map poster predates today's reports by weeks. Skipped
      rather than publishing an overstated or duplicate piece — logged in
      `drafted-links.json` on both branches so it isn't re-attempted.
      Nothing else scored 7+ across roughly a dozen more firings (mostly
      2s and 3s, a few 4-6s left for the digest routine). Caught and
      re-dispatched 3 more news-scan cron stalls (see Urgent for the
      running count, now 54) — all resumed clean. Digest backlog holding
      steady at 45 (direct `articles/` diff against `main`) —
      `drafted-links.json` confirmed in sync between branches (155
      entries both).
- [x] **2026-11-02 afternoon through 2026-11-03 midday: steady quiet
      stretch, 2 new digest articles plus 4 more cron stalls.** Processed
      the Breaking Article (7+) Routine across roughly a dozen firings in
      this window — nothing scored 7+ in any report (mostly 2s and 3s, a
      handful of 4s and 5s). 2 new digest-tier articles drafted (see
      Needs a decision: Walmart preorder bonus bag, GTA6 trailer
      timeline recap), bringing the digest backlog to 41 articles
      (direct `articles/` diff against `main`). Caught and re-dispatched
      4 more news-scan cron stalls (see Urgent for the running count, now
      51) — all resumed clean. `drafted-links.json` confirmed in sync
      between branches (147 entries both) — no drift this stretch. n8n
      image-generation outage re-confirmed still down (fresh curl test,
      exit 56/000) before drafting both new digest articles.
- [x] **2026-11-01 evening through 2026-11-02 early afternoon: steady
      quiet stretch, 1 new digest article plus 4 more cron stalls.**
      Processed the Breaking Article (7+) Routine across roughly a dozen
      firings in this window — nothing scored 7+ in any report (mostly
      2s and 3s, a few 5s). One new digest-tier article drafted (see
      Needs a decision: Rockstar/GTA5-NPC-realism-aging, Reg Calloway
      byline), bringing the digest backlog to 39 articles (direct
      `articles/` diff against `main`). Caught and re-dispatched 4 more
      news-scan cron stalls (see Urgent for the running count, now 47)
      — all resumed clean. `drafted-links.json` confirmed in sync
      between branches (145 entries both) — no drift this stretch.
- [x] **2026-11-01: content pipeline resumed after the 48-day gap (see
      Urgent).** Processed the Breaking Article (7+) Routine across
      several firings today — nothing scored 7+ in any report since
      resumption (mostly 3s, one score-5 item). Caught and re-dispatched
      2 news-scan cron stalls, both resumed clean. Confirmed digest
      backlog unchanged at 38 articles (direct `articles/` diff against
      `main` — no new digest activity happened during the gap either,
      consistent with the pipeline-silence finding above).
      `drafted-links.json` confirmed in sync between branches (no drift
      — expected, since neither routine wrote anything new during the
      gap). n8n outage re-confirmed still live (74+ days).
- [x] **2026-09-13 midday through 2026-09-14 midday: quiet-to-active
      stretch, 1 breaking article plus 2 more cron stalls plus a 7th
      `drafted-links.json` sync-drift.** Mostly 3s across roughly 20
      quiet scan cycles, then a real story broke: Stephen Root's actor
      confirmation. Manually re-dispatched the news-scan cron twice more
      (16:51 on 9/13, 10:51 on 9/14, see Urgent for the running stall
      count) — both resumed clean. Caught and fixed the 7th
      `drafted-links.json` sync-drift (dev branch was missing the
      Stephen Root breaking-article entries) — same root cause as
      9/10, still unfixed at the process level (see Urgent).
- [x] **Breaking article published, 2026-09-14: "GTA6's First Confirmed
      Actor Is Stephen Root — Playing A Character Named Brian Heder."**
      King of the Hill's Stephen Root confirmed on-record (AP News
      interview) that he plays a veteran drug smuggler named Brian
      Heder — the first named actor confirmation for the game, not a
      leak. Score 7 (GameSpot), corroborated across 8 outlets (NME,
      GameRant, Beebom, Dexerto, and more). `source-status: confirmed`.
      Camille Duarte byline (character/culture beat). Same n8n outage
      (placeholder image, no Discord post, no SLA alert; Bluesky queued
      fine). Full log: `audit/2026-09-14-news-scan-articles-log.md`.
- [x] **2026-09-12 midday through 2026-09-13 midday: quiet stretch, 1
      digest article plus 2 more cron stalls.** Nothing scored 7+ across
      roughly 20 scan cycles — mostly 3s and one score-5 leak/blackmail
      item that became the digest article below. Manually re-dispatched
      the news-scan cron twice more (12:32→14:51 on 9/12, 07:52→10:51 on
      9/13, see Urgent for the running stall count) — both resumed clean.
      A GitHub credential-service outage (503, both git and the GitHub
      MCP connector) hit briefly around 08:51 UTC on 9/13 — resolved
      itself within about 35 seconds of retrying, no action needed
      beyond waiting it out.
- [x] **Digest article drafted, 2026-09-12** (see Needs a decision above:
      Rockstar drones/blackmail tribunal testimony).
- [x] **2026-09-11 midday through 2026-09-12 midday: quiet stretch, 2
      digest articles plus 1 more cron stall.** Nothing scored 7+ across
      roughly a dozen scan cycles — mostly 3s and 5s. Manually re-dispatched
      the news-scan cron once more (07:32→10:51 gap, see Urgent for the
      running stall count) — resumed clean, nothing new since. No
      `drafted-links.json` drift this pass.
- [x] **2 digest articles drafted, 2026-09-11** (see Needs a decision
      above: Take-Two stock analysis, Miami ad campaign approval).
- [x] **2026-09-10 midday through 2026-09-11 midday: quiet stretch, 1
      digest article plus 3 more cron stalls.** Nothing scored 7+ across
      roughly 15 scan cycles — mostly 3s and 5s, including duplicate
      coverage of the DualSense pre-order chaos (scalpers on eBay, UK
      live coverage) and the tribunal story, both correctly left to the
      already-published/already-covered pieces rather than redrafted.
      Also caught and fixed the 6th `drafted-links.json` sync-drift (see
      Urgent — dev branch was missing the 9/10 breaking article's
      entries). Manually re-dispatched the news-scan cron 3 more times
      (see Urgent for the running stall count) — all 3 resumed clean.
- [x] **Breaking article published, 2026-09-10: "GTA6 DualSense
      Pre-Orders Went Live Today — And It's Already A Mess."**
      Follow-up to the 9/3 reveal article — pre-orders opened exactly
      on the promised September 10 date, but hit hour-long PS Direct
      queues, checkout errors, and fast sellouts of the Black
      (PS-Direct-exclusive) edition. Score 7 (The Gamer), corroborated
      across 8+ outlets (TechRadar, Tom's Guide, GamesRadar, Engadget,
      and more). `source-status: confirmed`. Julian Ashworth byline —
      same hardware lane as the original reveal. Same n8n outage
      (placeholder image, no Discord post, no SLA alert; Bluesky queued
      fine). Full log: `audit/2026-09-10-news-scan-articles-log.md`.
- [x] **2026-09-09 midday through 2026-09-10 midday: quiet stretch
      overall, one digest article plus 4 more cron stalls, then one
      breaking article.** Nothing else scored 7+ across roughly a
      dozen scan cycles beyond the DualSense pre-order story above —
      mostly 2s and 3s, plus a couple of mistagged items (Blizzard
      union contract, GTA6-vs-console-sales piece) correctly left
      alone. Manually re-dispatched the news-scan cron 4 more times
      (see Urgent for the running stall count) — all 4 resumed clean.
- [x] **2026-09-08 midday through 2026-09-09 midday: quiet stretch, 2
      digest articles plus 4 more cron stalls.** Nothing scored 7+ across
      roughly 15 scan cycles — mostly 3s, a few Zelda/Ocarina-of-Time
      items mistagged with the GTA6 topic and correctly not treated as
      GTA6 news, one score-5 item that was also a mistagged different-
      game sequel. Manually re-dispatched the news-scan cron 4 more times
      (see Urgent for the running stall count) — all 4 resumed clean, one
      of them turning out to be a "fired on time, found nothing but ran a
      routine file-rotation cleanup commit" cycle rather than a report.
- [x] **2026-09-07 midday through 2026-09-08 midday: quiet stretch,
      2 digest articles plus 2 more cron stalls.** Nothing scored 7+
      across roughly a dozen scan cycles — everything topped out at
      score 4 (a regional-launch-timing story, digest routine's to
      handle) or lower. Manually re-dispatched the news-scan cron twice
      more (see Urgent for the running stall count) — both resumed
      clean, no new items either time.
- [x] **2026-09-06 afternoon through 2026-09-07 midday: fully quiet
      stretch, nothing scored 4+ at all, plus 4 more cron stalls.**
      Genuinely nothing worth drafting across roughly 24 hours of scan
      cycles — everything topped out at score 3 (or one score-5 item
      about a different game's Steam launch, correctly not GTA6 news).
      Another extended, genuinely quiet overnight run 9/6-into-9/7 (cron
      firing on schedule, zero new items several cycles running).
      Manually re-dispatched the news-scan cron 4 more times (see Urgent
      for the running stall count) — all 4 resumed clean.
- [x] **2026-09-05 afternoon through 2026-09-06 midday: quiet stretch
      overall, one digest article plus 3 more cron stalls.** Nothing
      else scored 7+ across roughly a dozen more scan cycles. Another
      extended, genuinely quiet overnight run 9/5-into-9/6 (cron firing
      on schedule, zero new items several cycles running). No new
      `drafted-links.json` drift — confirmed in sync (110/110 entries)
      before the YouTube-monetization digest edit. Manually re-dispatched
      the news-scan cron 3 more times (see Urgent for the running stall
      count) — all 3 resumed clean.
- [x] **Digest article drafted, 2026-09-05** (see Needs a decision
      above: YouTube gaming-violence monetization rules).
- [x] **2026-09-04 afternoon through 2026-09-05 midday: quiet stretch
      overall, one digest article plus 3 more cron stalls.** Nothing
      else scored 7+ across roughly a dozen more scan cycles — a few
      more 5s already logged as digest above (Miami marketing), plus an
      extended, genuinely quiet run overnight 9/4-into-9/5 where the
      cron fired on schedule but found zero new items for several
      consecutive cycles in a row. `drafted-links.json` sync-drift
      caught and fixed once (see Urgent — dev was 3 entries behind
      main). Manually re-dispatched the news-scan cron 3 more times
      (see Urgent for the running stall count) — all 3 resumed clean.
- [x] **Digest article drafted, 2026-09-04** (see Needs a decision
      above: Miami officials reject GTA6 marketing tie-in).
- [x] **2026-09-03 evening through 2026-09-04 midday: quiet stretch
      overall, one real breaking story plus 4 more cron stalls.**
      Nothing else scored 7+ across roughly a dozen scan cycles in this
      window — mostly 3s, a few 5s already logged as digest items above.
      `drafted-links.json` stayed in sync throughout (see Urgent — no
      new drift this time). Manually re-dispatched the news-scan cron 4
      times (see Urgent for the full stall count) — all 4 resumed clean,
      two of them turning out to be "fired on time, found nothing" runs
      rather than true stalls once checked against `actions_list`.
- [x] **Breaking article published, 2026-09-03: "Sony Reveals Two
      Limited-Edition GTA6 DualSense Controllers — Pre-Orders Start
      September 10."** Real Sony hardware announcement from September's
      PlayStation State of Play — Black (PlayStation Direct exclusive)
      and White editions, $84.99 each, launching alongside the game
      November 19, pre-orders open September 10. Score 7 (GamesRadar/The
      Gamer), WebFetch to both blocked as usual so corroborated instead
      via WebSearch across 8 additional outlets (TechRadar, Push Square,
      GameRant, DualShockers, PSU, 9to5toys, VGtimes, TechTimes) — all
      matching price/date/editions. `source-status: confirmed`. Julian
      Ashworth byline (hardware beat). Same n8n outage (placeholder
      image); this time also tried direct egress to `discord.com` as a
      fallback for the social-blast/video-SLA steps — also blocked by
      the sandbox proxy, so no Discord path exists at all right now, not
      just an n8n gap. Bluesky queued fine. Full log:
      `audit/2026-09-03-news-scan-articles-log.md`.
- [x] **2 digest articles drafted, 2026-09-03** (see Needs a decision
      above: China censorship, honor-system point-of-no-return). Same
      n8n outage — placeholder images, `drafted-links.json` synced back
      to `main` same session, no drift.
- [x] **2026-09-02/03 (through the prior checklist): quiet stretch, nothing
      scoring 7+ beyond what's already logged.** `drafted-links.json`
      stayed in sync this time (no new drift). Cron mostly healthy;
      one manual re-dispatch on 9/2 after a ~3.5 hour gap, ran clean.
- [x] **2 digest articles drafted, 2026-09-02** (see Needs a decision
      above: Netflix viewership record, leak-hunt suspects narrowed).
      Same n8n outage — placeholder images, `drafted-links.json`
      synced back to `main` same session.
- [x] **2026-09-02 (earlier in the day): quiet news day, nothing
      scoring 7+.** Caught and fixed the 5th `drafted-links.json`
      sync-drift occurrence (see Urgent) and manually re-dispatched
      the news-scan cron once after a ~3.5 hour gap — ran clean,
      nothing new.
- [x] **Breaking article published, 2026-09-01: "No Rest For The
      Wicked, Once Slated To Beat GTA6 By A Month, Delayed To March
      2027."** Moon Studios pushed the RPG's 1.0 out of GTA6's launch
      window (October → March 2027) — but unlike the Fable/Squadron 42
      delays, the studio never cited GTA6 as a reason. Article is
      explicit about that distinction rather than overstating
      causation. Score 7 (PC Gamer), corroborated across 5+ outlets.
      `source-status: reported`. Marcus Webb byline. Same n8n outage
      (placeholder image, no Discord post, no SLA alert; Bluesky
      queued fine). Also marked Eurogamer's "official RP server" story
      (score 7) as duplicate — same NoPixel V beta already covered.
      Full log: `audit/2026-09-01-news-scan-articles-log.md`.
- [x] **New GTA6 screenshots digest article drafted, 2026-09-01** (see
      Needs a decision above).
- [x] **2026-09-01 (earlier in the day): quiet news day, nothing
      scoring 7+ beyond the breaking article above.** A score-4
      subpoena follow-up (Take-Two sealing a more targeted Discord
      subpoena) and a score-3 item are sitting in the queue for the
      next digest-tier pass. Cron healthy all day, no manual
      intervention needed.
- [x] **2 digest articles drafted, 2026-08-31** (see Needs a decision
      above: subpoena-to-X escalation, Clair Obscur easter egg). Same
      n8n outage — placeholder images, `drafted-links.json` synced back
      to `main` same session (88 entries, verified in sync both
      branches).
- [x] **2026-08-31 (earlier in the day): quiet stretch, no breaking or
      digest items scored high enough to draft beyond the 2 above.**
      Operational-only activity: caught and fixed the 4th
      `drafted-links.json` sync-drift occurrence (see Urgent) and
      manually re-dispatched the news-scan cron twice after it went
      quiet for 3.5-4+ hours each time (see Urgent) — both dispatches
      ran clean.
- [x] **Witcher 4 digest article drafted, 2026-08-30 (see Needs a
      decision above).**
- [x] **1 breaking article published + 2 digest articles drafted,
      2026-08-29/30.** Same n8n outage (placeholder image, no Discord
      post, no SLA alert on the breaking one; Bluesky queued fine):
      - **"Rockstar Confirms No Microtransactions Or Generative AI In
        GTA6 At Launch"** (breaking, pushed to `main`, 8/30) — scanner
        scored this only 5 (IGN), overridden to breaking-tier: a
        direct, on-record, named-executive statement (Rob Nelson,
        Rockstar North co-studio head) on the two topics fans care
        about most, corroborated across 8+ outlets plus The New York
        Times. `source-status: confirmed`. Danny Marchetti byline.
      - **"Rockstar Approached Netflix For The Extended Look — Not The
        Other Way Around"** and **"Here's How You Can Already Save $5
        On Your GTA6 Preorder"** (both digest, score 5, held on this
        dev branch, 8/29) — Marcus Webb and Danny Marchetti bylines
        respectively, both `source-status: reported`. This makes 12
        digest articles now queued for review — genuinely worth a
        batch pass, the backlog keeps growing.
      - Also caught and fixed a third `drafted-links.json` sync-drift
        occurrence (79 → 83 entries) — see Urgent, now flagged as
        needing a real process fix rather than repeat correction.
- [x] **2 new digest articles drafted, 2026-08-28** (no breaking-tier
      stories that day — one score-7 item found was just Dexerto's own
      rewrite of the already-published Squadron 42 story, marked
      duplicate). Both held on this dev branch for review, placeholder
      images (n8n outage, see Urgent):
      - **"GTA6 Won't Have First-Person Mode At Launch, Plus New Map
        Size Details"** (score 5) — Rockstar confirmed to preview
        creators there's no dedicated first-person mode at launch;
        separately, a new report compares the map to RDR2/GTA5. Julian
        Ashworth byline, `source-status: reported`.
      - **"Every GTA6 Song Confirmed So Far"** (score 5) — PC Gamer's
        audio-matching breakdown of tracks in the Extended Look
        trailer. Danny Marchetti byline, `source-status: reported`.
      - This makes 10 digest articles now queued for review — genuinely
        worth a batch pass when you have time, the backlog is getting
        long.
      - Also caught and fixed a second sync gap: the dev branch's
        `news-scan/drafted-links.json` had again drifted behind `main`
        (74 vs. 79 entries) — corrected same session.
- [x] **1 more breaking article + 1 digest article published/drafted,
      2026-08-27** (Extended Look premiere day — 92 new RSS items seen
      in one scan). Same n8n outage (placeholder image, no Discord
      post, no SLA alert on the breaking one; Bluesky queued fine):
      - **"Squadron 42 Delayed To 2027 To Avoid 'The Attention Buzz
        Saw Of GTA6'"** (breaking, pushed to `main`) — Cloud Imperium
        Games founder Chris Roberts directly cited GTA6's launch as
        the reason for delaying Squadron 42 to Q2 2027. `source-status:
        confirmed` (on-record quote). Marcus Webb byline — same
        pattern as the Fable and Ananta release-timing pieces.
      - **"Extended Look Day: Studio Scale, Protagonist Switching, And
        Trailer Details"** (digest, score 5, held on this dev branch)
        — consolidated 3 individually-thin facts from today's preview
        coverage (Rockstar doubled team size, protagonist-switching
        mechanic confirmed, trailer runtime/PS5 capture) into one
        piece rather than 3 thin ones. Danny Marchetti byline. This
        makes 8 digest articles now queued for review.
      - Also caught and fixed a real sync gap: the dev branch's
        `news-scan/drafted-links.json` had drifted 9 entries behind
        `main` (a prior digest-routine sync never landed) — corrected
        same session.
- [x] **1 more breaking article + 2 digest articles published/drafted,
      2026-08-26** (in addition to the Ananta and Rockstar-response
      breaking articles listed below). All hit by the same n8n outage
      (placeholder image, no Discord post, no SLA alert; Bluesky queued
      fine):
      - **"GTA6 Preview Confirms In-Game Social Media, Deeper NPCs, And
        Body Mechanics"** (breaking, pushed to `main`) — a sanctioned
        media preview ahead of the Extended Look confirmed several
        long-rumored gameplay systems. `source-status: confirmed`.
        Danny Marchetti byline (neutral generalist).
      - **"NBA 2K27 Teases A GTA6 Crossover Season"** and **"Latest
        GTA6 Leak Shows A Physical Game Store — Ironic For A
        Digital-Only Release"** (both digest, score 5, held on this
        dev branch for review) — Marcus Webb and Ezra Voss bylines
        respectively, both `source-status: reported`. This makes 7
        digest articles now queued for review.
- [x] **2 more breaking articles published, 2026-08-25 and 2026-08-26**
      (both hit by the same n8n outage flagged above — placeholder
      image, no Discord post, no SLA alert either day; Bluesky queued
      fine both times):
      - **"Anime 'GTA Killer' Ananta Confirms Release Date — Just 2
        Months After GTA6"** (8/25) — NetEase officially confirmed a
        January 15, 2027 release date at Gamescom Opening Night Live.
        Score 7 (Polygon), corroborated via WebSearch across 9+
        outlets. `source-status: confirmed` (direct official company
        announcement). Marcus Webb byline. Covered as on-topic via the
        site's existing precedent for covering competitor release
        timing relative to GTA6.
      - **"Rockstar Calls GTA6 Leaks 'Heartbreaking' In First Official
        Response"** (8/26) — Rockstar's first on-record statement
        directly addressing the CyberLeek leaks, quoted word-for-word
        across 6 outlets after WebFetch to the source was blocked.
        Score 7 (Polygon). `source-status: confirmed`. Ezra Voss
        byline. Lands one day ahead of the official Netflix Extended
        Look (8/27) — read as Rockstar getting ahead of the narrative.
- [x] **Caught and fixed a drafted-links.json sync mistake, 2026-08-21.**
      While drafting the subpoena digest article, briefly edited a
      stale copy of `news-scan/drafted-links.json` on this dev branch
      that predated several main-only breaking-tier entries — same
      failure pattern as an earlier incident. Caught via post-commit
      diff inspection before it caused any real duplicate-drafting;
      restored the correct state on both `main` and this branch same
      turn.
- [x] **Another breaking article published, 2026-08-20 evening: "Take-Two
      Loses Billions In Market Value As GTA6 Leaks Keep Coming."**
      Insider Gaming (score 7), corroborated via WebSearch across
      GameSpot/TechPowerUp/Finbold/VGTimes/Tech4Gamers since WebFetch to
      the source was blocked. Dollar figure varies by outlet ($1B–$2.83B)
      so kept at `reported`, not `confirmed`. Marcus Webb byline. Same
      n8n outage (see Urgent) hit this one too — placeholder image, no
      Discord post, no SLA alert; Bluesky queued fine. Full log:
      `audit/2026-08-20-news-scan-articles-log.md`.
- [x] **2 more breaking articles published, 2026-08-19 and 2026-08-20**
      (both hit by the n8n outage flagged above — placeholder image,
      no Discord post, no SLA alert either day, but text/build/social-
      queue unaffected):
      - **"GTA6 Has Already Made $400 Million-Plus From Pre-Orders,
        Analysts Say"** (8/19) — Sensor Tower estimate corroborated
        across 6+ independent outlets, plus Take-Two's own CEO calling
        demand "unprecedented" on the record. `reported`, Marcus Webb.
      - **"GTA6 Leak Escalates: Hacker Now Confirmed To Have A Full
        Playable Build"** (8/20) — 8+ outlets confirmed the leaker has
        actual build access (not just clips), calling it the biggest
        Rockstar/Take-Two breach since 2022. Both scored only 4-5 by
        the keyword heuristic; overrode given the strength of
        cross-source corroboration. `reported`, Ezra Voss. Follow-up
        to (not duplicate of) the 8/18 leak/DMCA article.
- [x] **Breaking article published, 2026-08-18: "GTA6 Gameplay And Full
      Leonida Map Leak Online — Rockstar Fires Back With DMCA
      Takedowns."** News-scan's heuristic scored the underlying story
      only a 3 (hedge words like "apparent"/"seemingly" penalized it),
      but it was a real, well-corroborated story — 8+ independent outlets
      reporting a leaker ("Cyberleek") posting GTA6 gameplay + the full
      map, and Rockstar responding with DMCA takedowns. Overrode the
      score, verified via WebSearch corroboration (direct WebFetch to
      GameSpot/GamesRadar was blocked in-session), pushed live.
      `source-status: reported`, Ezra Voss byline. Posted to Discord +
      queued to Bluesky; X/IG/FB N/A per the Blotato cancellation. The
      video-SLA Discord reminder was skipped again — the only available
      path repeats the exact bug from the 8/14 duplicate-post incident.
      **That gap is still open and needs a real fix** (a dedicated
      Discord-only endpoint, separate from the article-announcement
      webhook) before this step can run safely. Full log:
      `audit/2026-08-18-news-scan-articles-log.md`.
- [x] **Controllers buyer's-guide auto-published, 2026-08-17.**
      `gta6-best-controllers-buyers-guide.html` went out via the standing
      Fri/Sat scheduled-article publisher — both buyer's-guide drafts are
      now live, none left in `drafts/tech/`.
- [x] **Internal redirect fix + CLAUDE.md Blotato update pushed to `main`,
      2026-08-18** — after sitting unpushed for most of the week awaiting
      your go-ahead, you said "push to main" and both went live. Redirect
      fix addresses 8 of 9 GSC "Page with redirect"/"Redirect error"
      flags; CLAUDE.md now correctly reflects Blotato's cancellation as
      the operating brief's source of truth.
- [x] **Gaming headsets buyer's-guide auto-published, 2026-08-15.**
      `gta6-best-gaming-headsets-buyers-guide.html` went out via the
      standing Fri/Sat scheduled-article publisher (Vice Frequency Bot,
      "tech slot") — moved from `drafts/tech/` into `articles/` and
      queued to social automatically. No action needed; the controllers
      guide is still sitting in drafts, unaffected by this.
- [x] **2 breaking news-scan articles published, 2026-08-14.** Take-Two
      declining to share raw GTA6 pre-order numbers (PC Gamer), and
      Rockstar/NoPixel V GTA Online roleplay beta news (GamesRadar). See
      Needs-a-decision above for the 3 digest-tier companions still
      awaiting approval.
- [x] **Google Safe Browsing "Deceptive pages" flag fixed, 2026-08-12.**
      AdSense removed sitewide (109 files) as the root cause — no code-level
      compromise found, pattern matched known AdSense-malvertising cases.
      Confirmed resolved via Google's own "Review successful" email.
- [x] **UTM attribution dashboard + Facebook Group launch, 2026-08-12.**
      New UTM breakdown section in `admin.html` (source + referred-by,
      pulling updated fields from the `Admin - List Signups` n8n webhook).
      New "GTA6 Community — The Last Drive" Facebook Group wired sitewide
      (index.html icon rows, lastdrive.html CTA button); rules, description,
      membership questions, welcome post, and cross-posting materials
      drafted for the group itself.
- [x] **External site audit's 48-hour safety/trust list, 2026-08-11.**
      Rewrote the Survival Guide PDF to drop unsafe sleep-deprivation/
      energy-drink advice; removed unsupported "join thousands" claims (41
      files) and unsupported GTA6-specific PC performance claims on Gear;
      Leaderboard now shows an honest empty state instead of fake rows;
      six-editions leak article got an UPDATE banner + Source Status box
      (establishing the pattern for future corrections); fixed a stray
      dead `/gtacon` link; reconciled "Wall of Honor forever" copy with
      the real terms. Full audit: `audit/2026-08-11-external-site-audit.md`,
      fixes: commit `9b8f714`.
- [x] **Editorial/corrections policy page + Last Drive post-signup flow,
      2026-08-11.** New public editorial standards page; post-signup
      actions added to the Last Drive signup flow.
- [x] **Referral attribution wired end-to-end, 2026-08-11-12.** Frontend +
      n8n backend now capture `utm_source` on Last Drive signups and log
      referred-by, feeding the new UTM dashboard above.
- [x] **Homepage hero swapped to Last Drive CTA, 2026-08-11.** Per the
      external audit's recommendation — replaced the video hero with a
      Last Drive-focused call-to-action hero.
- [x] **Bluesky real-time posting gap fixed, 2026-08-11** (social pipeline
      audit finding). Named staff-writer bylines also retired the generic
      "News Desk" default around the same time.
- [x] **Instagram cadence reduced after repeat anti-spam failures,
      2026-08-12.** Evergreen Recycle Poster's IG posting removed entirely
      (kept X + Facebook); Last Drive Push left as the sole recurring IG
      source at 2x/day per your instruction to step down gradually.
- [x] **Gmail connector wrong-account mixup resolved, 2026-08-12** —
      confirmed working against `forgedoakstudios@gmail.com`. (Superseded
      by the decision above: moving Gmail cleanup to native filters instead
      of repeat connector reconnects.)
- [x] **`/streams` watch page + sitewide "Watch" nav + Last Drive Push
      auto-ramp, 2026-08-10.** New `streams.html`: browsable streamer grid
      pulling the same `LastDrive - List Streamers` data as the homepage;
      Twitch/Kick play inline via embedded iframe (stays on-site), YouTube/
      Facebook Gaming open in a clearly-labeled new tab. "Watch" added to
      nav across 111 files. Same session: `Last Drive Push` renamed to
      **"ramping to launch"** — auto-scales from 2 slots/day today to 6
      slots/day by ~10/24, landing total posting volume at ~99/week. Full
      detail: `audit/2026-08-10-90-day-push-ramp-and-streams-page.md`.
      *(See Urgent — this shipped to `main` same-day without a documented
      approval step.)*
- [x] **Now Featuring streamer cards + screenshot upload + permanent Last
      Drive promo tile, 2026-08-10.**
- [x] **lastdrive.html: Facebook event + Discord CTA + streamer signups,
      2026-08-10.**
- [x] **Amazon Associates tag swapped sitewide, 2026-08-10.**
- [x] **Blotato silent post-failure blind spot closed, 2026-08-10.** n8n
      now confirms Blotato actually published, not just accepted the post;
      pings Discord on real failures. Writeup:
      `audit/2026-08-10-blotato-post-failure-blind-spot.md`.
- [x] **Stale "Store paused until August 1" banner removed, 2026-08-10.**
- [x] **gear.html affiliate links fully fixed, 2026-08-10.**
- [x] **Airtable token fully removed sitewide, 2026-08-10.**
- [x] **Live secret exposure found and fixed, 2026-08-09.**
- [x] **PayPal purchase verification fixed and verified, 2026-08-07.**
- [x] **Take-Two Q1 FY2027 earnings call article written and published,
      2026-08-07.**
- [x] **Netflix GTA6 Extended Look announcement covered, 2026-08-06.**
- [x] **Fri/Sat scheduled articles moved to a dedicated `scheduled/`
      folder + n8n-backed publisher, 2026-08-06.**
- [x] **news-scan hanging indefinitely on a slow/unresponsive RSS feed —
      fixed, 2026-08-06.**
- [x] **Leaderboard linked sitewide + visual streak calendar + newsletter
      disclosure, 2026-08-06.**
- [x] Ratings/comments fully migrated off client-side Airtable, 2026-08-05.
- [x] All 82 pages retrofit onto a shared share-bar component, 2026-08-05.
- [x] Sitewide image compression, 2026-08-05 — 465MB → 219MB.
- [x] Admin login auth bypass fixed + index/leaderboard/wall migrated off
      Airtable, 2026-08-05.
- [x] Daily check-in loyalty system shipped, 2026-08-06.
- [x] Airtable Personal Access Token rotated, 2026-08-03.
- [x] `STORE_MAINTENANCE` flipped off + Airtable quota reset/import
      complete, 2026-08-02.

## Carried over from this week (not yet done)

- [ ] Review the n8n migration's 3 field fixes (linkedSlot order,
      founder-plate logic, joinStatus/approval flow) — my best read of the
      real code, not confirmed with you.
- [ ] Supermetrics: on hold indefinitely per Chris.
- [ ] Media Gallery for the empty space on the home page.
- [ ] GTA6 Guide template.
- [ ] Forum Discord section — replace generic image with real one.
