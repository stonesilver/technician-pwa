<script lang="ts" setup>
import type { FieldBindingObject } from "vee-validate"

const props = defineProps<{ field?: FieldBindingObject<any>; placeholder?: string; inputClass?: string; doNotChangeType?: boolean }>()

const passwordIsVisible = ref(false)

const handleTypeSwitch = () => {
  if (props.doNotChangeType) return

  passwordIsVisible.value = !passwordIsVisible.value
}
</script>

<template>
  <div class="h-fit w-full relative flex items-center border rounded-lg bg-gray-50">
    <Input
      :type="passwordIsVisible ? 'text' : 'password'"
      :placeholder="placeholder ?? 'Enter password'"
      autocomplete="off"
      class="pr-10 bg-transparent caret-mca z-[1]"
      :class="[
        field?.value && !passwordIsVisible ? 'text-transparent tracking-[2.5px] placeholder:tracking-normal text-lg placeholder:text-sm' : undefined,
        inputClass,
      ]"
      v-bind="{ ...$attrs, ...field }"
    >
      <template #append>
        <shared-icon :name="passwordIsVisible ? 'eye' : 'eye-slash'" class="cursor-pointer z-[2]" @click="handleTypeSwitch" />
      </template>
    </Input>
    <span v-if="field?.value && !passwordIsVisible" class="absolute pl-4 text-gray-600 text-sm tracking-[-4px] w-fit leading-none">
      {{ "﹡".repeat(field?.value?.length) }}
    </span>
  </div>
</template>
