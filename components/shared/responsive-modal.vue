<script lang="ts" setup>
import { createReusableTemplate, useMediaQuery } from "@vueuse/core"
import type { HTMLAttributes } from "vue"

// For the contentClass, headerClass, titleClass and descriptionClass you can use css to apply different styles for desktop and mobile modal.
// The breakpoint is 1024px
// E.g, content-class="max-w-[380px] lg:max-w-[600px]"

withDefaults(
  defineProps<{
    contentClass?: HTMLAttributes["class"]
    headerClass?: HTMLAttributes["class"]
    titleClass?: HTMLAttributes["class"]
    descriptionClass?: HTMLAttributes["class"]
    title?: string
    description?: string
    dismissible?: boolean
  }>(),
  {
    dismissible: undefined,
  }
)

const [ContentTemplate, ModalContent] = createReusableTemplate()
const [FooterTemplate, ModalFooter] = createReusableTemplate()
const isDesktop = useMediaQuery("(min-width: 1024px)")

const isOpen = defineModel<boolean>()
</script>

<template>
  <ContentTemplate>
    <slot name="content" />
  </ContentTemplate>

  <FooterTemplate>
    <slot name="footer" />
  </FooterTemplate>

  <shared-the-modal
    v-if="isDesktop"
    v-model="isOpen"
    :title="title"
    :description="description"
    :content-class="contentClass"
    :header-class="headerClass"
    :title-class="titleClass"
    :description-class="descriptionClass"
    :dismissible="dismissible"
  >
    <template #content>
      <ModalContent />
    </template>

    <template #footer>
      <ModalFooter />
    </template>
  </shared-the-modal>

  <shared-the-mobile-modal
    v-else
    v-model="isOpen"
    :title="title"
    :description="description"
    :content-class="contentClass"
    :header-class="headerClass"
    :title-class="titleClass"
    :description-class="descriptionClass"
    :dismissible="dismissible"
  >
    <template #content>
      <ModalContent />
    </template>

    <template #footer>
      <ModalFooter />
    </template>
  </shared-the-mobile-modal>
</template>
