// sw.js - Service Worker for PWA

const CACHE_NAME = 'dairy-farm-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/responsive.css',
    '/js/app.js',
    '/js/data.js',
    '/js/navigation.js',
    '/js/forms.js',
    '/js/notifications.js',
    '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', function(event) {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
    );
});

// Activate Service Worker
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('Service Worker: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch Strategy: Cache First, Network Fallback
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                var fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        var responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }
                );
            })
    );
});

// Background Sync for offline data
self.addEventListener('sync', function(event) {
    if (event.tag === 'dairy-data-sync') {
        event.waitUntil(
            syncOfflineData()
        );
    }
});

function syncOfflineData() {
    return new Promise((resolve, reject) => {
        // Get offline data from IndexedDB or localStorage
        // Send to server when back online
        console.log('Syncing offline data...');
        
        // Implementation would sync data with server
        resolve();
    });
}

// Push Notification Handler
self.addEventListener('push', function(event) {
    console.log('Service Worker: Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'New farm notification!',
        icon: 'assets/icons/icon-192x192.png',
        badge: 'assets/icons/icon-96x96.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Farm',
                icon: 'assets/icons/dashboard-icon-96x96.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: 'assets/icons/close-icon-96x96.png'
            }
        ],
        tag: 'dairy-farm-notification',
        requireInteraction: true
    };
    
    event.waitUntil(
        self.registration.showNotification('Dairy Farm Alert', options)
    );
});

// Notification Click Handler
self.addEventListener('notificationclick', function(event) {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.matchAll().then(function(clientList) {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return clients.openWindow('/');
            })
        );
    }
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
    console.log('Service Worker: Notification closed');
});

// Periodic Background Sync (if supported)
self.addEventListener('periodicsync', function(event) {
    if (event.tag === 'dairy-farm-sync') {
        event.waitUntil(
            periodicSync()
        );
    }
});

function periodicSync() {
    return new Promise((resolve) => {
        console.log('Periodic sync: Checking for updates...');
        
        // Check for critical alerts
        // Update cached data
        // Sync with server if available
        
        resolve();
    });
}

// Handle app updates
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Error handling
self.addEventListener('error', function(event) {
    console.error('Service Worker error:', event.error);
});

// Unhandled promise rejection
self.addEventListener('unhandledrejection', function(event) {
    console.error('Service Worker unhandled promise rejection:', event.reason);
});

// Handle app shortcuts
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    let url = '/';
    
    if (event.action === 'add-milk') {
        url = '/#milk';
    } else if (event.action === 'view-dashboard') {
        url = '/#dashboard';
    } else if (event.action === 'view-alerts') {
        url = '/#alerts';
    }
    
    event.waitUntil(
        clients.matchAll().then(function(clientList) {
            if (clientList.length > 0) {
                return clientList[0].navigate(url).then(client => client.focus());
            }
            return clients.openWindow(url);
        })
    );
});

// Cache management
function cleanupOldCaches() {
    const expectedCaches = [CACHE_NAME];
    
    return caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
                if (!expectedCaches.includes(cacheName)) {
                    console.log('Deleting old cache:', cacheName);
                    return caches.delete(cacheName);
                }
            })
        );
    });
}

// Update cache strategy
function updateCache() {
    return caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(urlsToCache);
    });
}

// Network-first strategy for API calls
function networkFirst(request) {
    return fetch(request).then(response => {
        if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
            });
        }
        return response;
    }).catch(() => {
        return caches.match(request);
    });
}

// Cache-first strategy for assets
function cacheFirst(request) {
    return caches.match(request).then(response => {
        if (response) {
            return response;
        }
        return fetch(request).then(response => {
            if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, responseClone);
                });
            }
            return response;
        });
    });
}

console.log('Service Worker: Ready for dairy farm management!');