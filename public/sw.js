const CACHE_VERSION = "escola-da-fe-v6.0.0";

const CACHE_KEYS = {
  static: `${CACHE_VERSION}-static`,
  assets: `${CACHE_VERSION}-assets`,
  images: `${CACHE_VERSION}-images`,
  manifest: `${CACHE_VERSION}-manifest`
};

const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo_pwa_icon.png"
];

// Install Event: Cache immediate shell resources and skip waiting instantly
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force active immediately without waiting for user to close tabs
  event.waitUntil(
    caches.open(CACHE_KEYS.static).then((cache) => {
      console.log("[Service Worker] Pre-caching core shell assets");
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// Activate Event: Sweep and delete all old cache categories to preserve storage health
self.addEventListener("activate", (event) => {
  const currentCacheNames = Object.values(CACHE_KEYS);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCacheNames.includes(cacheName)) {
            console.log("[Service Worker] Purging outdated or faulty cache category:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Immediately control all open clients/tabs
    })
  );
});

// Fetch Event: Direct static requests, versioned cache matching, navigation fallback routing
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip caching non-GET requests (e.g., API requests, DB mutations)
  if (event.request.method !== "GET") {
    return;
  }

  // Skip browser extensions or deep third-party non-HTTP/S calls
  if (!event.request.url.startsWith("http")) {
    return;
  }

  // API endpoints and Supabase: Network-first execution with offline message fallback, never cache
  if (requestUrl.pathname.startsWith("/api/") || requestUrl.hostname.includes("supabase")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "Você está offline. Perguntas e sincronizações requerem conexão à internet." }),
          { headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  // SPA Navigation fallback: All navigation request paths (like /teologia, /curso) receive the root index.html
  // This avoids any 404 errors when deep routing or returning to the app from background.
  if (event.request.mode === "navigate" || requestUrl.pathname.endsWith(".html") || !requestUrl.pathname.includes(".")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_KEYS.static).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match("/index.html") || caches.match("/");
        })
    );
    return;
  }

  // Categorize standard assets to split caches accordingly (Manifest vs Assets vs Images vs Base)
  let selectedCacheName = CACHE_KEYS.static;
  if (requestUrl.pathname.match(/\.(js|css)$/) || requestUrl.pathname.includes("/assets/")) {
    selectedCacheName = CACHE_KEYS.assets;
  } else if (requestUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
    selectedCacheName = CACHE_KEYS.images;
  } else if (requestUrl.pathname.endsWith("manifest.json")) {
    selectedCacheName = CACHE_KEYS.manifest;
  }

  // Stale-While-Revalidate Strategy for files to keep boots instant while downloading the latest assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Direct network pull to update the cache in background
      const fetchPromise = fetch(event.request, { cache: "no-cache" })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(selectedCacheName).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          console.warn("[Service Worker] Offline fallback for asset:", requestUrl.pathname, err);
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Event Listener for forced reload triggers from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
