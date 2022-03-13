const CACHE_NAME = 'insp-cache';
const urlsToCache = [
    '/lib/bootstrap/dist/css/bootstrap.min.css',
    '/css/site.css',
    '/lib/jquery/dist/jquery.min.js',
    '/lib/bootstrap/dist/js/bootstrap.bundle.min.js',
    '/js/site.js',
    '/Home/Privacy',
    '/favicon.ico',
    '/OfflineDemo.styles.css'
];
const offlineInspectionUrl = '/Home/Privacy?inspectionId=';

self.addEventListener('install', function (evt) {
    console.log('Install inspections service worker');
    evt.waitUntil(precache());
    console.log('Succesfully installed inspections service worker');
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
});

function precache() {
    return caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(urlsToCache);
    });
}

self.addEventListener('fetch', function (evt) {
    if (IsCacheableItem(evt.request.url)) {

        evt.respondWith(fromNetwork(evt.request, 2000).catch(function () {
            console.log('Error on fecth from network. ');
            return fromCache(evt.request);
        }));

    } else {
        console.log('Fetch not cacheable item: ' + evt.request.url);
        evt.respondWith(fetch(evt.request));
    }
});


function fromNetwork(request, timeout) {
    var url = request.url;
    console.log('Try to fecth from network: ' + url);
    return new Promise(function (fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then(function (response) {
            clearTimeout(timeoutId);
            if (request.url.includes(offlineInspectionUrl)) {
                url = request.url.split('?')[0];
            }
            console.log('Fetch from network successful: ' + url);
            caches.open(CACHE_NAME).then(function (cache) {
                console.log('Try to add to cache ' + url);
                cache.put(url, response.clone()).then(function () {
                    console.log('Cached now lets fulfill: ' + url);
                    fulfill(response);
                });
            });

        }, reject);
    });
}

function fromCache(request) {
    console.log('Try to fetch from cache: ' + request.url);
    return caches.open(CACHE_NAME).then(function (cache) {
        var ignoreSearch = request.url.includes(offlineInspectionUrl);
        var options = { 'ignoreSearch': ignoreSearch };

        return cache.match(request, options).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}


function IsCacheableItem(url) {

    var isCacheableItem = false;

    urlsToCache.forEach(function (value, index, array) {

        if (url.includes(value)) {
            isCacheableItem = true;
            return;
        }

    });

    return isCacheableItem;
}

