// eslint-disable-next-line no-undef
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js');

function updateDynamicCache( dynamicCache, req, res) {
    if(res.ok) {
        return caches.open(dynamicCache).then(cache=>{
            cache.put(req, res.clone()).then()
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

    return db.put(body)
        .then(() => {
            // eslint-disable-next-line no-restricted-globals
            return self.registration.sync.register('new-post')
                .then(() => {
                    console.log('Task saved successfully');
                    const tempRes = { ok: true, offline: true };
                    return new Response(JSON.stringify(tempRes));
                })
                .catch(err => {
                    console.error('Could not register the task', err);
                    // Handle the error and return an appropriate response
                    const errorRes = { ok: false, error: err.message };
                    return new Response(JSON.stringify(errorRes), { status: 500 });
                });
        })
        .catch(dbErr => {
            console.error('Could not save the post to the database', dbErr);
            // Handle the database error and return an appropriate response
            const errorRes = { ok: false, offline: true, error: dbErr.message };
            return new Response(JSON.stringify(errorRes), { status: 500 });
        });
}

function postInputs() {
    const posts = [];
    return db.allDocs({include_docs: true}).then(docs => {
        docs.rows.forEach(row => {
            const doc = row.doc;


            const body = {
                'name': doc.name,
                'category': doc.category,
                'frequency': doc.frequency,
                'price': doc.price,
                'date': doc.date
            }
            const fetchProm = fetch(doc.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*',
                        'Authorization': doc.auth,
                    },
                    body: JSON.stringify(body)
                }).then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to post data');
                    } else {
                        // eslint-disable-next-line no-restricted-globals

                        return db.remove(doc);
                    }


                }).catch(err => {
                    console.error('Error posting data:', err);
            })
            posts.push(fetchProm);

        });
        return Promise.all(posts);

    })
}


function apiHandler(cacheName, req){

    if (req.clone().method === 'POST'){

        if (req.clone().url.includes('login') || req.clone().url.includes('signup')){
            return fetch(req)
        } else {
            // eslint-disable-next-line no-restricted-globals
            if(self.navigator.onLine){
                return fetch(req);
            } else {
                // eslint-disable-next-line no-restricted-globals
                if (self.registration.sync) {
                    return req.clone().text().then(body => {
                        const bodyObj = JSON.parse(body);

                        return savePost(bodyObj, req.clone().url, req.clone().headers.get('Authorization'));

                    })
                } else{
                    return fetch(req);
                }
            }

        }



    } else if (req.clone().method === 'GET') {



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

        return fetch(req)
    }


}

const CACHE_STATIC_NAME = 'cache-static-v5.2';
const CACHE_DYNAMIC_NAME = 'cache-dynamic-v1.1';
const CACHE_IMMUTABLE_NAME = 'cache-immutable-v1.1'
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

    const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache=> {
        for (const item of APP_SHELL){
            cache.add(item).catch(err => console.error(item, err));
        }

    });

    const cacheImmutable = caches.open(CACHE_IMMUTABLE_NAME).then(cache=> {
        for (const item of APP_SHELL_IMMUTABLE){
            cache.add(item).catch(err => console.error(item,err))
        }

    });

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
    console.log('Sync...')
    if ( e.tag === 'new-post' ){

        const response = postInputs();
        e.waitUntil(response);
    }

})

