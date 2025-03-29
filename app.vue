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
  newWorker.postMessage({ type: "SKIP_WAITING" })
   window.location.reload()
}

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.addEventListener('controllerchange', () => {
//     useToast.info("New update available.", {
//     action: { label: "Update", onClick: handleActionOnClick },
//     duration: Infinity,
//     classes: { actionButton: "!bg-blue-500" },
//   })
//   });
// }

onMounted(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.ts").then((registration) => {
      registration.onupdatefound = () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
           useToast.info("New update available.", {
            action: { label: "Update", onClick: handleActionOnClick },
            duration: Infinity,
            classes: { actionButton: "!bg-blue-500" },
           })
          }
        });
      };
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // window.location.reload(); // Reload ONLY when user accepts the update
       useToast.info("New update available.", {
        action: { label: "Update", onClick: handleActionOnClick },
        duration: Infinity,
        classes: { actionButton: "!bg-blue-500" },
      })
    });
  }
});
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
