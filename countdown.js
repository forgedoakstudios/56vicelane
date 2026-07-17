/* ============================================================
   56ViceLane — shared launch countdown
   Markup: any element with data-countdown="ISO-DATETIME" containing
   [data-d] [data-h] [data-m] [data-s] cells (same contract as the
   Dusk Mix vfCountdown, so markup is portable between systems).
   Include with: <script src="/countdown.js" defer></script>
   ============================================================ */
(function () {
  function pad(n) { return String(n).padStart(2, '0'); }
  function init() {
    document.querySelectorAll('[data-countdown]').forEach(function (el) {
      var target = new Date(el.getAttribute('data-countdown') || '2026-11-19T00:00:00-05:00').getTime();
      var cells = {
        d: el.querySelector('[data-d]'), h: el.querySelector('[data-h]'),
        m: el.querySelector('[data-m]'), s: el.querySelector('[data-s]')
      };
      function tick() {
        var diff = Math.max(0, target - Date.now());
        if (cells.d) cells.d.textContent = Math.floor(diff / 86400000);
        if (cells.h) cells.h.textContent = pad(Math.floor(diff / 3600000) % 24);
        if (cells.m) cells.m.textContent = pad(Math.floor(diff / 60000) % 60);
        if (cells.s) cells.s.textContent = pad(Math.floor(diff / 1000) % 60);
      }
      tick();
      setInterval(tick, 1000);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
