<script lang="ts" setup>
import { cn } from "@/lib/utils"

type Variant = "info" | "success"

withDefaults(defineProps<{ text: string; variant?: Variant }>(), {
  variant: "info",
})

const variants = {
  info: "border-warning-500 bg-warning-50 text-warning-500",
  success: "border-primary-500 bg-primary-50 text-primary-500",
}
</script>

<template>
  <div :class="cn('border-[0.26px] text-sm leading-[16px] p-[2px_7.7px] rounded-full', variants[variant])">
    {{ text }}
  </div>
</template>
