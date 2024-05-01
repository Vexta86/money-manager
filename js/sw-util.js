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

