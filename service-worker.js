const CACHE_NAME = 'lesson-timer-cache-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/scheduler.html',
    '/styles.css',
    '/script.js',
    '/images/logo.png'
];

// Install event: Cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching app shell');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Activate event: Cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event: Serve cached content or fetch from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Use cache if available, otherwise fetch from network
            return response || fetch(event.request).catch(() => {
                console.warn(`Network request failed for ${event.request.url}`);
                // Optional: return a placeholder or a cached default if network fails
            });
        })
    );
});

// Message event: Handle messages from the client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
