/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { clientsClaim } from "workbox-core"
import { NavigationRoute, registerRoute } from "workbox-routing"
import { CacheFirst } from "workbox-strategies"
import { CacheableResponsePlugin } from "workbox-cacheable-response"
import { ExpirationPlugin } from "workbox-expiration"

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)
// precacheAndRoute([{ url: "/", revision: null }])

// // clean old assets
cleanupOutdatedCaches()

// let allowlist: undefined | RegExp[]
// if (import.meta.env.DEV) allowlist = [/^\/$/]
// // const allowlist: RegExp[] = [/^\/$/]

// // to allow work offline
// registerRoute(new NavigationRoute(createHandlerBoundToURL("/"), { allowlist }))

// registerRoute(
//   ({ url }) => url.pathname.includes("bank/list-banks"),
//   new CacheFirst({
//     cacheName: "bank-list-cache",
//     plugins: [new CacheableResponsePlugin({ statuses: [200] }), new ExpirationPlugin({ maxAgeSeconds: 60 * 60 * 24 * 7, maxEntries: 1 })],
//   })
// )

// self.skipWaiting()
// clientsClaim()
