<script lang="ts" setup>
import { cn } from "@/lib/utils"

type Variant = "info"

withDefaults(defineProps<{ text?: string; variant?: Variant }>(), { variant: "info" })

const variants = {
  info: { icon: "", base: "p-[8px_10px] md:p-[8px_1rem] bg-warning-50 border-warning-500 rounded-sm" },
}
</script>

<template>
  <div :class="cn('text-sm border-[0.2px] text-gray-900 leading-[18px]', variants[variant].base)">
    <slot>
      {{ text }}
    </slot>
  </div>
</template>
