<script lang="ts" setup>
const { showModal, showInstallModal, installPWA } = useInstallPwa()
</script>

<template>
  <shared-the-modal :model-value="showInstallModal" dismissible content-class="py-6 rounded-xl max-w-[332px]" @update:model-value="showModal = false">
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
</template>
