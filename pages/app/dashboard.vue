<script lang="ts" setup>
definePageMeta({ layout: "default", titleTag: "Overview" })
import { numberToCurrency } from "~/utils/helper-functions/return-string.ts"

const dummyTasks = [
  "9955884e-900b-4b21-a672-384583ff1e91",
  "57950d30-e5af-426b-90b3-cc17052ef2a1",
  "527f77a5-7f7b-4f24-997f-f2d88f8a6f9d",
  "04325ce7-9f6c-4824-b406-d5473a41b64e",
]

const dummyPendingEstimates = [
  {
    id: "a6ab63cd-592b-4535-8b23-860ba8077630",
    description: "Toyota Camry 2024 || Red",
    totalDamages: 4,
    provided: 1,
  },
  {
    id: "e93db31c-4c06-4eb8-9bb3-304b360a8599",
    description: "Honda Accord 2021 || Blue",
    totalDamages: 4,
    provided: 1,
  },
]

const modals = reactive({ openWithdrawalModal: false, openPendingEstimatesModal: false })
const hasEstimate = true

const completePendingEstimateOnClick = async () => {
  const count = 2

  if (count > 1) {
    modals.openPendingEstimatesModal = true
  } else {
    await navigateTo("/app/provide-estimate")
  }
}
</script>

<template>
  <div>
    <shared-to-do-alert-card
      text="You currently have an uncompleted repair estimate"
      action-text="Complete"
      class="mt-[22px]"
      @action="completePendingEstimateOnClick"
    />

    <h1 class="text-lg text-gray-700 font-medium mt-[22px] leading-none">Welcome back Technician Ade</h1>

    <div class="mt-7 bg-gray-50 border-[0.4px] border-purple-100 max-[375px]:px-3 px-[23px] sm:px-6 pt-[26px] pb-5">
      <div class="grid grid-cols-[1fr_auto] sm:grid-cols-2 gap-2">
        <div class="">
          <h3 class="text-gray-500 max-[375px]:text-xs text-sm leading-none">Total Earnings</h3>
          <p class="text-mca font-semibold max-[375px]:text-2xl text-[2rem] leading-none mt-3">
            {{ numberToCurrency(400000) }}
          </p>
        </div>

        <div class="bg-white py-[9px] max-[375px]:px-2 px-[19px]">
          <h3 class="max-[375px]:text-xs text-sm text-gray-400">Total submitted</h3>
          <p class="text-gray-800 font-medium text-sm lg:text-2xl leading-[160%] text-right">20</p>
        </div>
      </div>

      <div class="mt-5 pt-5 border-t-[0.4px] border-t-gray-300">
        <Button
          variant="default_light"
          class="h-[50px] w-full md:max-w-[289px] ml-auto rounded"
          @click="modals.openWithdrawalModal = true"
        >
          Withdraw Earnings
        </Button>
      </div>
    </div>

    <div class="mt-11">
      <div class="flex items-center justify-between">
        <h3 class="text-lg text-gray-900 font-semibold leading-none">Recent Estimate</h3>
        <nuxt-link
          to="/app/estimate-submitted"
          class="inline-flex gap-2 items-center leading-none text-lg text-mca font-medium"
        >
          See more
          <shared-icon name="arrow-right" />
        </nuxt-link>
      </div>

      <div class="mt-7">
        <shared-estimate-submitted-card
          v-if="hasEstimate"
          v-for="item in dummyTasks"
          :key="item"
          :row-one="{ label: 'Toyota Camry 2024', value: '4 Damage parts' }"
          :row-two="{ label: `${numberToCurrency(2500)} Earned`, value: '12th july 2024' }"
        />

        <shared-no-result
          v-else
          title="No Estimate"
          description="You currently do not have any estimate at the moment ,they will appear here when you have"
        />
      </div>
    </div>

    <wallet-withdraw-earning-modal v-model="modals.openWithdrawalModal" />

    <dashboard-pending-estimates-modal
      v-model="modals.openPendingEstimatesModal"
      :pending-estimates="dummyPendingEstimates"
    />
  </div>
</template>
