<script lang="ts" setup>
import { cn } from "@/lib/utils"
import type { ListItemContext } from "~/types"

defineProps<{
  rowOne?: ListItemContext
  rowTwo?: ListItemContext
  viewMore?: boolean
}>()

defineEmits<{ (e: "view-more"): void }>()
</script>

<template>
  <div class="pt-3.5 pb-[7px] border-b-[0.6px] border-b-gray-300 text-sm flex gap-[6px] items-center">
    <slot name="icon" />
    <div class="flex-1 flex justify-between">
      <shared-list-item
        :label="rowOne?.label"
        :value="rowOne?.value"
        :label-class="cn('text-gray-800 font-medium text-sm', rowOne?.labelClass)"
        :value-class="cn('text-gray-500 text-sm font-normal mt-1', rowOne?.valueClass)"
      />
      <shared-list-item
        :label="rowTwo?.label"
        :value="rowTwo?.value"
        :label-class="cn('text-mca font-medium text-sm text-right', rowTwo?.labelClass)"
        :value-class="cn('text-gray-500 text-sm font-normal text-right mt-1', rowTwo?.valueClass)"
      />
    </div>

    <div v-if="viewMore" class="size-[26px] center-item cursor-pointer" @click="$emit('view-more')">
      <shared-icon name="chevron-right" />
    </div>
  </div>
</template>
