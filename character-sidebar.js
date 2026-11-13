/* 56ViceLane — rotating GTA6 character sidebar art
   Fixed character portraits bookending the page on desktop, post-launch
   only (gated by launch-transform.js's .post-launch body class). One
   character's portrait appears on the left edge, another on the right,
   and the pair rotates over time as more characters are added below.

   ADDING A NEW CHARACTER: add one line to ROSTER. Check which way they're
   already facing/turned in the source image -- if they're naturally
   turned toward what would be the WRONG side (away from the page's
   center) once placed, set mirror:true on that entry to flip them with
   CSS (transform: scaleX(-1)) instead of generating a second image.
   Leave mirror off (the default) if they already face the right way.

   Include with: <script src="/character-sidebar.js" defer></script>
   (after launch-transform.js, order doesn't matter -- this one polls the
   body class itself.) */
(function () {
  'use strict';

  var ROSTER = [
    { name: 'Lucia Caminos', src: 'images/gta6/sidebar/lucia-caminos.jpg', mirror: false }, // left, already turned toward center
    { name: 'Jason Duval', src: 'images/gta6/sidebar/jason-duval.jpg', mirror: false }      // right, already turned toward center
    // Add more as they're generated, e.g.:
    // { name: 'Boobie Ike', src: 'images/gta6/sidebar/boobie-ike.jpg', mirror: true },
  ];

  var ROTATION_MS = 1000 * 60 * 60 * 6; // swap pair every 6 hours

  function currentPair() {
    if (ROSTER.length === 0) return null;
    if (ROSTER.length <= 2) {
      // Fixed assignment while the roster is just one pair: ROSTER[0] is
      // always left, ROSTER[1] (or the same one, if only one exists) is
      // always right. Rotation only kicks in once there's a third
      // character to cycle through.
      return [ROSTER[0], ROSTER[ROSTER.length - 1]];
    }
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
      '.vl-char-rail img.vl-flip{transform:scaleX(-1);}' +
      /* Face is centered in the frame (object-position 50%), so the
         opaque zone has to clear well past center or the fade cuts a
         seam straight through the middle of the face. Only fade a
         narrow strip right at the innermost edge, past the whole face. */
      '.vl-char-left img{-webkit-mask-image:linear-gradient(to right,#000 85%,transparent 100%);' +
        'mask-image:linear-gradient(to right,#000 85%,transparent 100%);}' +
      '.vl-char-right img{-webkit-mask-image:linear-gradient(to left,#000 85%,transparent 100%);' +
        'mask-image:linear-gradient(to left,#000 85%,transparent 100%);}' +
      '@media(max-width:1500px){.vl-char-rail{width:160px;}}' +
      '@media(max-width:1200px){.vl-char-rail{display:none !important;}}' +
      /* The nav bar's opaque white background sits above the rail
         (nav has a higher z-index than the rail) and was fully hiding
         the top of each character portrait. Let it go translucent once
         we're past launch so the art shows through up top too. */
      '.post-launch nav{background:rgba(255,255,255,.72);backdrop-filter:blur(6px);' +
        '-webkit-backdrop-filter:blur(6px);}';
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
    leftImg.classList.toggle('vl-flip', !!pair[0].mirror);
    if (rightImg.getAttribute('src') !== pair[1].src) {
      rightImg.src = pair[1].src;
      rightImg.alt = pair[1].name;
    }
    rightImg.classList.toggle('vl-flip', !!pair[1].mirror);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
  document.addEventListener('vicelane:launch-transform', render);
  setInterval(render, 60 * 1000); // keep the pair fresh if a tab stays open across a rotation boundary
})();
