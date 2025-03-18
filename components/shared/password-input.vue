<script lang="ts" setup>
import type { FieldBindingObject } from "vee-validate"

defineProps<{ field: FieldBindingObject<any>; placeholder?: string }>()

const passwordIsVisible = ref(false)
</script>

<template>
  <div class="h-fit w-full relative flex items-center border rounded-lg bg-gray-gray">
    <Input
      :type="passwordIsVisible ? 'text' : 'password'"
      :placeholder="placeholder ?? 'Enter password'"
      autocomplete="off"
      class="pr-10 bg-transparent"
      :class="!passwordIsVisible ? 'text-transparent' : undefined"
      v-bind="field"
    >
      <template #append>
        <shared-icon
          :name="passwordIsVisible ? 'eye' : 'eye-slash'"
          class="cursor-pointer"
          @click="passwordIsVisible = !passwordIsVisible"
        />
      </template>
    </Input>
    <span v-if="field.value && !passwordIsVisible" class="absolute pl-4 pr-10 text-sm tracking-[-4px]">
      {{ "＊".repeat(field.value?.length) }}
    </span>
  </div>
</template>
