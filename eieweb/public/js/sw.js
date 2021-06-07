// Perform install steps
let CACHE_NAME = 'my-cache';
let urlsToCache = [
    'https://www.eieinstruments.com/files/website_theme/eie_1fdde0fa.css.pagespeed.ce.51ecbPa9dc.css',
    'https://www.eieinstruments.com/files/eie-logo.svg',
    '/eieweb/public/js/manifest.min.json',
    '/assets/eieweb/js/eie.js'
    ];

// self.addEventListener('install', function(event) {
// // Perform install steps
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//         .then(function(cache) {
//             console.log('Opened cache');
//         return cache.addAll(urlsToCache);
//         })
//     );
// });
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
});