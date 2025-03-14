<script lang="ts" setup>
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "vue"

const props = defineProps<{
  contentClass?: HTMLAttributes["class"]
  headerClass?: HTMLAttributes["class"]
  titleClass?: HTMLAttributes["class"]
  descriptionClass?: HTMLAttributes["class"]
  title?: string
  description?: string
  dismissible?: boolean
}>()

const open = defineModel({ default: false })

const onOpenChange = (e: boolean) => {
  open.value = e
}

const onInteractOutside = (e: Event) => {
  if (typeof props.dismissible === "boolean" && !props.dismissible) {
    e.preventDefault()
  }
}
</script>

<template>
  <Dialog v-model:open="open" @update:open="onOpenChange">
    <DialogScrollContent :class="cn('sm:max-w-[425px] rounded-xl', contentClass)" @interact-outside="onInteractOutside">
      <DialogHeader :class="headerClass">
        <DialogTitle :class="cn('text-lg text-gray-800 font-semibold', titleClass)">
          <slot name="title">{{ title }}</slot>
        </DialogTitle>
        <DialogDescription :class="descriptionClass">
          <slot name="description"> {{ description }} </slot>
        </DialogDescription>
      </DialogHeader>

      <slot name="content" />

      <DialogFooter>
        <slot name="footer" />
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
