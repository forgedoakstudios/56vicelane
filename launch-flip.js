/* ============================================================
   56ViceLane — launch-day flip switch.
   At GTA6's actual launch, every Last-Drive-era countdown and CTA
   across the site swaps to post-launch messaging automatically --
   no manual per-page edit needed on launch night. Safe to include
   on any page; does nothing before the target time, and does
   nothing on a page with none of the elements below.
   ============================================================ */
(function () {
  var LAUNCH = new Date('2026-11-19T00:00:00-05:00').getTime();
  if (Date.now() < LAUNCH) return;

  // Countdown bar (homepage + anywhere else using /countdown.js's markup)
  // -> a simple "it's out" banner instead of a timer stuck at zero.
  document.querySelectorAll('.countdown-bar').forEach(function (bar) {
    bar.innerHTML = '<div class="countdown-inner" style="justify-content:center;">' +
      '<div class="countdown-label">🎮 GTA6 Is Out Now — <a href="/news">See What\'s Happening</a></div>' +
      '</div>';
  });

  // Homepage "until GTA6 launches" welcome tagline
  document.querySelectorAll('.welcome-text p').forEach(function (p) {
    if (/until GTA6 launches/i.test(p.textContent)) {
      p.textContent = "The community's home for everything GTA6, now that it's finally here.";
    }
  });

  // Shared Last Drive CTA box, hardcoded into every article that has one --
  // becomes a clips/hidden-finds submission call once the event is past.
  document.querySelectorAll('.lastdrive-cta').forEach(function (box) {
    box.innerHTML = '<h3>📼 Got A Clip Or A Hidden Find?</h3>' +
      '<p>Send us your best GTA6 moments — clips, hidden easter eggs, early discoveries. We might feature it on the site.</p>' +
      '<a href="https://discord.gg/ewdRcjsbg5" target="_blank" rel="noopener">Submit In Discord →</a>';
  });

  // Homepage hero -- same CTA pattern as above, different markup since it's
  // the full hero section rather than the smaller inline box.
  var heroWord = document.querySelector('.hero-word');
  if (heroWord && /Last Night In Los Santos/i.test(heroWord.textContent)) {
    var heroEyebrow = document.querySelector('.hero-eyebrow');
    var heroSub = document.querySelector('.hero-sub');
    var heroCtas = document.querySelector('.hero-ctas');
    if (heroEyebrow) heroEyebrow.textContent = 'GTA6 Is Out Now';
    heroWord.textContent = 'Got A Clip Or A Hidden Find?';
    if (heroSub) heroSub.textContent = 'Send us your best GTA6 moments — clips, hidden easter eggs, early discoveries. We might feature it on the site.';
    if (heroCtas) heroCtas.innerHTML =
      '<a href="https://discord.gg/ewdRcjsbg5" target="_blank" rel="noopener" class="hero-cta-primary">Submit In Discord</a>' +
      '<a href="/news" class="hero-cta-secondary">See What\'s Happening</a>';
  }
})();
