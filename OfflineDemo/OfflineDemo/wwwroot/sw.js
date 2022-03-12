const CACHE_NAME = "demo-cache-v2";

const STATIC_ASSETS = [
    '/lib/bootstrap/dist/css/bootstrap.min.css',
    '/css/site.css',
    '/lib/jquery/dist/jquery.min.js',
    '/lib/bootstrap/dist/js/bootstrap.bundle.min.js',
    '/js/site.js',
    '/favicon.ico',
    '/',
    '/Home/Privacy'
    //,'/OfflineDemo.styles.css'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(STATIC_ASSETS);
            })
    );

    console.log("Installed service worker");
});

self.addEventListener('activate', function (event) {

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (CACHE_NAME != cacheName) {
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    console.log("Activated service worker");
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    console.log("Returning from cache: " + event.request.url);
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});

