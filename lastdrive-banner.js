/* Site-wide Last Drive announcement banner. Fades in ~1.5s after load,
   holds ~10s, fades out, then cycles in/out roughly every 10s to keep
   nudging urgency toward the Nov 18 event. Dismissible for the session. */
(function () {
  if (sessionStorage.getItem('ld-banner-off')) return;

  var LAST_DRIVE = new Date('2026-11-18T20:00:00-06:00').getTime();
  var days = Math.max(0, Math.ceil((LAST_DRIVE - Date.now()) / 86400000));
  var urgency = days <= 0 ? 'It’s tonight.' :
                days === 1 ? 'Tomorrow night.' :
                days <= 14 ? 'Only ' + days + ' days left.' :
                days + ' days out — don’t get left behind.';

  var css = document.createElement('style');
  css.textContent =
    '.ld-banner{position:fixed;left:50%;bottom:18px;transform:translate(-50%,24px);max-width:94%;' +
    'background:linear-gradient(135deg,#D6247A,#FF6B2C);color:#fff;font-family:"Barlow Condensed",sans-serif;' +
    'border-radius:12px;box-shadow:0 10px 28px rgba(0,0,0,.32);padding:11px 14px;display:flex;align-items:center;' +
    'gap:12px;z-index:900;opacity:0;pointer-events:none;transition:opacity .6s ease,transform .6s ease;}' +
    '.ld-banner.show{opacity:1;transform:translate(-50%,0);pointer-events:auto;}' +
    '.ld-banner a{color:#fff;text-decoration:none;font-size:.95rem;letter-spacing:.3px;line-height:1.3;}' +
    '.ld-banner a strong{font-weight:800;text-transform:uppercase;letter-spacing:.5px;}' +
    '.ld-banner .ld-cta{text-decoration:underline;font-weight:700;white-space:nowrap;}' +
    '.ld-close{background:rgba(255,255,255,.22);border:none;color:#fff;width:24px;height:24px;border-radius:50%;' +
    'cursor:pointer;font-size:15px;line-height:1;flex-shrink:0;}' +
    '.ld-close:hover{background:rgba(255,255,255,.4);}';
  document.head.appendChild(css);

  var bar = document.createElement('div');
  bar.className = 'ld-banner';
  bar.innerHTML =
    '<a href="/lastdrive">🏁 <strong>The Last Drive · Nov 18</strong> — ' + urgency +
    ' One final night in GTA5 before GTA6 changes everything. <span class="ld-cta">Claim your spot free →</span></a>' +
    '<button class="ld-close" aria-label="Dismiss">×</button>';
  document.body.appendChild(bar);

  var closed = false;
  bar.querySelector('.ld-close').addEventListener('click', function () {
    closed = true;
    bar.classList.remove('show');
    sessionStorage.setItem('ld-banner-off', '1');
  });

  function cycle() {
    if (closed) return;
    bar.classList.add('show');
    setTimeout(function () {
      if (closed) return;
      bar.classList.remove('show');
      setTimeout(cycle, 10000);
    }, 10000);
  }
  setTimeout(cycle, 1500);
})();
