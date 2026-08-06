/* ratings-comments.js — single source of truth for every article's star
   rating + comment section. Calls the n8n webhooks below instead of
   Airtable directly, so no article needs an embedded API token anymore.

   Expects the standard markup (see any article built since 2026-08-03):
   .ratings-wrap with #stars/#cops/#rating-result, .comments-wrap with
   #cname/#ctext/#ccount/.emoji-btn/#cgif/#gifprev/#cstatus/#clist. */
(function () {
  var SUBMIT_RATING_URL = 'https://n8n.56vicelane.com/webhook/submit-rating';
  var SUBMIT_COMMENT_URL = 'https://n8n.56vicelane.com/webhook/submit-comment';
  var LIST_COMMENTS_URL = 'https://n8n.56vicelane.com/webhook/list-comments';

  function slug() {
    return window.location.pathname.replace(/\.html$/, '').replace(/\/+$/, '').split('/').pop();
  }

  var selE = '';

  window.vlRate = function (n, pos) {
    var s = slug();
    if (localStorage.getItem('rated_' + s)) {
      var resultEl = document.getElementById('rating-result');
      if (resultEl) resultEl.textContent = 'Already voted!';
      return;
    }
    var btns = pos
      ? document.querySelectorAll('#stars .star-btn')
      : document.querySelectorAll('#cops .cop-btn');
    btns.forEach(function (b, i) { b.classList.toggle('active', i < n); });

    fetch(SUBMIT_RATING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleSlug: s, rating: n, isPositive: pos })
    }).catch(function () {});

    localStorage.setItem('rated_' + s, '1');
    var resultEl = document.getElementById('rating-result');
    if (resultEl) {
      resultEl.textContent = pos
        ? n + ' star' + (n > 1 ? 's' : '') + ' recorded'
        : n + ' cop car' + (n > 1 ? 's' : '') + ' recorded';
    }
  };

  window.vlSelEmoji = function (btn, emoji) {
    document.querySelectorAll('.emoji-btn').forEach(function (x) { x.classList.remove('selected'); });
    btn.classList.add('selected');
    selE = emoji;
  };

  window.vlPrevGif = function () {
    var input = document.getElementById('cgif');
    var prev = document.getElementById('gifprev');
    if (!input || !prev) return;
    if (input.value) { prev.src = input.value; prev.style.display = 'block'; }
    else { prev.style.display = 'none'; }
  };

  window.vlPostComment = function () {
    var nameEl = document.getElementById('cname');
    var textEl = document.getElementById('ctext');
    var gifEl = document.getElementById('cgif');
    var statusEl = document.getElementById('cstatus');
    if (!nameEl || !textEl || !statusEl) return;

    var name = nameEl.value.trim();
    var text = textEl.value.trim();
    var gifUrl = gifEl ? gifEl.value.trim() : '';

    if (!name || !text) {
      statusEl.style.color = 'var(--red)';
      statusEl.textContent = 'Name and comment required.';
      return;
    }
    statusEl.style.color = 'var(--smoke)';
    statusEl.textContent = 'Posting...';

    fetch(SUBMIT_COMMENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleSlug: slug(), name: name, comment: text, gifUrl: gifUrl || '', emoji: selE })
    }).then(function () {
      statusEl.style.color = 'var(--green)';
      statusEl.textContent = 'Comment posted!';
      nameEl.value = ''; textEl.value = ''; if (gifEl) gifEl.value = '';
      var countEl = document.getElementById('ccount');
      if (countEl) countEl.textContent = '0';
      selE = '';
      document.querySelectorAll('.emoji-btn').forEach(function (x) { x.classList.remove('selected'); });
      var prev = document.getElementById('gifprev');
      if (prev) prev.style.display = 'none';
      setTimeout(loadComments, 1000);
    }).catch(function () {
      statusEl.style.color = 'var(--red)';
      statusEl.textContent = 'Error. Try again.';
    });
  };

  function loadComments() {
    var list = document.getElementById('clist');
    if (!list) return;
    fetch(LIST_COMMENTS_URL + '?slug=' + encodeURIComponent(slug()))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var comments = (d && d.comments) || [];
        if (!comments.length) {
          list.innerHTML = '<p style="color:var(--smoke);font-family:Barlow Condensed,sans-serif;font-size:0.9rem;">No comments yet. Be first.</p>';
          return;
        }
        list.innerHTML = comments.map(function (c) {
          var t = c.timestamp ? new Date(c.timestamp).toLocaleDateString() : '';
          return '<div class="comment-card"><div class="comment-header"><span class="comment-name">' +
            (c.emoji || '') + ' ' + (c.name || 'Anonymous') + '</span><span class="comment-time">' + t +
            '</span></div><div class="comment-text">' + (c.comment || '') + '</div>' +
            (c.gifUrl ? '<img src="' + c.gifUrl + '" style="max-width:180px;border-radius:6px;margin-top:8px;" alt="gif">' : '') +
            '</div>';
        }).join('');
      })
      .catch(function () {});
  }

  var countEl = document.getElementById('ccount');
  var ctextEl = document.getElementById('ctext');
  if (ctextEl && countEl) {
    ctextEl.addEventListener('input', function () { countEl.textContent = this.value.length; });
  }

  if (document.getElementById('clist')) loadComments();
})();
