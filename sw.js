// VOZX RideCompare Service Worker (PWA Offline Support with Network-First Strategy)
const CACHE_NAME = 'ridecompare-offline-v53';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css?v=53',
  './js/app.js?v=53',
  './js/profile.js?v=53',
  './js/audio.js?v=26',
  './assets/images/logo_cropped_clean.png',
  './assets/images/logo.png'
];

// Install: Cache essential assets and immediately take over
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

// Activate: Delete all previous stale caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network First, Fallback to Cache when completely offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Only return cached response if device is truly offline / fetch failed
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html') || caches.match('./');
          }
        });
      })
  );
});
