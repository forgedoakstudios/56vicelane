/* article-sponsor-rail.js — desktop-only sponsor side-rail for article pages.
   Fully self-contained (inline styles, no CSS file dependency) so it looks
   identical regardless of which article template's own CSS is in play.
   Distinct from sponsor-banner.js (the sitewide bottom-left toast) -- this
   is a fixed rail in the right margin, shown once per article page, only
   on viewports wide enough to not overlap the centered article column
   (article-wrap maxes out around 780px everywhere, so anything 1300px+
   has real margin to work with). Reads /sponsors.json at runtime.
   Include with: <script src="/article-sponsor-rail.js" defer></script> */
(function () {
  var SPONSORS_URL = '/sponsors.json';
  var MIN_WIDTH = 1300;

  if (window.innerWidth < MIN_WIDTH) return;
  if (document.getElementById('vl-sponsor-rail')) return;

  function pickSponsor(list) {
    var active = (list || []).filter(function (s) { return s && s.active && s.name && s.url; });
    if (!active.length) return null;
    return active[Math.floor(Math.random() * active.length)];
  }

  function render(sponsor) {
    var style = document.createElement('style');
    style.textContent =
      '.vl-sponsor-rail{position:fixed;z-index:150;top:155px;right:24px;width:220px;' +
      'background:#17130F;border:1px solid rgba(214,36,122,.35);border-radius:10px;padding:16px;' +
      'box-shadow:0 8px 24px rgba(0,0,0,.35);font-family:"Barlow Condensed",sans-serif;color:#F0E6DA;' +
      'opacity:0;transform:translateX(12px);transition:opacity .4s ease,transform .4s ease;}' +
      '.vl-sponsor-rail.vl-show{opacity:1;transform:translateX(0);}' +
      '.vl-sponsor-rail-label{font-size:.66rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#8A8078;margin-bottom:10px;}' +
      '.vl-sponsor-rail-img{width:100%;aspect-ratio:1/1;border-radius:6px;object-fit:cover;background:#0F0C09;margin-bottom:10px;display:block;}' +
      '.vl-sponsor-rail-name{font-weight:800;font-size:.95rem;color:#F0E6DA;line-height:1.25;margin-bottom:4px;}' +
      '.vl-sponsor-rail-tagline{font-size:.76rem;color:#B5AFA6;line-height:1.35;margin-bottom:12px;}' +
      '.vl-sponsor-rail-cta{display:block;text-align:center;padding:8px 10px;border-radius:6px;' +
      'background:linear-gradient(135deg,#FF6B2C,#D6247A);color:#fff;font-weight:800;font-size:.76rem;' +
      'text-transform:uppercase;letter-spacing:.04em;text-decoration:none;}' +
      '@media(max-width:1300px){.vl-sponsor-rail{display:none;}}';
    document.head.appendChild(style);

    var rail = document.createElement('div');
    rail.id = 'vl-sponsor-rail';
    rail.className = 'vl-sponsor-rail';
    rail.innerHTML =
      '<div class="vl-sponsor-rail-label">Sponsored</div>' +
      (sponsor.image ? '<img class="vl-sponsor-rail-img" src="' + sponsor.image + '" alt="' + sponsor.name + '">' : '') +
      '<div class="vl-sponsor-rail-name">' + sponsor.name + '</div>' +
      '<div class="vl-sponsor-rail-tagline">' + (sponsor.tagline || '') + '</div>' +
      '<a class="vl-sponsor-rail-cta" href="' + sponsor.url + '" target="_blank" rel="noopener sponsored">' + (sponsor.cta || 'Check Price') + ' &rarr;</a>';

    document.body.appendChild(rail);
    requestAnimationFrame(function () {
      setTimeout(function () { rail.classList.add('vl-show'); }, 20);
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

  init();
})();
