const CACHE_NAME = "restaurant-pwa-v1";

// Always cached core files
const CORE_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./menu.json",
    "./css/stylesheet.css",
    "./js/script.js"
];

// Auto-cache these folders
const FOLDER_PATTERNS = [
    "/images/",
    "/icon/",
    "/js/",
    "/css/"
];

// INSTALL — Cache core files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_FILES);
        })
    );
});

// FETCH — Folder-Level + Dynamic Caching
self.addEventListener("fetch", (event) => {
    const url = event.request.url;

    // If request is inside a folder pattern → cache it
    const shouldCache = FOLDER_PATTERNS.some(folder => url.includes(folder));

    if (shouldCache) {
        event.respondWith(
            caches.match(event.request).then(cachedRes => {
                return cachedRes || fetch(event.request).then(networkRes => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkRes.clone());
                        return networkRes;
                    });
                });
            })
        );
        return;
    }

    // Default: Network-first fallback to cache
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
