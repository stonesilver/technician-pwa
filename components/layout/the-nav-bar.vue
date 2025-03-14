<script lang="ts" setup>
const checked = ref(false)
const route = useRoute()

const titleTag = computed(() => {
  return (route.meta?.titleTag ?? "") as string
})
</script>

<template>
  <header
    class="border-b-[0.6px] bg-white z-[5] border-b-gray-200 shadow-[0_1px_4px_0_#11111105] py-[18px] px-5 sticky top-0"
  >
    <nav class="min-h-[38px] flex items-center gap-[15px]">
      <layout-the-hamburger v-if="!['Provide estimate'].includes(titleTag)" v-model="checked" />

      <p class="flex-1 text-gray-900 font-medium text-xl">{{ titleTag }}</p>
      <div class="w-[95px] flex gap-3.5">
        <div class="size-[38px] rounded-full center-item bg-gray-100 border">
          <shared-icon name="bell" class="translate-y-[3px]" />
          <span class="size-[6.81px] bg-error-500 rounded-full z-[1]" />
        </div>

        <layout-user-avatar />
      </div>
    </nav>
  </header>
</template>
