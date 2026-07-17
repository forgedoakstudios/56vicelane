/* ============================================================
   56ViceLane — video slot component (see vicelane.css §28)
   Scans .video-slot[data-video-id]; empty id = placeholder stays,
   non-empty id = swaps in the 16:9 YouTube embed.
   Include with: <script src="/video-slot.js" defer></script>
   ============================================================ */
(function () {
  function initVideoSlots() {
    document.querySelectorAll('.video-slot[data-video-id]').forEach(function (slot) {
      var id = (slot.getAttribute('data-video-id') || '').trim();
      if (!id) return; /* placeholder stays until an id is filled in */
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id);
      f.title = slot.getAttribute('data-video-title') || '56ViceLane video';
      f.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      f.setAttribute('allowfullscreen', '');
      f.loading = 'lazy';
      slot.classList.add('video-slot-live');
      slot.innerHTML = '';
      slot.appendChild(f);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVideoSlots);
  } else {
    initVideoSlots();
  }
})();
