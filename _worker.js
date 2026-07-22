// _worker.js — Cloudflare Pages
// Auto-injects hero.js into all article pages
// Upload to GitHub root alongside index.html

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Intercept article pages (hero.js + Article Read tracking) and
    // blotter pages (Blotter Read tracking only — no hero.js needed)
    const isArticle = url.pathname.startsWith('/articles/');
    const isBlotter = url.pathname.startsWith('/blotter/');
    if (!isArticle && !isBlotter) return env.ASSETS.fetch(request);

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    const html = await response.text();

    let modified = html;
    if (isArticle && !modified.includes('/hero.js')) {
      modified = modified.replace('</body>', '<script src="/hero.js"></script>\n</body>');
    }
    if (!modified.includes('/track.js')) {
      const trackAction = isBlotter ? 'Blotter Read' : 'Article Read';
      modified = modified.replace('</body>', '<script src="/track.js" data-track-action="' + trackAction + '"></script>\n</body>');
    }

    return new Response(modified, {
      status: response.status,
      headers: response.headers
    });
  }
}
