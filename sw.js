const CACHE_STATIC_NAME = 'cache-static-v2';
const CACHE_DYNAMIC_NAME = 'cache-dynamic-v1';
const CACHE_IMMUTABLE_NAME = 'cache-immutable-v1'
const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.json',
    '/logo192.png',
    '/login',
    '/signup',
    '/home',
    '/income',
    '/outcome',
    '/planner',
    'favicon.ico',
    '/logo512.png',
    '/edit',
    '../src/pages/signup.js',
    '../src/pages/login.js',
    '../src/pages/'
]

const APP_SHELL_IMMUTABLE = [
    '../src/modules/Table.js',
    '../src/modules/FilterCategory',
    '../config/ThemeMUI'
]


function updateDynamicCache( dynamicCache, req, res) {
    if(res.ok) {
        return caches.open(dynamicCache).then(cache=>{
            cache.put(req, res.clone())
            return res.clone();
        })
    } else {
        return res;
    }
}

// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', e => {

    const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache=> cache.addAll(APP_SHELL));

    const cacheImmutable = caches.open(CACHE_IMMUTABLE_NAME).then(cache=> cache.addAll(APP_SHELL_IMMUTABLE));

    e.waitUntil(Promise.all([cacheImmutable, cacheStatic]))

});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', e=>{



    const response = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== CACHE_STATIC_NAME && key.includes('static')) {
                return caches.delete(key)
            }
            if (key !== CACHE_IMMUTABLE_NAME && key.includes('immutable')){
                return caches.delete(key);
            }
            if (key !== CACHE_DYNAMIC_NAME && key.includes('dynamic')){
                return caches.delete(key);
            }
        })
    })
    e.waitUntil(response)

});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', event => {

    event.respondWith(event.request);
});


