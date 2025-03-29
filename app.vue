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

const handleActionOnClick = () => {
   window.location.reload()
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    useToast.info("New update available.", {
    action: { label: "Update", onClick: handleActionOnClick },
    duration: Infinity,
    classes: { actionButton: "!bg-blue-500" },
  })
  });
}
</script>

<template>
  <div vaul-drawer-wrapper class="flex-1 flex flex-col">
    <NuxtRouteAnnouncer />
    <NuxtPwaManifest />
    <NuxtLayout>
      <Toaster richColors position="top-center" />
      <NuxtPage />

      <layout-install-pwa-modal v-model="showModal" @install-pwa="installPWA" />
    </NuxtLayout>
  </div>
</template>
