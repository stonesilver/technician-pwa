<script lang="ts" setup>
import { cn } from "@/lib/utils"

defineProps<{ title: string; description: string; descriptionClass?: string }>()
</script>

<template>
  <div class="min-h-[250px] center-item">
    <img src="/images/Search.webp" alt="no result" class="w-[68.98px] h-[73px] block" />

    <p class="mt-[22px] text-gray-900 text-base font-semibold leading-none">{{ title }}</p>
    <p :class="cn('text-sm text-gray-500 text-center leading-[110%] mt-2 max-w-[271px] mx-auto', descriptionClass)">
      {{ description }}
    </p>
  </div>
</template>
