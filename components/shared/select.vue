<script setup lang="ts">
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxList,
} from "@/components/ui/combobox"
import type { Options, SelectProps } from "~/types"

defineProps<SelectProps>()

const value = defineModel<Options[] | Options>()
</script>

<template>
  <Combobox by="label" v-model="value">
    <ComboboxAnchor class="w-full">
      <ComboboxTrigger class="relative w-full items-center block">
        <ComboboxInput :display-value="(val) => val?.label ?? ''" :placeholder="placeholder" class="bg-gray-50" />
        <div class="absolute end-0 inset-y-0 flex items-center justify-center px-3">
          <shared-icon name="chevron-right" class-name="size-3 rotate-90" />
        </div>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList align="start" class="max-h-[250px]">
      <ComboboxEmpty> {{ emptyText }} </ComboboxEmpty>

      <ComboboxGroup>
        <ComboboxItem v-for="framework in options" :key="framework.value" :value="framework">
          {{ framework.label }}
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
