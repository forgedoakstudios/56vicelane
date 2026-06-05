// 56ViceLane — Auto Hero Image v3
// Injects real <img> tags into all article hero divs
// Covers: content-worker articles, manually built articles, all slugs
(function(){
  const slug = location.pathname.split('/').pop().replace('.html','').toLowerCase();

  // ── Image selection by slug keywords ──────────────────────────────────────
  let img = 'gta6-hero.png'; // default

  if (/gta5|ragemp|fivem|switch2|ned-luke|swatter|last-drive|farewell|gta-v/.test(slug)) {
    img = 'gta5-hero.png';
  } else if (/gpu|pc-build|amd|nvidia|frame-gen|extrapolation|samsung|prompt-inject|tech|rtx|hardware|cpu|build-guide/.test(slug)) {
    img = 'tech-hero.png';
  } else if (/online|heist|shark|gtao|neon|store|weekly|bonus|cayo/.test(slug)) {
    img = 'gtao-hero.png';
  } else if (/freight|industry|publisher|schedule|earnings|stock|price|delay|release-window/.test(slug)) {
    img = 'gta6-hero.png';
  }

  const src = '/images/' + img;
  const alt = 'GTA article hero image';

  // ── Case 1: .article-hero div exists but has NO <img> inside ──────────────
  // This covers all content-worker articles (background-image style)
  const heroBg = document.querySelector('.article-hero');
  if (heroBg && !heroBg.querySelector('img')) {
    // Remove any inline background-image CSS if present
    heroBg.style.backgroundImage = '';
    heroBg.style.background = '';

    // Create and prepend the real img
    const el = document.createElement('img');
    el.src = src;
    el.alt = alt;
    el.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.28;display:block;';
    heroBg.insertBefore(el, heroBg.firstChild);

    // Make sure the hero div is positioned so the overlay works
    if (getComputedStyle(heroBg).position === 'static') {
      heroBg.style.position = 'relative';
    }
  }

  // ── Case 2: .article-hero-img placeholder already exists ──────────────────
  // This covers manually built articles that use the img-tag pattern
  const heroImg = document.querySelector('.article-hero-img');
  if (heroImg) {
    heroImg.src = src;
    heroImg.alt = alt;
    heroImg.style.display = 'block';
  }

  // ── Case 3: Pexels or hardcoded img inside .article-hero ──────────────────
  // Replace any external image src with the correct local hero
  const existingImg = document.querySelector('.article-hero img');
  if (existingImg && !existingImg.src.includes('/images/')) {
    existingImg.src = src;
    existingImg.alt = alt;
    existingImg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.28;display:block;';
  }

  // ── Update OG meta image ───────────────────────────────────────────────────
  const og = document.querySelector('meta[property="og:image"]');
  if (og) og.content = 'https://56vicelane.com/images/' + img;

})();
