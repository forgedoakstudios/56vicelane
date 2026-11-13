/* 56ViceLane — rotating GTA6 character sidebar art
   Fixed character portraits bookending the page on desktop, post-launch
   only (gated by launch-transform.js's .post-launch body class). One
   character's portrait appears on the left edge, another on the right,
   and the pair rotates over time as more characters are added below.

   ADDING A NEW CHARACTER: just add one line to ROSTER. The image only
   needs to exist facing one direction -- the opposite sidebar mirrors it
   with CSS (transform: scaleX(-1)) rather than needing a second generated
   image, so likeness stays consistent between the two sides.

   Include with: <script src="/character-sidebar.js" defer></script>
   (after launch-transform.js, order doesn't matter -- this one polls the
   body class itself.) */
(function () {
  'use strict';

  var ROSTER = [
    { name: 'Lucia Caminos', src: 'images/gta6/sidebar/lucia-caminos.jpg' },
    { name: 'Jason Duval', src: 'images/gta6/sidebar/jason-duval.jpg' }
    // Add more as they're generated, e.g.:
    // { name: 'Boobie Ike', src: 'images/gta6/sidebar/boobie-ike.jpg' },
  ];

  var ROTATION_MS = 1000 * 60 * 60 * 6; // swap pair every 6 hours

  function currentPair() {
    if (ROSTER.length === 0) return null;
    if (ROSTER.length === 1) return [ROSTER[0], ROSTER[0]];
    var idx = Math.floor(Date.now() / ROTATION_MS) % ROSTER.length;
    var leftChar = ROSTER[idx];
    var rightChar = ROSTER[(idx + 1) % ROSTER.length];
    return [leftChar, rightChar];
  }

  function injectStyles() {
    if (document.getElementById('vl-char-sidebar-style')) return;
    var style = document.createElement('style');
    style.id = 'vl-char-sidebar-style';
    style.textContent =
      '.vl-char-rail{position:fixed;top:0;bottom:0;width:220px;z-index:40;' +
        'pointer-events:none;overflow:hidden;display:none;}' +
      '.post-launch .vl-char-rail{display:block;}' +
      '.vl-char-rail.vl-char-left{left:0;}' +
      '.vl-char-rail.vl-char-right{right:0;}' +
      '.vl-char-rail img{position:absolute;inset:0;width:100%;height:100%;' +
        'object-fit:cover;object-position:50% 20%;opacity:.95;' +
        'filter:drop-shadow(0 0 30px rgba(0,0,0,.35));}' +
      '.vl-char-right img{transform:scaleX(-1);}' +
      '@media(max-width:1500px){.vl-char-rail{width:160px;}}' +
      '@media(max-width:1200px){.vl-char-rail{display:none !important;}}';
    document.head.appendChild(style);
  }

  function render() {
    injectStyles();
    var pair = currentPair();
    if (!pair) return;

    var left = document.getElementById('vl-char-rail-left');
    var right = document.getElementById('vl-char-rail-right');

    if (!left) {
      left = document.createElement('div');
      left.id = 'vl-char-rail-left';
      left.className = 'vl-char-rail vl-char-left post-launch-only';
      left.innerHTML = '<img id="vl-char-img-left">';
      document.body.appendChild(left);
    }
    if (!right) {
      right = document.createElement('div');
      right.id = 'vl-char-rail-right';
      right.className = 'vl-char-rail vl-char-right post-launch-only';
      right.innerHTML = '<img id="vl-char-img-right">';
      document.body.appendChild(right);
    }

    var leftImg = document.getElementById('vl-char-img-left');
    var rightImg = document.getElementById('vl-char-img-right');
    if (leftImg.getAttribute('src') !== pair[0].src) {
      leftImg.src = pair[0].src;
      leftImg.alt = pair[0].name;
    }
    if (rightImg.getAttribute('src') !== pair[1].src) {
      rightImg.src = pair[1].src;
      rightImg.alt = pair[1].name;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  document.addEventListener('vicelane:launch-transform', render);
  setInterval(render, 60 * 1000); // keep the pair fresh if a tab stays open across a rotation boundary
})();
