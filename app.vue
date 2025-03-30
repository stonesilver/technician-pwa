<script setup type="ts">

onMounted(() => {
  // disable IOS scaling
    if (navigator.userAgent.indexOf("iPhone") > -1) {
      document
        .querySelector("[name=viewport]")
        .setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1")
    }
})

const { showModal, installPWA } = useInstallPwa()
const nuxtApp = useNuxtApp()
const route = useRoute()


const handleActionOnClick = () => {
  // newWorker.postMessage({ type: "SKIP_WAITING" })
  nuxtApp.$pwa.updateServiceWorker(true)
  window.location.reload()
  nuxtApp.$pwa.getSWRegistration(registration => {
    registration.waiting.postMessage({ type: "SKIP_WAITING" })
  })
}

watch(() => nuxtApp.$pwa.needRefresh, (show) => {
  console.log(show, 'needRefresh triggered')
  if (show) {
    useToast.info("New update available!", {
      action: {label: "Update", onClick: () => handleActionOnClick()},
      duration: Infinity,
      classes: { actionButton: "!bg-blue-500" },
    });
  }
}, { immediate: true });

const showInstallModal = computed(() => {
  return nuxtApp.$pwa?.showInstallPrompt && route.meta.layout === 'default'
})

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.addEventListener('controllerchange', () => {
//     useToast.info("New update available.", {
//     action: { label: "Update", onClick: handleActionOnClick },
//     duration: Infinity,
//     classes: { actionButton: "!bg-blue-500" },
//   })
//   });
// }
</script>

<template>
  <div vaul-drawer-wrapper class="flex-1 flex flex-col">
    <NuxtRouteAnnouncer />
    <NuxtPwaManifest />
    <NuxtLayout>
      <Toaster richColors position="top-center" />
      <NuxtPage />

      <layout-install-pwa-modal :model-value="showInstallModal" @install-pwa="installPWA" />
      <!-- <layout-install-pwa-modal v-model="showModal" @install-pwa="installPWA" /> -->
    </NuxtLayout>
  </div>
</template>
