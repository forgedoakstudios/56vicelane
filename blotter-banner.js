/* Rotates the Crime Blotter's banner image every 15 minutes — slower
   than the headline rotation since it's a visual element, not text. */
(function () {
  var BANNERS = [
    '/images/crime-blotter-banner-tape.png',
    '/images/crime-blotter-banner-newsvan.png',
    '/images/crime-blotter-banner-patriotic.png',
    '/images/crime-blotter-banner-tabloid.png'
  ];
  var INTERVAL_MS = 15 * 60 * 1000;

  function renderBanner() {
    var img = document.getElementById('blotter-banner-img');
    if (!img) return;
    var bucket = Math.floor(Date.now() / INTERVAL_MS);
    img.src = BANNERS[bucket % BANNERS.length];
  }

  renderBanner();
  setInterval(renderBanner, INTERVAL_MS);
})();
