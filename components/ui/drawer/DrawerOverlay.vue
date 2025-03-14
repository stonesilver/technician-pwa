<script lang="ts" setup>
import type { DialogOverlayProps } from "reka-ui"
import { cn } from "@/lib/utils"
import { DrawerOverlay } from "vaul-vue"
import { computed, type HtmlHTMLAttributes } from "vue"

const props = defineProps<DialogOverlayProps & { class?: HtmlHTMLAttributes["class"] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DrawerOverlay
    v-bind="delegatedProps"
    :class="cn('fixed inset-0 z-50 bg-[#323B4B80] backdrop-blur-[0.5px]', props.class)"
  />
</template>
