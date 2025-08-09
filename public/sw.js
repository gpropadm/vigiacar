const CACHE_NAME = 'vigiacar-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/login',
  '/register',
  '/offline.html'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Alerta do VigiaCar',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver no App',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('VigiaCar', options)
  )
})