<script lang="ts" setup>
import { cn } from "@/lib/utils"
import type { ListItemContext } from "~/types"

defineProps<{
  columnOne?: ListItemContext
  columnTwo?: ListItemContext
  viewMore?: boolean
}>()

defineEmits<{ (e: "view-more"): void }>()
</script>

<template>
  <div class="pt-3.5 pb-[7px] border-b-[0.6px] border-b-gray-300 text-sm flex gap-[6px] items-center" @click="$emit('view-more')">
    <slot name="icon" />
    <div class="flex-1 flex justify-between">
      <shared-list-item
        :label="columnOne?.label"
        :value="columnOne?.value"
        :label-class="cn('text-gray-800 font-medium text-sm', columnOne?.labelClass)"
        :value-class="cn('text-gray-500 text-sm font-normal mt-1', columnOne?.valueClass)"
      />
      <slot name="middle" />
      <shared-list-item
        :label="columnTwo?.label"
        :value="columnTwo?.value"
        :label-class="cn('text-mca font-medium text-sm text-right', columnTwo?.labelClass)"
        :value-class="cn('text-gray-500 text-sm font-normal text-right mt-1', columnTwo?.valueClass)"
      />
    </div>

    <div v-if="viewMore" class="size-[26px] center-item cursor-pointer">
      <shared-icon name="chevron-right" />
    </div>
  </div>
</template>
