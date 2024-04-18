// const CACHE_STATIC_NAME = 'cache-1';
// const CACHE_DYNAMIC_NAME = 'cache-dynamic-1';
//
// // eslint-disable-next-line no-restricted-globals
// self.addEventListener('install', e => {
//
//
//     e.waitUntil(
//         caches.open(CACHE_STATIC_NAME).then(cache=>{
//             cache.add('/logo512.png')
//
//
//             return cache.addAll([
//                 '/',
//                 '/index.html',
//                 '/manifest.json',
//                 '/logo192.png',
//                 '/login',
//                 '/signup',
//                 '/home',
//                 '/income',
//                 '/outcome',
//                 '/planner',
//                 'favicon.ico'
//
//             ])
//         })
//     )
//
// });

// eslint-disable-next-line no-restricted-globals
// self.addEventListener('fetch', e=>{
//     // cacge with network fallback
//     const respuesta = caches.match(e.request)
//         .then( res => {
//             if (res) return res;
//
//             return fetch( e.request )
//                 .then(newRes => {
//
//                     caches.open(CACHE_DYNAMIC_NAME).then(cache => {
//                         cache.put(e.request, newRes);
//                     });
//
//                     return newRes.clone();
//                 })
//
//         })
//     e.respondWith(respuesta);
//
// })