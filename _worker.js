// _worker.js — Cloudflare Pages
// Auto-injects hero.js into all article pages
// Upload to GitHub root alongside index.html

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only intercept article pages
    const isArticle = url.pathname.startsWith('/articles/');
    if (!isArticle) return env.ASSETS.fetch(request);

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    const html = await response.text();

    // Inject hero.js + track.js before </body> if not already present
    let modified = html.includes('/hero.js')
      ? html
      : html.replace('</body>', '<script src="/hero.js"></script>\n</body>');
    modified = modified.includes('/track.js')
      ? modified
      : modified.replace('</body>', '<script src="/track.js" data-track-action="Article Read"></script>\n</body>');

    return new Response(modified, {
      status: response.status,
      headers: response.headers
    });
  }
}
