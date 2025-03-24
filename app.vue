<script setup type="ts">

onMounted(() => {
  // disable IOS scaling
    if (navigator.userAgent.indexOf("iPhone") > -1) {
      document
        .querySelector("[name=viewport]")
        .setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1")
    }
})




const showModal = ref(false);
const deferredPrompt = ref(null);

// Detect if the PWA install prompt is available
onMounted(() => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault(); // Prevent the default install prompt
    deferredPrompt.value = event;
    showModal.value = true; // Show the modal
  });
});

onMounted(() => {
  window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
 showModal.value = false
  // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt.value = null;
  window.location.href = import.meta.env.VITE_BASE_DOMAIN || '/'
  // Optionally, send analytics event to indicate successful install
});
})

// Handle PWA installation when button is clicked
const installPWA = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    const choiceResult = await deferredPrompt.value.userChoice;

    if (choiceResult.outcome === 'accepted') {

    } else {
       showModal.value = false
    }

    deferredPrompt.value = null; // Reset after interaction
  }
};
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
