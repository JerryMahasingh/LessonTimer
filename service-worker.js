const CACHE_NAME = 'lesson-timer-cache-v1'; // Version your cache for easy updates
const urlsToCache = [
    '/',
    '/index.html',
    '/scheduler.html',
    '/styles.css',  // Add any additional files here
    '/script.js',    // Include your JavaScript files if needed
    '/images/logo.png' // Include any images you want to cache
];

navigator.serviceWorker.register('/service-worker.js', { scope: '/' });

// Install event: Cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching app shell');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate event: Cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log(`Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event: Serve cached content or fetch from network
self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Message event: Handle messages from the client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
