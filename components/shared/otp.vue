<script lang="ts" setup>
import { cn } from "@/lib/utils"

const value = defineModel<string[]>()

defineProps<{ count: number; id?: string; groupClass?: string; inputClass?: string }>()
</script>

<template>
  <PinInput :id="id" v-model="value" placeholder="＊">
    <PinInputGroup :class="cn('flex max-[350px]:gap-4 gap-5 w-full', groupClass)">
      <PinInputInput
        v-for="(id, index) in count"
        :key="id"
        :index="index"
        :class="cn('max-[350px]:size-10 size-11 bg-gray-25 border border-gray-300 rounded', inputClass)"
      />
    </PinInputGroup>
  </PinInput>
</template>
