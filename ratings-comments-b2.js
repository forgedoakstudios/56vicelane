/* ratings-comments-b2.js — shared rating/comment logic for the "avg-rating
   display + live emoji-search" article template variant. Calls the n8n
   webhooks below instead of embedding an Airtable token in page source.

   Expects markup like articles/fable-delayed-february-2027-because-of-gta6.html:
   #stars-row/#cops-row .rating-icon (data-val/data-type="positive"|"negative"),
   #ratings-result/#avg-display, #comment-name/#comment-text/#char-count/
   #emoji-row/#emoji-search/#emoji-selected/#gif-url/#gif-preview,
   button.comment-submit onclick="submitComment()", #comment-success,
   #comments-list. */
(function () {
  var SUBMIT_RATING_URL = 'https://n8n.56vicelane.com/webhook/submit-rating';
  var LIST_RATINGS_URL = 'https://n8n.56vicelane.com/webhook/list-ratings';
  var SUBMIT_COMMENT_URL = 'https://n8n.56vicelane.com/webhook/submit-comment';
  var LIST_COMMENTS_URL = 'https://n8n.56vicelane.com/webhook/list-comments';

  function slug() {
    return window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '').split('/').pop();
  }
  var SLUG = slug();

  var hasVoted = !!localStorage.getItem('rated_' + SLUG);

  function submitRating(val, isPositive) {
    if (hasVoted) return;
    hasVoted = true;
    localStorage.setItem('rated_' + SLUG, '1');
    var row = document.getElementById(isPositive ? 'stars-row' : 'cops-row');
    if (row) {
      row.querySelectorAll('.rating-icon').forEach(function (ic, i) {
        if (i < val) {
          ic.classList.add('active');
          if (val === 5) ic.classList.add(isPositive ? 'spin' : 'flash');
        }
      });
    }
    fetch(SUBMIT_RATING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleSlug: SLUG, rating: val, isPositive: isPositive })
    }).catch(function () {});
    loadAvgRating();
  }

  function loadAvgRating() {
    fetch(LIST_RATINGS_URL + '?slug=' + encodeURIComponent(SLUG))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.count) return;
        var avgEl = document.getElementById('avg-display');
        var resultEl = document.getElementById('ratings-result');
        if (avgEl) avgEl.textContent = d.average + '/5 from ' + d.count + ' vote' + (d.count !== 1 ? 's' : '');
        if (resultEl) resultEl.classList.add('visible');
      })
      .catch(function () {});
  }

  document.querySelectorAll('.rating-icon').forEach(function (ic) {
    ic.addEventListener('click', function () {
      submitRating(parseInt(ic.dataset.val, 10), ic.dataset.type === 'positive');
    });
  });

  var GTA_EMOJIS = ['🎮', '🔥', '💰', '🚗', '🏎️', '🚔', '⭐', '💥', '🗺️', '🌴', '🌆', '🎵', '🤙', '💸', '📱', '🎯', '🏁', '🚀', '💎', '👑', '🔫', '🏍️', '🌙', '☀️', '🎪', '✈️', '🏆', '💫'];
  var selectedEmoji = '';

  function renderEmojis(list) {
    var row = document.getElementById('emoji-row');
    var search = document.getElementById('emoji-search');
    if (!row || !search) return;
    row.innerHTML = '';
    row.appendChild(search);
    list.forEach(function (em) {
      var btn = document.createElement('button');
      btn.className = 'emoji-btn' + (em === selectedEmoji ? ' selected' : '');
      btn.textContent = em;
      btn.onclick = function () {
        selectedEmoji = em === selectedEmoji ? '' : em;
        var sel = document.getElementById('emoji-selected');
        if (sel) sel.textContent = selectedEmoji;
        renderEmojis(list);
      };
      row.appendChild(btn);
    });
  }

  var searchEl = document.getElementById('emoji-search');
  if (searchEl) searchEl.addEventListener('input', function () { renderEmojis(GTA_EMOJIS); });

  var ctextEl = document.getElementById('comment-text');
  var countEl = document.getElementById('char-count');
  if (ctextEl && countEl) {
    ctextEl.addEventListener('input', function () { countEl.textContent = this.value.length; });
  }

  var gifUrlEl = document.getElementById('gif-url');
  if (gifUrlEl) {
    gifUrlEl.addEventListener('input', function () {
      var p = document.getElementById('gif-preview');
      if (!p) return;
      if (this.value.trim()) { p.src = this.value.trim(); p.style.display = 'block'; }
      else { p.style.display = 'none'; }
    });
  }

  window.submitComment = function () {
    var nameEl = document.getElementById('comment-name');
    var textEl = document.getElementById('comment-text');
    var gifEl = document.getElementById('gif-url');
    if (!nameEl || !textEl) return;
    var name = nameEl.value.trim();
    var text = textEl.value.trim();
    if (!name || !text) return;
    var btn = document.querySelector('.comment-submit');
    if (btn) { btn.textContent = 'Posting...'; btn.disabled = true; }

    fetch(SUBMIT_COMMENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleSlug: SLUG, name: name, comment: text, gifUrl: gifEl ? gifEl.value.trim() : '', emoji: selectedEmoji })
    }).then(function () {
      nameEl.value = ''; textEl.value = ''; if (gifEl) gifEl.value = '';
      var prev = document.getElementById('gif-preview');
      if (prev) prev.style.display = 'none';
      if (countEl) countEl.textContent = '0';
      selectedEmoji = '';
      var sel = document.getElementById('emoji-selected');
      if (sel) sel.textContent = '';
      var successEl = document.getElementById('comment-success');
      if (successEl) {
        successEl.style.display = 'block';
        setTimeout(function () { successEl.style.display = 'none'; }, 3000);
      }
      loadComments();
    }).catch(function () {}).then(function () {
      if (btn) { btn.textContent = 'Post Comment'; btn.disabled = false; }
    });
  };

  function loadComments() {
    var list = document.getElementById('comments-list');
    if (!list) return;
    fetch(LIST_COMMENTS_URL + '?slug=' + encodeURIComponent(SLUG))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var comments = (d && d.comments) || [];
        if (!comments.length) {
          list.innerHTML = '<p style="color:var(--smoke);font-family:\'Barlow Condensed\',sans-serif;font-size:0.9rem;">No comments yet. Be the first.</p>';
          return;
        }
        list.innerHTML = comments.map(function (c) {
          var ts = c.timestamp ? new Date(c.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
          var text = (c.comment || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          return '<div class="comment-card"><div class="comment-meta"><span class="comment-name">' +
            (c.name || 'Anonymous') + (c.emoji ? ' ' + c.emoji : '') + '</span><span class="comment-time">' + ts +
            '</span></div><div class="comment-text">' + text + '</div>' +
            (c.gifUrl ? '<img class="comment-gif" src="' + c.gifUrl + '" alt="gif" loading="lazy">' : '') +
            '</div>';
        }).join('');
      })
      .catch(function () {});
  }

  window.addEventListener('load', function () {
    renderEmojis(GTA_EMOJIS);
    loadComments();
    loadAvgRating();
  });
})();
