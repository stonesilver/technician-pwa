<script lang="ts" setup>
defineProps<{ title: string; description: string; isLoading?: boolean }>()
</script>

<template>
  <div class="max-[375px]:mt-10 mt-14">
    <h1 class="text-lg text-gray-900 font-semibold leading-none">{{ title }}</h1>
    <Skeleton v-if="isLoading" class="w-[120px] h-4 mt-2" />
    <p v-else class="mt-2 text-base leading-none text-gray-400">{{ description }}</p>

    <slot />
  </div>
</template>
