/* loyalty-banner.js — daily check-in + the three loyalty cards.
   1. Known returning visitor, streak intact: fires the daily check-in
      silently, shows a personal "Welcome back, TAG! Day X streak" card.
   2. Known returning visitor who just missed a day: a "streak freeze"
      card instead -- watch the embedded video for WATCH_SECONDS before
      "Restore My Streak" unlocks (same pattern mobile games use for
      rewarded-ad claims: the button is disabled until real time has
      passed, not just an honor-system click). Once per ISO week per the
      server-side cap in Player - Recover Streak.
   3. Anyone else (no gamertag known yet): a one-time "Loyalty rewards are
      now live" announcement, dismissible, never shown again once closed.
   All three fire ~5s after page load, not immediately.

   RECOVERY_VIDEO_ID is a placeholder (the landscape hero cut) until the
   vertical/Shorts video is uploaded -- swap it then, it's the one thing
   in this file that's meant to change. */
(function () {
  var CHECKIN_URL = 'https://n8n.56vicelane.com/webhook/player-check-in';
  var RECOVER_URL = 'https://n8n.56vicelane.com/webhook/player-recover-streak';
  var SUBSCRIBE_URL = 'https://n8n.56vicelane.com/webhook/subscribe-email';
  var RECOVERY_VIDEO_ID = 'Ni80PfNIWrM'; // TODO: swap to the vertical Shorts cut once uploaded
  var WATCH_SECONDS = 15;
  var DELAY_MS = 5000;
  var DISMISS_KEY = '56vl-loyalty-announced';
  var SESSION_KEY = '56vl-welcome-shown';

  var CSS = '.vl-loyalty-card{position:fixed;z-index:9999;bottom:18px;right:18px;max-width:320px;' +
    'background:#17130F;border:1px solid rgba(255,183,77,.4);border-radius:10px;padding:16px 18px;' +
    'box-shadow:0 8px 28px rgba(0,0,0,.45);font-family:"Barlow Condensed",sans-serif;color:#F0E6DA;' +
    'transform:translateY(20px);opacity:0;transition:transform .35s ease,opacity .35s ease;}' +
    '.vl-loyalty-card.vl-show{transform:translateY(0);opacity:1;}' +
    '.vl-loyalty-card.vl-recovery{max-width:300px;}' +
    '.vl-loyalty-title{font-weight:800;text-transform:uppercase;letter-spacing:.06em;font-size:.95rem;color:#FFB74D;margin-bottom:6px;}' +
    '.vl-loyalty-body{font-size:.88rem;line-height:1.4;color:#F0E6DA;margin-bottom:0;}' +
    '.vl-loyalty-body a{color:#FFB74D;}' +
    '.vl-loyalty-close{position:absolute;top:8px;right:10px;background:none;border:none;color:#8A8078;font-size:1.1rem;cursor:pointer;line-height:1;padding:2px 4px;}' +
    '.vl-loyalty-close:hover{color:#F0E6DA;}' +
    '.vl-recovery-video{width:100%;aspect-ratio:16/9;border-radius:6px;overflow:hidden;margin:10px 0;background:#000;}' +
    '.vl-recovery-video iframe{width:100%;height:100%;border:0;}' +
    '.vl-recovery-btn{width:100%;padding:10px;border-radius:6px;border:none;font-family:"Barlow Condensed",sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:.04em;font-size:.82rem;cursor:pointer;background:linear-gradient(135deg,#FF6B2C,#FF2D78);color:#fff;}' +
    '.vl-recovery-btn:disabled{background:#3A332C;color:#8A8078;cursor:default;}' +
    '.vl-recovery-status{font-size:.78rem;color:#8A8078;margin-top:6px;text-align:center;}' +
    '.vl-email-form{display:flex;gap:6px;margin-top:10px;}' +
    '.vl-email-input{flex:1;min-width:0;background:#0F0C09;border:1px solid rgba(255,183,77,.35);border-radius:6px;padding:9px 10px;color:#F0E6DA;font-family:"Barlow Condensed",sans-serif;font-size:.85rem;}' +
    '.vl-email-input::placeholder{color:#6b6259;}' +
    '.vl-email-input:focus{outline:none;border-color:#FFB74D;}' +
    '.vl-email-submit{flex-shrink:0;padding:9px 14px;border-radius:6px;border:none;font-family:"Barlow Condensed",sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:.04em;font-size:.78rem;cursor:pointer;background:linear-gradient(135deg,#FF6B2C,#FF2D78);color:#fff;}' +
    '.vl-email-submit:disabled{background:#3A332C;color:#8A8078;cursor:default;}' +
    '.vl-email-status{font-size:.78rem;color:#8A8078;margin-top:6px;}' +
    '.vl-email-status.vl-ok{color:#00C875;}' +
    '@media(max-width:480px){.vl-loyalty-card{left:12px;right:12px;max-width:none;bottom:12px;}}';

  function injectCss() {
    if (document.getElementById('vl-loyalty-style')) return;
    var style = document.createElement('style');
    style.id = 'vl-loyalty-style';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function showCard(innerHtml, autoFadeMs, extraClass) {
    injectCss();
    var card = document.createElement('div');
    card.className = 'vl-loyalty-card' + (extraClass ? ' ' + extraClass : '');
    card.innerHTML = '<button class="vl-loyalty-close" aria-label="Dismiss">&times;</button>' + innerHtml;
    document.body.appendChild(card);
    requestAnimationFrame(function () { card.classList.add('vl-show'); });

    function dismiss() {
      card.classList.remove('vl-show');
      setTimeout(function () { card.remove(); }, 400);
    }
    card.querySelector('.vl-loyalty-close').addEventListener('click', dismiss);
    if (autoFadeMs) setTimeout(dismiss, autoFadeMs);
    return card;
  }

  function gamertag() {
    try { return (localStorage.getItem('56vl-gamertag') || '').trim(); }
    catch (e) { return ''; }
  }

  function showWelcomeBack(tag, streakCount) {
    try { if (sessionStorage.getItem(SESSION_KEY)) return; sessionStorage.setItem(SESSION_KEY, '1'); }
    catch (e) {}
    var streakLine = streakCount > 1
      ? '🔥 Day ' + streakCount + ' streak — keep it going.'
      : 'Glad you\'re back on the road.';
    showCard(
      '<div class="vl-loyalty-title">Welcome Back, ' + tag.toUpperCase() + '</div>' +
      '<div class="vl-loyalty-body">' + streakLine + '</div>',
      8000
    );
  }

  function showRecoveryCard(tag, brokenStreakValue) {
    try { if (sessionStorage.getItem(SESSION_KEY)) return; sessionStorage.setItem(SESSION_KEY, '1'); }
    catch (e) {}
    var card = showCard(
      '<div class="vl-loyalty-title">Sorry, You Missed Check-In</div>' +
      '<div class="vl-loyalty-body">Watch this to get your ' + brokenStreakValue + '-day streak back (once a week):</div>' +
      '<div class="vl-recovery-video"><iframe src="https://www.youtube.com/embed/' + RECOVERY_VIDEO_ID + '?autoplay=1&mute=0&modestbranding=1&rel=0&playsinline=1" title="56ViceLane" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>' +
      '<button class="vl-recovery-btn" id="vl-recovery-btn" disabled>Watching&hellip; ' + WATCH_SECONDS + 's</button>' +
      '<div class="vl-recovery-status" id="vl-recovery-status"></div>',
      null,
      'vl-recovery'
    );

    var btn = card.querySelector('#vl-recovery-btn');
    var status = card.querySelector('#vl-recovery-status');
    var remaining = WATCH_SECONDS;
    var timer = setInterval(function () {
      remaining--;
      if (remaining <= 0) {
        clearInterval(timer);
        btn.disabled = false;
        btn.textContent = '🔥 Restore My Streak';
      } else {
        btn.textContent = 'Watching… ' + remaining + 's';
      }
    }, 1000);

    btn.addEventListener('click', function () {
      btn.disabled = true;
      btn.textContent = 'Restoring…';
      fetch(RECOVER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gamertag: tag })
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.recovered) {
            btn.textContent = '✅ Streak Restored — Day ' + d.streakCount;
            status.textContent = '';
          } else {
            btn.textContent = 'Could Not Restore';
            status.textContent = d.reason === 'already_used_this_week'
              ? 'Already used your recovery this week.'
              : 'Try checking in again first.';
          }
        })
        .catch(function () {
          btn.textContent = 'Something Went Wrong';
        });
    });
  }

  function showLoyaltyAnnouncement() {
    try { if (localStorage.getItem(DISMISS_KEY)) return; } catch (e) {}
    var card = showCard(
      '<div class="vl-loyalty-title">🎁 Loyalty Rewards Are Now Live</div>' +
      '<div class="vl-loyalty-body">Earn free nameplates by checking in daily — more prizes coming soon. Drop your email, we\'ll let you know the moment new rewards go live.</div>' +
      '<form class="vl-email-form" id="vl-email-form">' +
        '<input type="email" class="vl-email-input" id="vl-email-input" placeholder="you@email.com" required>' +
        '<button type="submit" class="vl-email-submit">Join</button>' +
      '</form>' +
      '<div class="vl-email-status" id="vl-email-status"></div>' +
      '<div class="vl-loyalty-body" style="margin-top:8px;font-size:.78rem;"><a href="/lastdrive">Already going to The Last Drive? Sign up here &rarr;</a></div>'
    );
    card.querySelector('.vl-loyalty-close').addEventListener('click', function () {
      try { localStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
    });

    var form = card.querySelector('#vl-email-form');
    var input = card.querySelector('#vl-email-input');
    var status = card.querySelector('#vl-email-status');
    var submitBtn = form.querySelector('.vl-email-submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = input.value.trim();
      if (!email) return;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Joining…';
      status.className = 'vl-email-status';
      status.textContent = '';
      fetch(SUBSCRIBE_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, source: 'loyalty-banner', gamertag: gamertag() })
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.success) {
            form.style.display = 'none';
            status.className = 'vl-email-status vl-ok';
            status.textContent = d.alreadySubscribed ? "You're already on the list." : "You're in! We'll email you when new rewards drop.";
            try { localStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
          } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Join';
            status.textContent = 'That email didn\'t look right — try again.';
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Join';
          status.textContent = 'Something went wrong — try again.';
        });
    });
  }

  setTimeout(function () {
    var tag = gamertag();
    if (!tag) { showLoyaltyAnnouncement(); return; }
    fetch(CHECKIN_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gamertag: tag })
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.justBroke) showRecoveryCard(tag, d.brokenStreakValue);
        else showWelcomeBack(tag, d.streakCount || 1);
      })
      .catch(function () {});
  }, DELAY_MS);
})();
