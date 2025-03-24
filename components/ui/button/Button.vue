<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { Primitive, type PrimitiveProps } from "reka-ui"
import { type ButtonVariants, buttonVariants } from "."

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: HTMLAttributes["class"]
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
})
</script>

<template>
  <Primitive :as="as" :as-child="asChild" :class="cn(buttonVariants({ variant, size }), props.class)">
    <shared-icon v-if="isLoading" name="loader" class="mr-4" class-name="text-white scale-[1.4]" />
    <slot />
  </Primitive>
</template>
