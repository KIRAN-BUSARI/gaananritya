// Enhanced service worker for performance optimization
const CACHE_NAME = 'gaananritya-v1';
const STATIC_CACHE = 'static-v1';
const IMAGE_CACHE = 'images-v1';
const API_CACHE = 'api-v1';

// Resources to cache immediately
const STATIC_RESOURCES = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Add critical CSS and JS files here
];

// Image optimization settings
const IMAGE_CACHE_CONFIG = {
  maxEntries: 100,
  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
};

// API cache settings
const API_CACHE_CONFIG = {
  maxEntries: 50,
  maxAgeSeconds: 24 * 60 * 60, // 1 day
};

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_RESOURCES);
      }),
      self.skipWaiting(),
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== IMAGE_CACHE &&
              cacheName !== API_CACHE
            ) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim(),
    ])
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    if (isImageRequest(request)) {
      event.respondWith(handleImageRequest(request));
    } else if (isAPIRequest(request)) {
      event.respondWith(handleAPIRequest(request));
    } else if (isStaticAsset(request)) {
      event.respondWith(handleStaticAsset(request));
    } else {
      event.respondWith(handleNavigationRequest(request));
    }
  }
});

// Check if request is for an image
function isImageRequest(request) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(new URL(request.url).pathname);
}

// Check if request is for API
function isAPIRequest(request) {
  return request.url.includes('/api/');
}

// Check if request is for static asset
function isStaticAsset(request) {
  return /\.(css|js|woff|woff2|ttf|eot)$/i.test(new URL(request.url).pathname);
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);

  try {
    // Try cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Clone and cache the response
      const responseClone = networkResponse.clone();

      // Implement cache size limit
      await maintainCacheSize(cache, IMAGE_CACHE_CONFIG.maxEntries);
      await cache.put(request, responseClone);
    }

    return networkResponse;
  } catch (error) {
    // Return a fallback image if available
    const fallbackResponse = await cache.match('/images/fallback.webp');
    return fallbackResponse || new Response('Image not available', { status: 404 });
  }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE);

  try {
    // Try network first for fresh data
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Clone and cache the response
      const responseClone = networkResponse.clone();
      await maintainCacheSize(cache, API_CACHE_CONFIG.maxEntries);
      await cache.put(request, responseClone);
    }

    return networkResponse;
  } catch (error) {
    // Fall back to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return error response
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE);

  try {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    return new Response('Asset not available', { status: 404 });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  const cache = await caches.open(STATIC_CACHE);

  try {
    // Try network first for HTML
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Fall back to cached version or offline page
    const cachedResponse = await cache.match(request) || await cache.match('/offline.html');
    return cachedResponse || new Response('Page not available offline', { status: 503 });
  }
}

// Maintain cache size limit
async function maintainCacheSize(cache, maxEntries) {
  const keys = await cache.keys();

  if (keys.length >= maxEntries) {
    // Remove oldest entries (simple FIFO strategy)
    const entriesToDelete = keys.slice(0, keys.length - maxEntries + 1);
    await Promise.all(entriesToDelete.map(key => cache.delete(key)));
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle any pending offline actions
  console.log('Background sync triggered');
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
      actions: [
        {
          action: 'explore',
          title: 'Go to the site',
          icon: '/images/checkmark.png',
        },
        {
          action: 'close',
          title: 'Close the notification',
          icon: '/images/xmark.png',
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification('Gaananritya', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for manual cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'CACHE_URLS':
        event.waitUntil(cacheUrls(event.data.urls));
        break;
      case 'CLEAR_CACHE':
        event.waitUntil(clearCache(event.data.cacheName));
        break;
    }
  }
});

async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(urls);
}

async function clearCache(cacheName) {
  await caches.delete(cacheName || CACHE_NAME);
}
