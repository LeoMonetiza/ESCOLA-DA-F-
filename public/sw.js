const CACHE_NAME = "escola-da-fe-cache-v3";

// Minimal static assets to pre-cache to provide instant initial shell load
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo_pwa_icon.png"
];

// Install event: Pre-cache basic offline assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline shell");
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      // Force immediate activation
      return self.skipWaiting();
    })
  );
});

// Activate event: Clean up prior old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Cleaning old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event: Intelligent caching strategy (Stale-While-Revalidate & Network fallback)
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip caching non-GET requests (e.g. API POST requests to OpenAI/Gemini or third-party webhooks)
  if (event.request.method !== "GET") {
    return;
  }

  // Skip browser extensions or other non-http/https protocols
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith("http")) {
    return;
  }

  // For server-side AI endpoints, external API routes, or Supabase, fetch from network first, never cache
  if (requestUrl.pathname.startsWith("/api/") || requestUrl.hostname.includes("supabase")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: "Você está offline. Perguntas à IA requerem conexão de internet." }), {
          headers: { "Content-Type": "application/json" }
        });
      })
    );
    return;
  }

  // Stale-While-Revalidate Strategy for site assets (js, css, images) and documents
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Serve cached answer immediately if available, but fetch updated copy in the background
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cache valid successful responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.warn("[Service Worker] Fetch failed, serving cached copy if exists: ", err);
      });

      // Returns the cached file if found, otherwise waits for network fetching promise
      return cachedResponse || fetchPromise;
    })
  );
});

// Handle custom skip waiting message from app when an update is approved by the user
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
