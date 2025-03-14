<script lang="ts" setup>
const openModal = ref(false)
const nuxtApp = useNuxtApp()

onMounted(async () => {
  // useNuxtApp().$pwa?.install();

  if (!nuxtApp.$pwa?.isPWAInstalled) {
    console.log("i ran!!!")
    await nuxtApp.$pwa?.install()
    console.log(nuxtApp.$pwa)
  }
})
</script>

<template>
  <div id="app-layout" class="w-full relative max-w-3xl mx-auto flex flex-col bg-white flex-1">
    <layout-the-nav-bar />
    <div class="px-5">
      <slot />
    </div>

    <shared-the-modal v-model="openModal" :dismissible="false" content-class="h-[300px] bg-primary-100">
      <template #content>
        <div class=""></div>
      </template>
    </shared-the-modal>
  </div>
</template>
