
// Service Worker pour EazyCongo
const CACHE_NAME = 'eazycongo-v1';

// Liste des ressources à mettre en cache
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  '/assets/logo.png',
  '/offline.html',
  // Ajoutez d'autres ressources statiques selon vos besoins
];

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du service worker et suppression des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes fetch
self.addEventListener('fetch', event => {
  // Stratégie réseau d'abord, puis cache en cas d'échec
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la requête a réussi, cloner la réponse et la mettre en cache
        if (event.request.method === 'GET' && !event.request.url.includes('/api/')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // En cas d'échec, essayer de récupérer du cache
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            
            // Si la ressource n'est pas dans le cache, retourner la page hors ligne
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Pour les autres ressources, retourner une réponse vide
            return new Response(null, { status: 404 });
          });
      })
  );
});

// Synchronisation en arrière-plan
self.addEventListener('sync', event => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

// Fonction pour synchroniser les commandes
async function syncOrders() {
  try {
    const pendingOrders = await getPendingOrders();
    
    for (const order of pendingOrders) {
      await sendOrderToServer(order);
    }
    
    // Nettoyer les commandes traitées
    await clearPendingOrders();
  } catch (error) {
    console.error('Erreur de synchronisation:', error);
  }
}

// Ces fonctions devraient être implémentées dans IndexedDB
async function getPendingOrders() {
  // Implémentation à faire avec IndexedDB
  return [];
}

async function sendOrderToServer(order) {
  // Implémentation à faire
}

async function clearPendingOrders() {
  // Implémentation à faire avec IndexedDB
}

// Notification push
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/assets/logo.png',
    badge: '/assets/badge.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Clic sur notification
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
