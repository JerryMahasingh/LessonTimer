const CACHE_NAME = 'lesson-timer-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/scheduler.html',
  '/styles.css',  // Add any additional files here
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
