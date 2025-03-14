<script lang="ts" setup>
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "vue"

defineProps<{
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
</script>

<template>
  <Drawer v-model:open="open" :dismissible="open && (dismissible ?? true)" @update:open="onOpenChange">
    <DrawerContent :class="contentClass">
      <div class="mx-auto w-full">
        <DrawerHeader :class="headerClass">
          <DrawerTitle :class="cn('text-lg text-gray-800 font-semibold', titleClass)">
            <slot name="title">{{ title }}</slot>
          </DrawerTitle>
          <DrawerDescription :class="descriptionClass">
            <slot name="description"> {{ description }} </slot>
          </DrawerDescription>
        </DrawerHeader>

        <slot name="content" />

        <DrawerFooter>
          <slot name="footer" />
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
