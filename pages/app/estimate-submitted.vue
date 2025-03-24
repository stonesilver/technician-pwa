<script lang="ts" setup>
definePageMeta({ layout: "default", titleTag: "Estimate" })
import { numberToCurrency } from "~/utils/helper-functions/returns-string.ts"

const openModal = ref(false)
const dummyTasks = [
  "9955884e-900b-4b21-a672-384583ff1e91",
  "57950d30-e5af-426b-90b3-cc17052ef2a1",
  "527f77a5-7f7b-4f24-997f-f2d88f8a6f9d",
  "04325ce7-9f6c-4824-b406-d5473a41b64e",
  "8253d39c-86eb-4c46-a222-4675619a414c",
  "88f04bf1-0e73-4773-8e38-deab0b4ab5ac",
]

const dummyDamagedParts = [
  [
    { label: "Damage part 1", value: "Bumper ( front )" },
    { label: "Estimated Amount", value: numberToCurrency(500000) },
  ],
  [
    { label: "Damage part 2", value: "Windscreen ( Back )" },
    { label: "Estimated Amount", value: numberToCurrency(500000) },
  ],
  [
    { label: "Damage part 3", value: "Windscreen ( Front )" },
    { label: "Estimated Amount", value: numberToCurrency(500000) },
  ],
]

const hasEstimate = true
</script>

<template>
  <div>
    <div
      class="mt-8 grid grid-cols-2 bg-primary-50 py-[18px] max-[375px]:px-3 px-6 max-[375px]:text-xs rounded border-[0.4px] border-primary-100"
    >
      <div class="">
        <p class="text-gray-400 leading-[160%]">Total submitted</p>
        <p class="text-gray-800 font-medium leading-[160%]">20</p>
      </div>

      <div class="text-right">
        <p class="text-gray-400 leading-[160%]">Total Earnings</p>
        <p class="text-gray-800 font-medium leading-[160%]">{{ numberToCurrency(400000) }}</p>
      </div>
    </div>

    <shared-section-details-card title="Recent Estimate" description="240 Estimate submitted">
      <shared-search-and-filter v-if="hasEstimate" />

      <div class="mt-7">
        <shared-estimate-submitted-card
          v-if="hasEstimate"
          v-for="item in dummyTasks"
          :key="item"
          :row-one="{ label: 'Toyota Camry 2024', value: '4 Damage parts' }"
          :row-two="{ label: `${numberToCurrency(2500)} Earned`, value: '12th july 2024' }"
          view-more
          @view-more="openModal = true"
        />

        <shared-no-result
          v-else
          title="No Estimate"
          description="You currently do not have any estimate at the moment ,they will appear here when you have"
        />

        <shared-responsive-modal
          v-model="openModal"
          title="Estimate Details"
          header-class="max-lg:px-5"
          content-class="bg-gray-50"
        >
          <template #content>
            <div class="py-4 pb-8 max-lg:px-5 grid grid-cols-[auto_auto] gap-3">
              <shared-list-item label="Vehicle name" value="Toyota Camry 2024" />
              <shared-list-item label="No of damage part" value="3" class="text-right" />
              <shared-list-item label="Date submitted" value="12th july 2024" />
              <shared-list-item label="Total estimated  amount" :value="numberToCurrency(1500000)" class="text-right" />
            </div>

            <div class="pt-7 pb-8 bg-white max-lg:px-5">
              <h3 class="text-gray-500 text-sm leading-[18px]">3 Damage parts</h3>

              <div class="mt-4 space-y-3">
                <div
                  v-for="(item, index) in dummyDamagedParts"
                  :key="index"
                  class="bg-gray-50 grid grid-cols-[auto_auto] gap-3 border-[0.3px] border-gray-300 min-h-[55px] rounded-sm p-[8px_1rem]"
                >
                  <shared-list-item
                    v-for="({ label, value }, index) in item"
                    :key="index"
                    :label="label"
                    :value="value"
                    class="even:text-right group"
                    value-class="group-even:text-mca group-even:font-medium"
                  />
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <div class="h-[58px] w-full bg-success-50 border-t-[0.4px] border-t-success-500 lg:pb-4 center-item">
              <p class="flex items-center gap-2 text-lg text-gray-800 font-semibold">
                <span class="text-gray-500 font-normal text-sm">Earnings</span>
                {{ numberToCurrency(2500) }}
              </p>
            </div>
          </template>
        </shared-responsive-modal>
      </div>
    </shared-section-details-card>
  </div>
</template>
