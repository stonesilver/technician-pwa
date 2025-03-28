<script lang="ts" setup>
const checked = ref(false)
const route = useRoute()
const { go } = useRouter()

const titleTag = computed(() => {
  return (route.meta?.titleTag ?? "") as string
})

const canGoBack = computed(() => {
  const back = route.meta?.goBack as string
  return typeof back === "string" && back === "yes"
})

const hideNavBar = computed(() => {
  return route.meta?.hideNavBar === "yes"
})
</script>

<template>
  <header class="border-b-[0.6px] bg-gray-50 z-[5] border-b-gray-200 shadow-[0_1px_4px_0_#11111105] py-[18px] px-5 sticky top-0">
    <nav class="min-h-[38px] flex items-center gap-[15px]">
      <shared-icon
        v-if="canGoBack"
        name="arrow-right"
        class="rotate-180 size-6 center-item cursor-pointer"
        class-name="size-5 [&>path]:stroke-[#439687]"
        @click="go(-1)"
      />

      <layout-the-hamburger v-if="!hideNavBar && !canGoBack" v-model="checked" />

      <p class="flex-1 text-gray-900 font-medium text-xl">{{ titleTag }}</p>

      <div v-if="route.meta.layout === 'default'" class="w-[95px] flex gap-3.5">
        <div class="size-[38px] rounded-full center-item bg-gray-100 border">
          <shared-icon name="bell" class="translate-y-[3px]" />
          <span class="size-[6.81px] bg-error-500 rounded-full z-[1]" />
        </div>

        <layout-user-avatar />
      </div>
    </nav>
  </header>
</template>
