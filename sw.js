const CACHE_NAME = 'jmoulin-portfolio-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/style.css',
  '/assets/css/theme-vars.css',
  '/assets/css/integrations-uxui.css',
  '/assets/js/main.js',
  // Key images (add more as needed)
  '/assets/images/julien-moulin.jpg',
  // Icons for PWA
  '/assets/images/icons/icon-192x192.png',
  '/assets/images/icons/icon-512x512.png',
  // External resources (ensure server allows CORS for caching if they are not opaque)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
  // Add other JS files if they are critical for initial load and structure
  // e.g., '/assets/js/projects-loader.js', '/assets/js/realisations-loader.js'
  // '/assets/components/realisation-slider.js', // if type="module" and path is root
  // '/assets/js/realisation-slider-section.js' 
];

// Install event: open cache and add all core assets
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Opened cache:', CACHE_NAME);
        // Add all URLs to cache. If any request fails, the installation fails.
        return Promise.all(urlsToCache.map(url => {
          return fetch(new Request(url, { mode: 'cors' })) // Use CORS for external resources
            .then(response => {
              if (!response.ok) {
                // For opaque responses (like CDN no-cors), we can't check status, but they can be cached.
                // However, for critical files, it's better to ensure they are properly fetched.
                if (response.type === 'opaque') {
                   console.log(`[SW] Caching opaque response for: ${url}`);
                   return cache.put(url, response);
                }
                console.error(`[SW] Failed to fetch ${url} - Status: ${response.status}`);
                // Optionally, don't throw error for non-critical assets to allow SW install
                // For now, let's be strict for core assets.
                // throw new Error(`Failed to fetch ${url}`); 
              }
              console.log(`[SW] Caching: ${url}`);
              return cache.put(url, response);
            })
            .catch(err => {
              console.error(`[SW] Error fetching/caching ${url}:`, err);
              // To make SW installation more resilient, you might not want to throw here for non-critical assets
            });
        }));
      })
      .catch(err => {
        console.error('[SW] Cache open/add failed during install:', err);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Ensure the new service worker takes control immediately
  return self.clients.claim();
});

// Fetch event: serve from cache first, then network
self.addEventListener('fetch', event => {
  // console.log('[SW] Fetch event for:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // console.log('[SW] Serving from cache:', event.request.url);
          return cachedResponse;
        }
        // console.log('[SW] Not in cache, fetching from network:', event.request.url);
        return fetch(event.request).then(networkResponse => {
          // Optionally, cache new requests dynamically here if needed
          // For now, we are only pre-caching defined assets.
          // Be careful with caching POST requests or dynamic API calls.
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            // Example: Cache an image if it's fetched and not in precache
            // const requestUrl = event.request.url.toLowerCase();
            // if (requestUrl.includes('.png') || requestUrl.includes('.jpg') || requestUrl.includes('.jpeg') || requestUrl.includes('.gif')) {
            //   const responseToCache = networkResponse.clone();
            //   caches.open(CACHE_NAME).then(cache => {
            //     cache.put(event.request, responseToCache);
            //   });
            // }
          }
          return networkResponse;
        }).catch(error => {
          console.error('[SW] Fetch failed; returning offline page or error for:', event.request.url, error);
          // Optionally, return a generic offline fallback page:
          // if (event.request.mode === 'navigate') { // For HTML page navigations
          //   return caches.match('/offline.html'); // You would need to create and cache an offline.html
          // }
        });
      })
  );
});
