export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    navigator.serviceWorker?.ready.then(() => {
      console.log("Service Worker: Ready")
    })
  }
})
