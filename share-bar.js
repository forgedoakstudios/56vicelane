/* share-bar.js — single source of truth for every article's share buttons.
   Mount point: <div class="vl-share-bar-mount"></div> (one or more per page).
   Replaces the old pattern of copy-pasting share-bar HTML into every article,
   which is how 23 articles ended up missing a Facebook button (2026-08-03)
   and 3+ different naming conventions drifted across the site. */
(function () {
  function currentUrl() {
    return window.location.origin + window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '');
  }

  function currentTitle() {
    return document.title.replace(/\s*\|\s*56ViceLane\s*$/, '');
  }

  function render() {
    var mounts = document.querySelectorAll('.vl-share-bar-mount');
    if (!mounts.length) return;

    var url = currentUrl();
    var title = currentTitle();
    var encUrl = encodeURIComponent(url);
    var encTitle = encodeURIComponent(title);

    var html =
      '<a class="vl-share-btn vl-share-facebook" href="https://www.facebook.com/sharer/sharer.php?u=' + encUrl + '" target="_blank" rel="noopener">📘 Facebook</a>' +
      '<button class="vl-share-btn vl-share-native" onclick="window.vlNativeShare()">📱 Share</button>' +
      '<a class="vl-share-btn vl-share-reddit" href="https://www.reddit.com/submit?url=' + encUrl + '&title=' + encTitle + '" target="_blank" rel="noopener">Reddit</a>' +
      '<a class="vl-share-btn vl-share-twitter" href="https://twitter.com/intent/tweet?url=' + encUrl + '&text=' + encTitle + '" target="_blank" rel="noopener">𝕏 Post</a>' +
      '<a class="vl-share-btn vl-share-whatsapp" href="https://wa.me/?text=' + encodeURIComponent(title + ' ' + url) + '" target="_blank" rel="noopener">WhatsApp</a>' +
      '<button class="vl-share-btn vl-share-copy" onclick="window.vlCopyShareLink(this)">Copy Link</button>';

    mounts.forEach(function (el) {
      el.innerHTML = html;
    });
  }

  window.vlNativeShare = function () {
    if (navigator.share) {
      navigator.share({ title: currentTitle(), url: currentUrl() }).catch(function () {});
    } else {
      navigator.clipboard.writeText(currentUrl());
    }
  };

  window.vlCopyShareLink = function (btn) {
    navigator.clipboard.writeText(currentUrl());
    var original = btn.textContent;
    btn.textContent = 'Copied ✓';
    setTimeout(function () {
      btn.textContent = original;
    }, 2000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
