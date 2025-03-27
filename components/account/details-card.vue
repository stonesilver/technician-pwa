<script lang="ts" setup>
defineProps<{ title: string; editText?: string }>()
defineEmits<{ (e: "on-edit"): void }>()
</script>

<template>
  <div class="bg-gray-50 rounded-[10px] p-[20px_16px] sm:p-[26px_24px]">
    <div class="flex justify-between items-center mb-5">
      <p class="text-base leading-[1rem] font-semibold text-mca">{{ title }}</p>

      <button v-if="editText" type="button" class="text-gray-400 flex items-center gap-1 font-semibold w-fit ml-auto" @click="$emit('on-edit')">
        <shared-icon name="edit" />
        {{ editText }}
      </button>
    </div>

    <slot />
  </div>
</template>
