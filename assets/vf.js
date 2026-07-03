/* ============================================================
   56VICELANE — shared behaviors (vf.js)
   Every function is defined here; nothing in a load event calls
   an undefined function (see JS error-prevention rule).
   ============================================================ */

/* ---------- mobile nav ---------- */
function vfNav () {
  var t = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!t || !links) return;
  t.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* ---------- scroll reveals ---------- */
function vfReveal () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
}

/* ---------- ticker: articles.json headlines, static fallback ---------- */
function vfTicker () {
  var track = document.querySelector('.ticker-track');
  if (!track) return;
  fetch('/articles.json')
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (data) {
      var list = Array.isArray(data) ? data : (data.articles || []);
      if (!list.length) return;
      var html = list.slice(0, 10).map(function (a) {
        var title = a.title || a.headline || '';
        var url = a.url || a.link || '#';
        return '<span><a href="' + url + '">' + title + '</a></span>';
      }).join('');
      track.innerHTML = html + html; /* doubled for seamless loop */
    })
    .catch(function () { /* keep the static fallback markup */ });
}

/* ---------- launch countdown → Nov 19 2026 ---------- */
function vfCountdown () {
  var el = document.querySelector('[data-countdown]');
  if (!el) return;
  var target = new Date(el.getAttribute('data-countdown') || '2026-11-19T00:00:00-05:00').getTime();
  var cells = {
    d: el.querySelector('[data-d]'), h: el.querySelector('[data-h]'),
    m: el.querySelector('[data-m]'), s: el.querySelector('[data-s]')
  };
  function pad (n) { return String(n).padStart(2, '0'); }
  function tickDown () {
    var diff = Math.max(0, target - Date.now());
    var d = Math.floor(diff / 86400000);
    var h = Math.floor(diff / 3600000) % 24;
    var m = Math.floor(diff / 60000) % 60;
    var s = Math.floor(diff / 1000) % 60;
    if (cells.d) cells.d.textContent = d;
    if (cells.h) cells.h.textContent = pad(h);
    if (cells.m) cells.m.textContent = pad(m);
    if (cells.s) cells.s.textContent = pad(s);
  }
  tickDown();
  setInterval(tickDown, 1000);
}

/* ---------- latest articles feed (homepage / news) ---------- */
function vfFeed () {
  var host = document.querySelector('[data-feed]');
  if (!host) return;
  var limit = parseInt(host.getAttribute('data-feed'), 10) || 6;
  fetch('/articles.json')
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(function (data) {
      var list = Array.isArray(data) ? data : (data.articles || []);
      if (!list.length) return;
      host.innerHTML = list.slice(0, limit).map(function (a) {
        var title = a.title || a.headline || 'Untitled';
        var url = a.url || a.link || '#';
        var date = a.date || a.datePublished || '';
        var cat = a.category || a.tag || 'News';
        var desc = a.description || a.summary || '';
        return '' +
          '<article class="card reveal">' +
            '<div class="card-hero"><div class="art art-auto"></div></div>' +
            '<span class="eyebrow">' + cat + '</span>' +
            '<h3><a href="' + url + '" style="color:inherit">' + title + '</a></h3>' +
            '<p>' + desc + '</p>' +
            '<div class="meta mt-1"><span>' + date + '</span></div>' +
          '</article>';
      }).join('');
      vfReveal();
      vfAutoArt();
    })
    .catch(function () { /* leave any static cards in place */ });
}

/* ---------- generated card art (no external images needed) ---------- */
function vfAutoArt () {
  var hues = [
    ['#FF6F61', '#4A1E63'], ['#3BF3DF', '#1C0F32'],
    ['#FFA26B', '#2A1245'], ['#B79BE8', '#120A1E']
  ];
  document.querySelectorAll('.art-auto').forEach(function (el, i) {
    var p = hues[i % hues.length];
    el.style.background =
      'radial-gradient(90% 120% at 20% 110%, ' + p[0] + '55 0%, transparent 60%),' +
      'radial-gradient(70% 90% at 85% -10%, ' + p[0] + '33 0%, transparent 55%),' +
      'linear-gradient(150deg, ' + p[1] + ', #120A1E)';
  });
}

/* ---------- boot ---------- */
window.addEventListener('DOMContentLoaded', function () {
  vfNav();
  vfReveal();
  vfTicker();
  vfCountdown();
  vfFeed();
  vfAutoArt();
});
