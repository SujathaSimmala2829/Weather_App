const CACHE_NAME = 'weather-app-cache-v1';
const urlsToCache = [
  'index.html',
  'styles.css',
  'script.js',
  'manifest.json',
  'images/icon1.png',
  'images/icon2.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
