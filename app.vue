<script setup type="ts">
// import { useWorkbox } from '@vite-pwa/nuxt';

onMounted(() => {
  // disable IOS scaling
    if (navigator.userAgent.indexOf("iPhone") > -1) {
      document
        .querySelector("[name=viewport]")
        .setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1")
    }
})

const { showModal, installPWA } = useInstallPwa()
// const { needRefresh, updateServiceWorker } = useWorkbox();
const nuxtApp = useNuxtApp()
const route = useRoute()


const handleActionOnClick = () => {
  // newWorker.postMessage({ type: "SKIP_WAITING" })
  //  window.location.reload()
  alert('Yes!!!!')
  updateServiceWorker(true)
}

watch(() => nuxtApp.$pwa.needRefresh, (show) => {
  if (show) {
    useToast.info("New update available!", {
      action: {label: "Update", onClick: () => handleActionOnClick()},
      duration: Infinity,
      classes: { actionButton: "!bg-blue-500" },
    });
  }
});

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
