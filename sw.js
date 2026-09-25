var CACHE = 'banana-party-20260925-1';
var FILES = ['./', './index.html', './style.css?v=20260925-1', './learning-gate.js?v=20260925-1', './vendor/phaser.min.js?v=3.70.0', './game.bundle.js?v=20260925-1', './pwa.js?v=20260925-1', './manifest.webmanifest', './icon.svg', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (keys) { return Promise.all(keys.filter(function (key) { return key.indexOf('banana-party-') === 0 && key !== CACHE; }).map(function (key) { return caches.delete(key); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET' || event.request.url.indexOf(self.registration.scope) !== 0) return;
    event.respondWith(fetch(event.request).then(function (response) {
        if (response.ok) { var copy = response.clone(); event.waitUntil(caches.open(CACHE).then(function (cache) { return cache.put(event.request, copy); })); }
        return response;
    }).catch(function () { return caches.match(event.request).then(function (cached) { if (cached) return cached; if (event.request.mode === 'navigate') return caches.match('./index.html'); return Response.error(); }); }));
});
