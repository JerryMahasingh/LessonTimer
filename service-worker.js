const CACHE_NAME = 'lesson-timer-cache-v4';
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
    if (event.request.mode === 'navigate') {
        // If it's a navigation request (like a page refresh), try cache first for index.html
        event.respondWith(
            caches.match('/index.html').then((cachedResponse) => {
                return cachedResponse || fetch(event.request).catch(() => {
                    console.warn('Failed to fetch; serving cached index.html as fallback');
                    return caches.match('/index.html');
                });
            })
        );
    } else {
        // For non-navigation requests, apply cache-first strategy
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).catch(() => {
                    console.warn(`Network request failed for ${event.request.url}`);
                });
            })
        );
    }
});

// Message event: Handle messages from the client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
