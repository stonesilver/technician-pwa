<script lang="ts" setup>
defineProps<{ name: string; label?: string }>()
</script>

<template>
  <div>
    <Label class="mb-2 block">{{ label }}</Label>
    <vee-field :name="name" v-slot="{ field }">
      <slot :field="field" />
    </vee-field>
    <vee-error-message :name="name" v-slot="{ message }">
      <p class="text-error-500 text-sm">{{ message }}</p>
    </vee-error-message>
  </div>
</template>
