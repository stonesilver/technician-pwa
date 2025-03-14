<script lang="ts" setup>
import type { DialogContentEmits, DialogContentProps } from "reka-ui"
import type { HtmlHTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { useForwardPropsEmits } from "reka-ui"
import { DrawerContent, DrawerPortal } from "vaul-vue"
import DrawerOverlay from "./DrawerOverlay.vue"

const props = defineProps<DialogContentProps & { class?: HtmlHTMLAttributes["class"] }>()
const emits = defineEmits<DialogContentEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent
      v-bind="forwarded"
      :class="cn('fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-xl bg-white', props.class)"
    >
      <div class="mx-auto mt-5 h-2 w-[100px] rounded-full bg-muted" />
      <slot />

      <DrawerClose class="absolute top-9 right-4 p-0.5 transition-colors rounded-md">
        <shared-icon name="close" class-name="size-4" />
        <span class="sr-only">Close</span>
      </DrawerClose>
    </DrawerContent>
  </DrawerPortal>
</template>
