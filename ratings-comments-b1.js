/* ratings-comments-b1.js — shared rating/comment logic for the older
   "rating-icon (data-val/data-type) + comment-emoji select + comments-list"
   article template variant. Calls the n8n webhooks below instead of
   embedding an Airtable token in page source.

   Expects markup like articles/gta6-everything-confirmed.html: .rating-icon
   spans (data-val/data-type="good"|"bad") -> #rating-result, #comment-name/
   #comment-text/#char-count/#comment-emoji(select)/#comment-gif/#submit-msg,
   button onclick="submitComment()", #comments-list. */
(function () {
  var SUBMIT_RATING_URL = 'https://n8n.56vicelane.com/webhook/submit-rating';
  var SUBMIT_COMMENT_URL = 'https://n8n.56vicelane.com/webhook/submit-comment';
  var LIST_COMMENTS_URL = 'https://n8n.56vicelane.com/webhook/list-comments';

  function slug() {
    return window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '').split('/').pop();
  }
  var SLUG = slug();

  document.querySelectorAll('.rating-icon').forEach(function (icon) {
    icon.addEventListener('click', function () {
      var resultEl = document.getElementById('rating-result');
      if (localStorage.getItem('rated-' + SLUG)) {
        if (resultEl) resultEl.textContent = 'Already voted. Thanks!';
        return;
      }
      var val = parseInt(icon.dataset.val, 10);
      var type = icon.dataset.type;
      var isPositive = type === 'good';
      document.querySelectorAll('[data-type="' + type + '"]').forEach(function (ic, i) {
        if (i < val) ic.classList.add('active');
      });
      fetch(SUBMIT_RATING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleSlug: SLUG, rating: val, isPositive: isPositive })
      }).catch(function () {});
      localStorage.setItem('rated-' + SLUG, '1');
      if (resultEl) {
        resultEl.textContent = isPositive
          ? val + ' star' + (val > 1 ? 's' : '') + ' — Appreciate it.'
          : val + ' cop car' + (val > 1 ? 's' : '') + ' — Tell us why below.';
      }
    });
  });

  var ctextEl = document.getElementById('comment-text');
  var countEl = document.getElementById('char-count');
  if (ctextEl && countEl) {
    ctextEl.addEventListener('input', function () { countEl.textContent = this.value.length; });
  }

  window.submitComment = function () {
    var nameEl = document.getElementById('comment-name');
    var textEl = document.getElementById('comment-text');
    var emojiEl = document.getElementById('comment-emoji');
    var gifEl = document.getElementById('comment-gif');
    var msgEl = document.getElementById('submit-msg');
    if (!nameEl || !textEl || !msgEl) return;

    var name = nameEl.value.trim();
    var text = textEl.value.trim();
    var emoji = emojiEl ? emojiEl.value : '';
    var gifUrl = gifEl ? gifEl.value.trim() : '';

    if (!name || !text) {
      msgEl.style.color = '#FF3B3B';
      msgEl.textContent = 'Name and comment required.';
      return;
    }
    msgEl.style.color = 'var(--smoke)';
    msgEl.textContent = 'Posting...';

    fetch(SUBMIT_COMMENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleSlug: SLUG, name: name, comment: text, gifUrl: gifUrl, emoji: emoji })
    }).then(function () {
      msgEl.style.color = 'var(--green)';
      msgEl.textContent = 'Posted!';
      nameEl.value = ''; textEl.value = ''; if (gifEl) gifEl.value = '';
      if (countEl) countEl.textContent = '0';
      setTimeout(loadComments, 800);
    }).catch(function () {
      msgEl.style.color = '#FF3B3B';
      msgEl.textContent = 'Error. Try again.';
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
          list.innerHTML = '<p style="color:var(--smoke);font-size:0.9rem;">No comments yet. Be the first.</p>';
          return;
        }
        list.innerHTML = comments.map(function (c) {
          var t = c.timestamp ? new Date(c.timestamp).toLocaleDateString() : '';
          return '<div class="comment-card"><div class="comment-card-header"><span class="comment-name">' +
            (c.emoji || '') + ' ' + (c.name || 'Anonymous') + '</span><span class="comment-time">' + t +
            '</span></div><div class="comment-text">' + (c.comment || '') + '</div>' +
            (c.gifUrl ? '<div class="comment-gif"><img src="' + c.gifUrl + '" loading="lazy"></div>' : '') +
            '</div>';
        }).join('');
      })
      .catch(function () {});
  }

  loadComments();
})();
