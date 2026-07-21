/* Ages the Editor's portrait as GTA6 launch (Nov 19, 2026) approaches —
   Danny starts bright-eyed and gets progressively more wrecked. Picks the
   stage by days remaining; swaps automatically, no manual updates needed. */
(function () {
  var LAUNCH = new Date('2026-11-19T00:00:00-05:00').getTime();
  var STAGES = [
    { minDays: 90,       src: '/images/editor-portrait-1-bright.png' },
    { minDays: 45,       src: '/images/editor-portrait-2-settling.png' },
    { minDays: 8,        src: '/images/editor-portrait-3-grinding.png' },
    { minDays: 0,        src: '/images/editor-portrait-4-launchweek.png' },
    { minDays: -100000,  src: '/images/editor-portrait-5-afterlaunch.png' }
  ];

  function pick() {
    var days = (LAUNCH - Date.now()) / 86400000;
    for (var i = 0; i < STAGES.length; i++) {
      if (days >= STAGES[i].minDays) return STAGES[i].src;
    }
    return STAGES[STAGES.length - 1].src;
  }

  var img = document.getElementById('editor-portrait');
  if (img) img.src = pick();
})();
