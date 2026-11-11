/* TRANSLATE SIDEBAR — self-contained widget (same pattern as sponsor-banner.js
   /loyalty-banner.js). Custom glowing flag-box UI on top of Google's free
   client-side website-translate engine (no API key, no backend, no cost).
   Collapsed to a small edge tab by default so it never fights the sponsor
   toast (bottom-left) or the article sponsor rail (right side). */
(function () {
  var LANGUAGES = [
    { code: 'es',    name: 'Español',   flagCode: 'es' },
    { code: 'pt',    name: 'Português', flagCode: 'pt' },
    { code: 'fr',    name: 'Français',  flagCode: 'fr' },
    { code: 'de',    name: 'Deutsch',   flagCode: 'de' },
    { code: 'it',    name: 'Italiano',  flagCode: 'it' },
    { code: 'pl',    name: 'Polski',    flagCode: 'pl' },
    { code: 'nl',    name: 'Nederlands',flagCode: 'nl' },
    { code: 'ru',    name: 'Русский',   flagCode: 'ru' },
    { code: 'tr',    name: 'Türkçe',    flagCode: 'tr' },
    { code: 'ar',    name: 'العربية',   flagCode: 'sa' },
    { code: 'hi',    name: 'हिन्दी',     flagCode: 'in' },
    { code: 'ja',    name: '日本語',    flagCode: 'jp' },
    { code: 'ko',    name: '한국어',    flagCode: 'kr' },
    { code: 'zh-CN', name: '中文',      flagCode: 'cn' }
  ];

  /* "Translate" in each language, cycled on the collapsed tab so it reads
     as multilingual at a glance before anyone even opens the panel. */
  var TRANSLATE_WORDS = [
    'Translate', 'Traducir', 'Traduzir', 'Traduire', 'Übersetzen',
    'Traduci', 'Przetłumacz', 'Vertalen', 'Перевести', 'Çevir',
    'ترجمة', 'अनुवाद करें', '翻訳', '번역', '翻译'
  ];

  /* RTL (Arabic is the only RTL language in LANGUAGES above) — the free
     Google widget only swaps words, it never flips reading direction, so
     without this an Arabic translation would still read left-to-right.
     Scoped to prose content only (not nav/ticker/flag-grid/footer-links),
     so sitewide flex/grid chrome doesn't mirror along with it. */
  function currentGoogTransLang() {
    var m = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
    return m ? m[1] : '';
  }
  if (currentGoogTransLang() === 'ar') {
    document.documentElement.classList.add('vl-lang-rtl');
  }

  var style = document.createElement('style');
  style.textContent = [
    '#goog-gt-tt, .goog-te-banner-frame, .skiptranslate > iframe { display:none !important; }',
    'body { top:0 !important; }',
    '.vl-lang-rtl .article-body, .vl-lang-rtl .article-body p, .vl-lang-rtl .article-body li,',
    '.vl-lang-rtl .article-title, .vl-lang-rtl .lead, .vl-lang-rtl .callout, .vl-lang-rtl .editor-note,',
    '.vl-lang-rtl p, .vl-lang-rtl li, .vl-lang-rtl blockquote,',
    '.vl-lang-rtl h1, .vl-lang-rtl h2, .vl-lang-rtl h3, .vl-lang-rtl h4 {',
      'direction:rtl;text-align:right;',
    '}',
    '#google_translate_element { position:absolute; width:1px; height:1px; overflow:hidden; opacity:0; pointer-events:none; }',
    '.vl-ts-tab{position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:9998;',
      'background:linear-gradient(135deg,#FF6B2C,#D6247A);color:#fff;padding:14px 8px;',
      'border-radius:0 10px 10px 0;cursor:pointer;font-family:"Barlow Condensed",sans-serif;',
      'font-weight:700;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;',
      'writing-mode:vertical-rl;box-shadow:2px 0 14px rgba(0,0,0,.35);user-select:none;}',
    '.vl-ts-tab:hover{padding-left:12px;}',
    '.vl-ts-panel{position:fixed;left:-320px;top:0;height:100%;width:290px;z-index:9999;',
      'background:#14100E;border-right:1px solid rgba(255,255,255,.08);',
      'box-shadow:4px 0 30px rgba(0,0,0,.5);padding:20px 16px;overflow-y:auto;',
      'transition:left .28s ease;}',
    '.vl-ts-panel.open{left:0;}',
    '.vl-ts-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}',
    '.vl-ts-title{font-family:"Playfair Display",serif;color:#FBEFE6;font-size:1.05rem;}',
    '.vl-ts-close{background:none;border:none;color:#6B5F52;font-size:1.3rem;cursor:pointer;line-height:1;}',
    '.vl-ts-close:hover{color:#FF6B2C;}',
    '.vl-ts-reset{display:block;width:100%;text-align:left;background:rgba(255,255,255,.04);',
      'border:1px solid rgba(255,255,255,.1);color:#D8C6B8;border-radius:8px;padding:9px 12px;',
      'font-family:"Barlow Condensed",sans-serif;font-size:.8rem;font-weight:700;',
      'text-transform:uppercase;letter-spacing:.04em;cursor:pointer;margin-bottom:12px;}',
    '.vl-ts-reset:hover{border-color:#FF6B2C;color:#fff;}',
    '.vl-ts-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}',
    '.vl-ts-box{position:relative;background:rgba(255,255,255,.03);border:1px solid rgba(255,107,44,.25);',
      'border-radius:10px;padding:12px 8px 10px;text-align:center;cursor:pointer;overflow:hidden;',
      'animation:vlTsGlow 2.6s ease-in-out infinite;transition:transform .15s ease;}',
    '.vl-ts-box:hover{transform:translateY(-2px);border-color:#FF6B2C;}',
    '.vl-ts-flag{display:block;width:32px;height:22px;object-fit:cover;border-radius:3px;',
      'margin:0 auto 6px;box-shadow:0 0 0 1px rgba(255,255,255,.15);',
      'animation:vlTsWave 2.4s ease-in-out infinite;}',
    '.vl-ts-name{display:block;font-size:.72rem;color:#FBEFE6;font-weight:600;line-height:1.2;}',
    '.vl-ts-badge{display:block;margin-top:4px;font-size:.58rem;color:#FF8A50;',
      'text-transform:uppercase;letter-spacing:.04em;font-weight:700;}',
    '@keyframes vlTsGlow{0%,100%{box-shadow:0 0 6px rgba(255,107,44,.15);}50%{box-shadow:0 0 16px rgba(255,107,44,.5);}}',
    '@keyframes vlTsWave{0%,100%{transform:rotate(-6deg);}50%{transform:rotate(6deg);}}',
    '@media(max-width:640px){.vl-ts-panel{width:84vw;left:-90vw;}.vl-ts-grid{grid-template-columns:1fr 1fr 1fr;}}'
  ].join('\n');
  document.head.appendChild(style);

  var gte = document.createElement('div');
  gte.id = 'google_translate_element';
  document.body.appendChild(gte);

  var tab = document.createElement('div');
  tab.className = 'vl-ts-tab';
  tab.textContent = '🌐 Translate';
  document.body.appendChild(tab);

  var twIndex = 0;
  setInterval(function () {
    twIndex = (twIndex + 1) % TRANSLATE_WORDS.length;
    tab.textContent = '🌐 ' + TRANSLATE_WORDS[twIndex];
  }, 1800);

  var panel = document.createElement('div');
  panel.className = 'vl-ts-panel';
  var boxesHtml = LANGUAGES.map(function (l) {
    return '<div class="vl-ts-box" data-code="' + l.code + '">' +
      '<img class="vl-ts-flag" src="https://flagcdn.com/' + l.flagCode + '.svg" alt="' + l.name + ' flag" loading="lazy">' +
      '<span class="vl-ts-name">' + l.name + '</span>' +
      '<span class="vl-ts-badge">Click to translate</span>' +
    '</div>';
  }).join('');
  panel.innerHTML =
    '<div class="vl-ts-head"><span class="vl-ts-title">🌐 Translate This Site</span>' +
    '<button type="button" class="vl-ts-close" aria-label="Close">×</button></div>' +
    '<button type="button" class="vl-ts-reset">↩ English (Original)</button>' +
    '<div class="vl-ts-grid">' + boxesHtml + '</div>';
  document.body.appendChild(panel);

  tab.addEventListener('click', function () { panel.classList.add('open'); });
  panel.querySelector('.vl-ts-close').addEventListener('click', function () { panel.classList.remove('open'); });

  function setLang(code) {
    var expires = new Date(Date.now() + 365 * 86400000).toUTCString();
    var cookieVal = code ? ('/en/' + code) : '';
    var host = location.hostname;
    var domainAttr = host.indexOf('.') > -1 ? ';domain=' + host : '';
    if (code) {
      document.cookie = 'googtrans=' + cookieVal + ';path=/;expires=' + expires + domainAttr;
      document.cookie = 'googtrans=' + cookieVal + ';path=/;expires=' + expires;
    } else {
      document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT' + domainAttr;
      document.cookie = 'googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    location.reload();
  }

  panel.querySelectorAll('.vl-ts-box').forEach(function (box) {
    box.addEventListener('click', function () { setLang(box.getAttribute('data-code')); });
  });
  panel.querySelector('.vl-ts-reset').addEventListener('click', function () { setLang(''); });

  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      autoDisplay: false
    }, 'google_translate_element');
  };
  var gScript = document.createElement('script');
  gScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.body.appendChild(gScript);
})();
