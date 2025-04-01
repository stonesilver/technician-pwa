/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { precacheAndRoute } from "workbox-precaching"
import { registerRoute } from "workbox-routing"
import { CacheFirst, NetworkFirst } from "workbox-strategies"
import { CacheableResponsePlugin } from "workbox-cacheable-response"
import { ExpirationPlugin } from "workbox-expiration"

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// Use NetworkFirst for all navigation requests
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: "pages-cache",
  })
)

registerRoute(
  ({ url }) => url.pathname.includes("bank/list-banks"),
  new CacheFirst({
    cacheName: "bank-list-cache",
    plugins: [new CacheableResponsePlugin({ statuses: [200] }), new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 7, maxEntries: 1 })],
  })
)

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((cache) => caches.delete(cache)))
    })
  )
  self.clients.claim() // Takes control of open pages immediately
})

self.addEventListener("message", (event) => {
  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting() // Activate the new SW
  }
})
