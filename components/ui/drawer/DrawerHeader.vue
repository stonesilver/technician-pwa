<script lang="ts" setup>
import type { HtmlHTMLAttributes } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HtmlHTMLAttributes["class"]
}>()
</script>

<template>
  <div :class="cn('px-4 py-2', props.class)">
    <slot />
  </div>
</template>
