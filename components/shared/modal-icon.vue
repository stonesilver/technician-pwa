<script lang="ts" setup>
defineProps<{ type: "check" | "warning" }>()

const variants = {
  check: { name: "check", wrapperClass: "bg-success-500 ring-success-50", iconClassName: "" },
  warning: { name: "exclamation-mark", wrapperClass: "bg-warning-500 ring-warning-50", iconClassName: "[&>g]:fill-white size-6" },
}
</script>

<template>
  <div class="size-[34px] rounded-full mx-auto center-item ring-[12px]" :class="variants[type].wrapperClass">
    <shared-icon :name="variants[type].name" :class-name="variants[type].iconClassName" />
  </div>
</template>
