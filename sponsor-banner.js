/* sponsor-banner.js — sitewide persistent sponsor card.
   Fully self-contained (inline styles, no CSS file dependency) so it
   looks identical on every page regardless of which design system that
   page uses. Reads /sponsors.json at runtime -- add, remove, or toggle
   a sponsor by editing that file, no code changes needed here.
   Positioned bottom-LEFT (loyalty-banner.js and back-to-top.js both
   live bottom-right) so nothing stacks or overlaps.
   Include with: <script src="/sponsor-banner.js" defer></script> */
(function () {
  var SPONSORS_URL = '/sponsors.json';
  var DELAY_MS = 4000;
  var DISMISS_KEY_PREFIX = '56vl-sponsor-dismissed-';

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function pickSponsor(list) {
    var active = (list || []).filter(function (s) { return s && s.active && s.name && s.url; });
    if (!active.length) return null;
    return active[Math.floor(Math.random() * active.length)];
  }

  function render(sponsor) {
    var dismissKey = DISMISS_KEY_PREFIX + sponsor.id + '-' + todayKey();
    try {
      if (sessionStorage.getItem(dismissKey)) return;
    } catch (e) {}

    var style = document.createElement('style');
    style.textContent =
      '.vl-sponsor-card{position:fixed;z-index:9998;bottom:18px;left:18px;max-width:300px;' +
      'background:#17130F;border:1px solid rgba(214,36,122,.35);border-radius:10px;padding:14px 16px;' +
      'box-shadow:0 8px 28px rgba(0,0,0,.45);font-family:"Barlow Condensed",sans-serif;color:#F0E6DA;' +
      'transform:translateY(20px);opacity:0;transition:transform .35s ease,opacity .35s ease;}' +
      '.vl-sponsor-card.vl-show{transform:translateY(0);opacity:1;}' +
      '.vl-sponsor-label{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#8A8078;margin-bottom:8px;}' +
      '.vl-sponsor-body{display:flex;gap:10px;align-items:center;}' +
      '.vl-sponsor-img{width:48px;height:48px;border-radius:6px;object-fit:cover;flex-shrink:0;background:#0F0C09;}' +
      '.vl-sponsor-text{min-width:0;}' +
      '.vl-sponsor-name{font-weight:800;font-size:.92rem;color:#F0E6DA;line-height:1.2;}' +
      '.vl-sponsor-tagline{font-size:.75rem;color:#B5AFA6;line-height:1.3;margin-top:2px;}' +
      '.vl-sponsor-cta{display:inline-block;margin-top:10px;padding:7px 14px;border-radius:6px;' +
      'background:linear-gradient(135deg,#FF6B2C,#D6247A);color:#fff;font-weight:800;font-size:.78rem;' +
      'text-transform:uppercase;letter-spacing:.04em;text-decoration:none;}' +
      '.vl-sponsor-close{position:absolute;top:6px;right:8px;background:none;border:none;color:#6b6259;' +
      'font-size:1rem;cursor:pointer;line-height:1;padding:2px 4px;}' +
      '.vl-sponsor-close:hover{color:#F0E6DA;}';
    document.head.appendChild(style);

    var card = document.createElement('div');
    card.className = 'vl-sponsor-card';
    card.innerHTML =
      '<button class="vl-sponsor-close" aria-label="Dismiss">&times;</button>' +
      '<div class="vl-sponsor-label">Sponsored</div>' +
      '<div class="vl-sponsor-body">' +
      (sponsor.image ? '<img class="vl-sponsor-img" src="' + sponsor.image + '" alt="' + sponsor.name + '">' : '') +
      '<div class="vl-sponsor-text">' +
      '<div class="vl-sponsor-name">' + sponsor.name + '</div>' +
      '<div class="vl-sponsor-tagline">' + (sponsor.tagline || '') + '</div>' +
      '</div></div>' +
      '<a class="vl-sponsor-cta" href="' + sponsor.url + '" target="_blank" rel="noopener sponsored">' + (sponsor.cta || 'Check Price') + ' &rarr;</a>';

    document.body.appendChild(card);
    card.querySelector('.vl-sponsor-close').onclick = function () {
      card.classList.remove('vl-show');
      try { sessionStorage.setItem(dismissKey, '1'); } catch (e) {}
      setTimeout(function () { card.remove(); }, 350);
    };
    requestAnimationFrame(function () {
      setTimeout(function () { card.classList.add('vl-show'); }, 20);
    });
  }

  function init() {
    fetch(SPONSORS_URL + '?v=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (list) {
        var sponsor = pickSponsor(list);
        if (sponsor) render(sponsor);
      })
      .catch(function () {});
  }

  setTimeout(init, DELAY_MS);
})();
