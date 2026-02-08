// ========================================
// EduMeet - Service Worker
// Progressive Web App Support
// ========================================

const CACHE_NAME = 'edumeet-v1.0.0';
const RUNTIME_CACHE = 'edumeet-runtime';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/login.html',
  '/index.html',
  '/css/style.css',
  '/css/themes.css',
  '/js/main.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip API calls from caching (always fetch fresh)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: 'Offline - API unavailable',
              offline: true 
            }),
            { 
              headers: { 'Content-Type': 'application/json' },
              status: 503
            }
          );
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version and update cache in background
          fetchAndCache(request);
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetchAndCache(request);
      })
      .catch(() => {
        // Network failed, try to return offline page
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Helper function to fetch and cache
function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      // Don't cache non-successful responses
      if (!response || response.status !== 200 || response.type === 'error') {
        return response;
      }

      // Clone the response
      const responseToCache = response.clone();

      // Cache the fetched response
      caches.open(RUNTIME_CACHE)
        .then((cache) => {
          cache.put(request, responseToCache);
        });

      return response;
    });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  }
});

// Sync bookings when back online
async function syncBookings() {
  try {
    // Get pending bookings from IndexedDB
    const pendingBookings = await getPendingBookings();
    
    // Send each booking to server
    for (const booking of pendingBookings) {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
    }
    
    // Clear pending bookings
    await clearPendingBookings();
    
    console.log('[Service Worker] Bookings synced successfully');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'EduMeet Notification';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Open', icon: '/icons/icon-96x96.png' },
      { action: 'close', title: 'Close', icon: '/icons/icon-96x96.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if there's already a window open
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Message handler
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
});

// Helper functions for IndexedDB (for offline storage)
function getPendingBookings() {
  return new Promise((resolve) => {
    // Implement IndexedDB logic here
    resolve([]);
  });
}

function clearPendingBookings() {
  return new Promise((resolve) => {
    // Implement IndexedDB logic here
    resolve();
  });
}

console.log('[Service Worker] Loaded successfully');
