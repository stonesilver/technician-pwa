<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import type { IconProps } from "~/types"
// import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue?: string | number
  wrapperClass?: HTMLAttributes["class"]
  class?: HTMLAttributes["class"]
  prependIcon?: IconProps
  appendIcon?: IconProps
  currency?: boolean
}>()

// const emits = defineEmits<{
//   (e: "update:modelValue", payload: string | number): void
// }>()

// const modelValue = useVModel(props, 'modelValue', emits, {
//   passive: true,
//   defaultValue: props.defaultValue,
// })

const value = defineModel<HTMLInputElement["value"]>()
</script>

<template>
  <div :class="cn('w-full relative flex items-center', wrapperClass)">
    <div class="absolute left-4 center-item">
      <slot name="prepend">
        <shared-icon v-if="prependIcon" v-bind="prependIcon" />
      </slot>
    </div>

    <input
      v-model="value"
      v-currency="currency"
      :class="
        cn(
          'flex flex-1 h-11 w-full rounded-md ring-1 text-gray-900 ring-gray-200 bg-gray-50 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#999CA0] focus-visible:outline-none focus-visible:border-[0.4px] focus-visible:border-mca focus-visible:ring-[3px] focus-visible:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50',
          props.class,
          prependIcon ? 'pl-9' : 'pl-4',
          appendIcon ? 'pr-9' : 'pr-4'
        )
      "
      v-bind="$attrs"
    />

    <div class="absolute right-2 center-item">
      <slot name="append">
        <shared-icon v-if="appendIcon" v-bind="appendIcon" />
      </slot>
    </div>
  </div>
</template>
