<script lang="ts" setup>
definePageMeta({ layout: "default", titleTag: "Provide estimate" })

const dummyVehicleDetails = [
  { label: "Vehicle type", value: "Hatchback" },
  { label: "Vehicle manufacturer", value: "Toyota" },
  { label: "Vehicle model", value: "Rav4" },
  { label: "Manufactured year", value: "2020" },
  { label: "Vehicle color", value: "Blue" },
]
</script>

<template>
  <div>
    <div class="mt-8 p-[17px_10px] md:p-[17px_16px] border-[0.4px] border-mca bg-primary-25">
      <p class="text-mca font-medium text-sm leading-none">Vehicle Information</p>

      <div class="mt-3 grid grid-cols-[auto_auto] gap-2">
        <shared-list-item
          v-for="(item, index) in dummyVehicleDetails"
          :key="index"
          v-bind="item"
          class="even:text-right"
        />
      </div>
    </div>

    <provide-estimate-damage-parts />
  </div>
</template>
