// Service Worker
var CACHE_NAME = 'frappe-cache-v1';

var urlsToCache = [
    '/',
    '/assets/finbyzweb/js/manifest.json',
    '{{ (favicon or "/assets/frappe/images/favicon.png") | abs_url }}',
    // CSS
    'https://cdn.jsdelivr.net/combine/npm/bootstrap-css-only@4.1.0/css/bootstrap.min.css',
    // JS
    'https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js',
	
];

// Install stage sets up the index page (home page) in the cache and opens a new cache
this.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache)
                    .catch(function (err) {
                        // console.log('[SW] Cache install Failed: ' + err);
                    });
            }).catch(function (err) {
                // console.log('[SW] Install Failed: ' + err);
            })
    );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (!response) {
                    return handleNoCacheMatch(event);
                }
                // Update cache record in the background
                fetchFromNetworkAndCache(event);
                // Reply with stale data
                if(response.status == 400){
                    return;
                }
                return response;
            })
    );
});

// When activating the Service Worker, clear older caches
this.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (key) {
                clearCache(key);
            }));
        }));
});

// Respond to 'push' events and trigger notifications on the registration
this.addEventListener('push', function (event) {
    let title = (event.data && event.data.text());
    let tag = "push-frappe-notification";
    let icon = '{{ (favicon or "/assets/frappe/images/favicon.png") | abs_url }}';

    event.waitUntil(
        self.registration.showNotification(title, { icon, tag })
    );
});


function fetchFromNetworkAndCache(event) {
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return;
    }

    return fetch(event.request).then(function (res) {
        // foreign requests may be res.type === 'opaque' and missing a url
        if (!res.url) {
            return res;
        }
        // Only cache GET requests
        if (event.request.method !== 'GET') {
            return res;
        }
        // regardless, we don't want to cache other origin's assets
        if (new URL(res.url).origin !== location.origin) {
            return res;
        }
        // If request was success, add or update it in the cache
      
        updateCache(event.request, res.clone());
        // TODO: figure out if the content is new and therefore the page needs a reload.

        return res;
    }).catch(function (err) {
        console.error(event.request.url, err);
        return fromCache(event.request);
    });
}

function handleNoCacheMatch(event) {
    return fetchFromNetworkAndCache(event);
}

function fromCache(request) {
    // Check to see if you have it in the cache
    // Return response
    // If not in the cache, then return error page
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status === 404) {
                return Promise.reject("no-match");
            }

            return matching;
        });
    });
}

function updateCache(request, response) {
        if (request.url.includes("pwa.js") || request.url.includes("website_script.js") || request.url.includes("logout") || request.url.includes("/assets/css/") || request.url.includes("/assets/js/") || request.url.includes("report") || request.url.includes("finbyzerp") || request.url.includes("erpnext") || request.url.includes("api/method") || request.url.includes("/socket.io/") || request.url.includes("desk")  ||  request.url.includes("app") || request.url.includes("login") ){
           return 
        }else{
            if(response.status == 200){
                caches.keys().then(function(CACHE_NAME) {
                    CACHE_NAME.forEach(function(cacheName) {
                      caches.delete(cacheName);
                    });
                });
                
            }
        }
    clearCache()
}

function clearCache(key) {
    if (key !== CACHE_NAME) {
        return caches.delete(key);
    }
}