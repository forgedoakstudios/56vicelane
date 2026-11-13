/* 56ViceLane — launch-night transform
   Flips the site from "countdown to GTA6" into "GTA6 is live" content at a
   fixed moment: midnight Nov 19, 2026, Eastern Time (GTA6's launch).

   HOW TO USE ON ANY PAGE:
   1. Include this script: <script src="/launch-transform.js" defer></script>
   2. Mark elements that should swap:
      - Images:  <img data-pre-src="images/old.jpg" data-post-src="images/gta6/post-launch/new.jpg" src="images/old.jpg">
      - Text/HTML: <div data-pre-html="Old copy" data-post-html="New copy">Old copy</div>
      - Whole blocks to show/hide: add class "pre-launch-only" or "post-launch-only"
        to any element — one is hidden, the other shown, once launch passes.
   3. That's it — no page-specific JS needed. This script scans the whole
      document on load and again if launch passes while the page is open
      (rare, but handles someone leaving a tab open past midnight).

   Nothing here needs editing per-section. Add the data attributes/classes
   to whatever element is ready, and it transforms automatically.
*/
(function () {
  'use strict';

  var LAUNCH_AT = new Date('2026-11-19T00:00:00-05:00').getTime();

  function isPastLaunch() {
    if (isPreview()) return true;
    return Date.now() >= LAUNCH_AT;
  }

  function isPreview() {
    try {
      if (new URLSearchParams(window.location.search).get('preview-launch') === '1') return true;
      return window.localStorage && window.localStorage.getItem('vl_preview_launch') === '1';
    } catch (e) {
      return false;
    }
  }

  function applyTransform() {
    var transformed = isPastLaunch();
    document.body.classList.toggle('post-launch', transformed);
    document.body.classList.toggle('pre-launch', !transformed);

    document.querySelectorAll('[data-pre-src], [data-post-src]').forEach(function (el) {
      var target = transformed ? el.getAttribute('data-post-src') : el.getAttribute('data-pre-src');
      if (target && el.getAttribute('src') !== target) el.setAttribute('src', target);
    });

    document.querySelectorAll('[data-pre-html], [data-post-html]').forEach(function (el) {
      var target = transformed ? el.getAttribute('data-post-html') : el.getAttribute('data-pre-html');
      if (target != null) el.innerHTML = target;
    });

    document.querySelectorAll('.pre-launch-only').forEach(function (el) {
      el.style.display = transformed ? 'none' : '';
    });
    document.querySelectorAll('.post-launch-only').forEach(function (el) {
      el.style.display = transformed ? '' : 'none';
    });

    if (transformed && !window.__vlLaunchFired) {
      window.__vlLaunchFired = true;
      document.dispatchEvent(new CustomEvent('vicelane:launch-transform'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTransform);
  } else {
    applyTransform();
  }

  var msUntilLaunch = LAUNCH_AT - Date.now();
  if (msUntilLaunch > 0 && msUntilLaunch < 2147483647) {
    setTimeout(applyTransform, msUntilLaunch + 1000);
  }
})();
