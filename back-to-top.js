/* ============================================================
   56ViceLane — back-to-top button
   Fully self-contained (inline styles, no CSS file dependency) so
   it looks identical on every page regardless of which design
   system that page uses. Purely additive — creates one new button,
   touches nothing else on the page.
   Include with: <script src="/back-to-top.js" defer></script>
   ============================================================ */
(function () {
  function init() {
    if (document.getElementById('back-to-top-btn')) return;

    var btn = document.createElement('button');
    btn.id = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&#8593;';

    var s = btn.style;
    s.position = 'fixed';
    s.bottom = '24px';
    s.right = '24px';
    s.zIndex = '999';
    s.width = '48px';
    s.height = '48px';
    s.borderRadius = '50%';
    s.border = 'none';
    s.cursor = 'pointer';
    s.background = 'linear-gradient(135deg, #FF6B2C, #C4922A)';
    s.color = '#000';
    s.fontSize = '20px';
    s.fontWeight = '800';
    s.lineHeight = '1';
    s.display = 'flex';
    s.alignItems = 'center';
    s.justifyContent = 'center';
    s.boxShadow = '0 4px 20px rgba(255,107,44,.5)';
    s.opacity = '0';
    s.transform = 'translateY(12px)';
    s.pointerEvents = 'none';
    s.transition = 'opacity .25s ease, transform .25s ease, box-shadow .25s ease';

    btn.addEventListener('mouseenter', function () {
      s.boxShadow = '0 4px 26px rgba(255,107,44,.75)';
    });
    btn.addEventListener('mouseleave', function () {
      s.boxShadow = '0 4px 20px rgba(255,107,44,.5)';
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(btn);

    var visible = false;
    function onScroll() {
      var show = window.scrollY > 400;
      if (show === visible) return;
      visible = show;
      s.opacity = show ? '1' : '0';
      s.transform = show ? 'translateY(0)' : 'translateY(12px)';
      s.pointerEvents = show ? 'auto' : 'none';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
