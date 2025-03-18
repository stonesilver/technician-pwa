<script setup type="ts">
// const openModal = ref(false)
// const nuxtApp = useNuxtApp()

onMounted(() => {
  // disable IOS scaling
    if (navigator.userAgent.indexOf("iPhone") > -1) {
      document
        .querySelector("[name=viewport]")
        .setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1")
    }
})


// onMounted(async () => {
//   //   await nuxtApp.$pwa?.install()
//   // console.log(nuxtApp.$pwa)
//   // useNuxtApp().$pwa?.install();

//   if (!nuxtApp.$pwa?.isPWAInstalled) {
//     openModal.value = true
//   }
// })

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
  window.location.href = import.meta.env.VITE_API_DOMAIN || '/'
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
});
})

// Handle PWA installation when button is clicked
const installPWA = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    const choiceResult = await deferredPrompt.value.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User installed the PWA');
      // showModal.value = false;

    } else {
      console.log('User dismissed the PWA install prompt');
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

      <shared-the-modal v-model="showModal" :dismissible="false" content-class="py-6 rounded-xl max-w-[332px]">
        <template #content>
          <div class="text-center">
            <div class="size-[50px] rounded-full bg-success-50 mx-auto center-item">
              <shared-icon name="circle-arrow-down" />
            </div>
            <h2 class="text-secondary-3 leading-none text-xl font-semibold mt-6">Install PWA</h2>
            <p class="mt-[14px] text-sm leading-[20px] text-gray-700 max-w-[217px] mx-auto">
              For a faster, smoother experience, we recommend installing the PWA on your device
            </p>

            <Button class="w-full mx-auto mt-[34px] h-[50px]" @click="installPWA">Install PWA</Button>
          </div>
        </template>
      </shared-the-modal>
    </NuxtLayout>
  </div>
</template>
