<script lang="ts" setup>
defineProps<{ text: string; actionText?: string }>()
defineEmits<{ (e: "action"): void }>()
</script>

<template>
  <div
    class="min-h-[58px] rounded-sm bg-warning-50 shadow-[0_4px_8px_0_#00000014] p-[8px_9px] md:p-[12px_16px] flex items-center flex-wrap gap-[10px]"
  >
    <div class="size-[42px] rounded bg-warning-100 center-item">
      <shared-icon name="warning" />
    </div>

    <p class="max-[375px]:text-xs text-sm leading-[16px] flex-1">{{ text }}</p>

    <slot name="action">
      <button type="button" class="flex items-center gap-1" @click="$emit('action')">
        <span class="text-mca max-[375px]:text-xs text-sm leading-none font-medium">{{ actionText }}</span>
        <shared-icon name="arrow-right" />
      </button>
    </slot>
  </div>
</template>
