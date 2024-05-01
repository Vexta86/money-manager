// eslint-disable-next-line no-undef
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js');

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

function updateStaticCache( staticCache, req, APP_SHELL_IMMUTABLE) {
    if(!APP_SHELL_IMMUTABLE.includes(req.url)) {
        return fetch(req).then(res=>{
            return updateDynamicCache(staticCache, req, res);
        });
    }
}


const db = new PouchDB('posting');

function savePost( body, url, auth) {

    body._id = new Date().toISOString();
    body.url = url;
    body.auth = auth;

    return db.put(body).then(()=>{

        // eslint-disable-next-line no-restricted-globals
        self.registration.sync.register('new-post');

        const tempRes = { ok: true, offline: true};
        console.log('Request saved for future posting')
        return new Response(JSON.stringify(tempRes));


    })
}

function postInputs() {

    const posts = [];



    return db.allDocs({include_docs: true}).then(docs => {
        docs.rows.forEach(row => {
            const doc = row.doc;

            console.log(doc);

            const fetchProm = fetch(doc.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Authorization': doc.auth,
                    },
                    body: JSON.stringify(doc)
                }).then(res => {
                    return db.remove(doc)
                });
            posts.push(fetchProm);

        });
        return Promise.all(posts);

    })
}


function apiHandler(cacheName, req){
    const cloned = req.clone();
    if (cloned.method === 'POST'){

        if (cloned.url.includes('login') || cloned.url.includes('signup')){
            return fetch(req)
        } else {

            // eslint-disable-next-line no-restricted-globals
            if (self.registration.sync) {
                return req.clone().text().then(body => {
                    const bodyObj = JSON.parse(body);

                    return savePost(bodyObj, cloned.url, cloned.headers.get('Authorization'));

                })
            } else {
                return fetch(req);
            }
        }



    } else if (cloned.method === 'GET') {




        return fetch( req ).then( res => {
            if (res.ok ){
                updateDynamicCache(cacheName, req, res.clone()).then();
                return res.clone();
            } else {
                return caches.match(req);
            }
        }).catch(e=>{
            return caches.match(req)
        })
    } else {
        console.log('searching th web');
        return fetch(req)
    }


}

const CACHE_STATIC_NAME = 'cache-static-v5.2';
const CACHE_DYNAMIC_NAME = 'cache-dynamic-v1';
const CACHE_IMMUTABLE_NAME = 'cache-immutable-v1'
const APP_SHELL = [
    '/',

    '/money-manager/favicon.ico',
    '/money-manager/home',
    '/money-manager/income',
    '/money-manager/login',
    '/money-manager/outcome',

    '/money-manager/planner',
    '/money-manager/manifest.json',
    '/money-manager/logo192.png',
]

const APP_SHELL_IMMUTABLE = [
    'https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js',
    '../src/modules/Table.js',
    '../src/modules/FilterCategory',
    '../config/ThemeMUI',

]




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
self.addEventListener('fetch', e => {
    let response;

    //money-manager-api

    if (e.request.url.includes('money-manager-api')) {
        console.log('TO the api')
        response = apiHandler(CACHE_DYNAMIC_NAME, e.request);
    } else  {
        response = caches.match(e.request).then( res => {



            if (res) {

                updateStaticCache(CACHE_STATIC_NAME, e.request, APP_SHELL_IMMUTABLE).then();
                return res;
            } else {

                return fetch(e.request).then(newRes => {
                    return updateDynamicCache(CACHE_DYNAMIC_NAME,e.request, newRes)
                })
            }
        })
    }



    e.respondWith(response);
});



// eslint-disable-next-line no-restricted-globals
self.addEventListener('sync', e =>{
    console.log('SW: sync');
    if ( e.tag === 'new-post' ){

        const response = postInputs();
        e.waitUntil(response);
    }

})

