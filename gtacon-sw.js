// =================================================================
// GTACON SERVICE WORKER
// Filename: gtacon-sw.js
// Deploy to: root of 56vicelane.com
// =================================================================
// Handles:
// - Offline caching (page works without internet)
// - Background sync (checks condition even when app is closed)
// - Push notifications (future: notify when condition changes)
// =================================================================

const CACHE_NAME = 'gtacon-v1';
const WORKER_URL = 'https://gtacon-worker.56vicelane.workers.dev/gtacon-status';

// Files to cache for offline use
const CACHE_FILES = [
  '/gtacon.html',
  '/gtacon.json',
  '/gtacon-manifest.json',
  '/favicon.ico',
];

// ── INSTALL: Cache core files ────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[GTACON SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_FILES).catch(err => {
        console.log('[GTACON SW] Cache error:', err);
      });
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: Clean old caches ───────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: Serve from cache, update in background ────────────────
self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // For the worker API calls — always go network first
  if (event.request.url.includes('workers.dev')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Return cached version immediately
      const networkFetch = fetch(event.request).then((response) => {
        // Update cache in background
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || networkFetch;
    })
  );
});

// ── PUSH NOTIFICATIONS (future use) ─────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'GTACON Update', {
      body: data.body || 'The GTA 6 launch readiness condition has changed.',
      icon: '/images/gtacon-icon-192.png',
      badge: '/images/gtacon-icon-96.png',
      tag: 'gtacon-update',
      renotify: true,
      data: { url: '/gtacon.html' },
      actions: [
        { action: 'view', title: 'View GTACON' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })
  );
});

// ── NOTIFICATION CLICK ───────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('gtacon') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/gtacon.html');
      }
    })
  );
});

// ── PERIODIC BACKGROUND SYNC (Chrome Android) ───────────────────
// Checks condition every hour even when app is closed
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'gtacon-check') {
    event.waitUntil(checkConditionInBackground());
  }
});

async function checkConditionInBackground() {
  try {
    const response = await fetch(WORKER_URL + '?v=' + Date.now());
    if (!response.ok) return;
    const data = await response.json();

    // Update the cached gtacon.json
    const cache = await caches.open(CACHE_NAME);
    const jsonResponse = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put('/gtacon.json', jsonResponse);

    console.log('[GTACON SW] Background check complete. Condition:', data.condition);
  } catch (err) {
    console.log('[GTACON SW] Background check failed:', err);
  }
}
