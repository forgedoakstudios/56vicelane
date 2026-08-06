/* related-articles.js — tops up every article's .related-grid with fresh,
   category-matched links pulled live from articles.json.
   Additive only: never removes or replaces the hand-curated related-card
   links already in the page, just fills the grid up to a healthy count so
   it stays current as new articles publish (the static hand-picked pairs
   don't self-update, which is how most articles ended up stuck at 2-3
   links from whenever they were first written).
   Mount: works against any <div class="related-grid"> already on the page
   — no HTML changes needed beyond including this script. */
(function () {
  var TARGET_COUNT = 5;

  function currentPath() {
    return window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '');
  }

  function existingHrefs(grid) {
    var set = {};
    grid.querySelectorAll('.related-card').forEach(function (a) {
      var href = (a.getAttribute('href') || '').replace(/\.html$/, '').replace(/\/+$/, '');
      set[href] = true;
    });
    return set;
  }

  function cardHtml(article) {
    var label = (article.emoji ? article.emoji + ' ' : '') + (article.category || 'News');
    var title = article.headline || article.title;
    return '<a href="' + article.url + '" class="related-card">' +
      '<div class="related-card-label">' + label + '</div>' +
      '<div class="related-card-title">' + title + '</div>' +
      '</a>';
  }

  function render(articles) {
    var grids = document.querySelectorAll('.related-grid');
    if (!grids.length) return;

    var path = currentPath();
    var current = articles.filter(function (a) {
      return (a.url || '').replace(/\.html$/, '').replace(/\/+$/, '') === path;
    })[0];

    grids.forEach(function (grid) {
      var have = existingHrefs(grid);
      have[path] = true; // never link to self

      var pool = articles.filter(function (a) {
        var u = (a.url || '').replace(/\.html$/, '').replace(/\/+$/, '');
        return !have[u];
      });

      // Prefer same-category, freshest first; fall back to any other
      // recent article once same-category options run out (keeps thin
      // categories like Hardware/Store from being starved of links).
      var sameCategory = current
        ? pool.filter(function (a) { return a.category === current.category; })
        : [];
      var rest = pool.filter(function (a) { return sameCategory.indexOf(a) === -1; });
      sameCategory.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
      rest.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

      var needed = TARGET_COUNT - grid.querySelectorAll('.related-card').length;
      if (needed <= 0) return;
      var picks = sameCategory.concat(rest).slice(0, needed);

      var html = '';
      picks.forEach(function (a) {
        have[(a.url || '').replace(/\.html$/, '').replace(/\/+$/, '')] = true;
        html += cardHtml(a);
      });
      if (html) grid.insertAdjacentHTML('beforeend', html);
    });
  }

  fetch('/articles.json')
    .then(function (r) { return r.json(); })
    .then(render)
    .catch(function () {});
})();
