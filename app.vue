<script setup type="ts">

onMounted(() => {
  // disable IOS scaling
    if (navigator.userAgent.indexOf("iPhone") > -1) {
      document
        .querySelector("[name=viewport]")
        .setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1")
    }
})

const { showInstallModal, installPWA } = useInstallPwa()
</script>

<template>
  <div vaul-drawer-wrapper class="flex-1 flex flex-col">
    <NuxtRouteAnnouncer />
    <NuxtPwaManifest />
    <NuxtLayout>
      <Toaster richColors position="top-center" />
      <NuxtPage />

      <layout-install-pwa-modal :model-value="showInstallModal" @install-pwa="installPWA" />
    </NuxtLayout>
  </div>
</template>
