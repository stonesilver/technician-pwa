<script lang="ts" setup>
import { cn } from "@/lib/utils"
import type { ListItemContext } from "~/types"

defineProps<ListItemContext>()
</script>

<template>
  <div class="">
    <p :class="cn('text-gray-500 text-xs leading-[160%]', labelClass)">{{ label }}</p>
    <slot>
      <p :class="cn('text-gray-800 text-sm font-medium leading-[160%]', valueClass)">{{ value }}</p>
    </slot>
  </div>
</template>
