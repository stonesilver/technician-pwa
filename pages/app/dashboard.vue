<script lang="ts" setup>
definePageMeta({ layout: "default", titleTag: "Overview" })

import type { TechnicianContext } from "~/types/auth"
import type { OpenEstimateContext, PendingEstimateListContext } from "~/types/estimates"
import { unifyVehicleDetails } from "~/utils/helper-functions/returns-object"
import { numberToCurrency } from "~/utils/helper-functions/returns-string.ts"

const pendingEstimates = ref<PendingEstimateListContext[]>([])

const { data: openEstimates } = useCustomFetch<OpenEstimateContext[]>(getOpenEstimatesUrl, {
  headers: { "show-error": "400" },
  dedupe: "cancel",
  server: false,
})

const { submittedEstimates, estimates, status, statState } = useEstimateSubmitted()

const { data: walletBalance, status: walletStatus } = useCustomFetch<{ balance_withdrawable: string }>(getWalletBalanceUrl, {
  headers: { "show-error": "400" },
  dedupe: "cancel",
  server: false,
})

const modals = reactive({ openWithdrawalModal: false, openPendingEstimatesModal: false })

const completePendingEstimateOnClick = async () => {
  const count = Array.isArray(openEstimates.value) ? openEstimates.value.length : 0

  if (count > 1 && Array.isArray(openEstimates.value)) {
    pendingEstimates.value = openEstimates.value?.map((pendingEst) => {
      const vehicle = unifyVehicleDetails(pendingEst.vehicle_details, pendingEst.product_route_name)
      return {
        id: pendingEst.claim_id,
        description: `${vehicle.vehicle_make} ${vehicle.vehicle_model} ${vehicle.year_of_manufacture} || ${vehicle.vehicle_color?.toLowerCase()}`,
        provided: pendingEst.estimate_provided,
        limit: pendingEst.submission_limit,
      }
    })
    modals.openPendingEstimatesModal = true
  } else {
    await navigateTo({ path: "/app/provide-estimate", query: { q: openEstimates.value?.[0].claim_id } })
  }
}

const handleWithdrawalOnClick = () => {
  if (walletBalance.value && parseFloat(walletBalance.value.balance_withdrawable) > 0) {
    modals.openWithdrawalModal = true
  } else {
    useToast.error("You do not have any withdrawable earnings")
  }
}

const technician = useState<TechnicianContext>("technician")
</script>

<template>
  <div>
    <shared-to-do-alert-card
      v-if="Array.isArray(openEstimates)"
      :text="`You currently have ${openEstimates.length > 1 ? openEstimates.length : 'an'} uncompleted repair estimate`"
      action-text="Complete"
      class="mt-[22px]"
      @action="completePendingEstimateOnClick"
    />
    <h1 class="text-lg text-gray-700 font-medium mt-[22px] leading-none">Welcome back Technician {{ technician?.first_name ?? "" }}</h1>

    <div class="mt-7 bg-gray-50 border-[0.4px] border-purple-100 max-[375px]:px-3 px-[23px] sm:px-6 pt-[26px] pb-5">
      <div class="grid grid-cols-[1fr_auto] sm:grid-cols-2 gap-2">
        <div class="">
          <h3 class="text-gray-500 max-[375px]:text-xs text-sm leading-none">Withdrawable Earnings</h3>
          <Skeleton v-if="walletStatus === 'pending'" class="w-[150px] h-8 mt-3" />
          <p v-else class="text-mca font-semibold max-[375px]:text-2xl text-[2rem] leading-none mt-3">
            {{ numberToCurrency(walletBalance?.balance_withdrawable ?? "0") }}
          </p>
        </div>

        <div class="bg-white py-[9px] max-[375px]:px-2 px-[19px]">
          <h3 class="max-[375px]:text-xs text-sm text-gray-400 text-right">Total Earnings</h3>
          <Skeleton v-if="walletStatus === 'pending'" class="w-[80px] h-4 ml-auto mt-1" />
          <p v-else class="text-gray-800 font-medium text-sm lg:text-2xl leading-[160%] text-right">
            {{ numberToCurrency(statState.stat?.total_amount_paid ?? "0") }}
          </p>
        </div>
      </div>

      <div class="mt-5 pt-5 border-t-[0.4px] border-t-gray-300">
        <Button
          variant="default_light"
          class="h-[50px] w-full md:max-w-[289px] ml-auto rounded"
          :disabled="walletStatus === 'pending'"
          @click="handleWithdrawalOnClick"
        >
          Withdraw Earnings
        </Button>
      </div>
    </div>

    <div class="mt-11">
      <div class="flex items-center justify-between">
        <h3 class="text-lg text-gray-900 font-semibold leading-none">Recent Estimate</h3>
        <nuxt-link
          v-if="!!submittedEstimates?.total_results"
          to="/app/estimate-submitted"
          class="inline-flex gap-2 items-center leading-none text-lg text-mca font-medium"
        >
          See more
          <shared-icon name="arrow-right" />
        </nuxt-link>
      </div>

      <div class="mt-7">
        <div v-for="item in 4" :key="item" v-if="status === 'pending'">
          <Skeleton class="w-full h-[65.5px] mt-1" />
        </div>

        <template v-else>
          <shared-estimate-submitted-card
            v-if="!!submittedEstimates?.total_results"
            v-for="item in estimates"
            :key="item.id"
            :column-one="item.columnOne"
            :column-two="item.columnTwo"
          >
            <template #middle>
              <shared-list-item label="Status" label-class="text-center" class="w-fit">
                <shared-badge :text="item.badge.label" :variant="item.badge.variant" class="mt-1" />
              </shared-list-item>
            </template>
          </shared-estimate-submitted-card>

          <shared-no-result
            v-else
            title="No Estimate"
            description="You currently do not have any estimate at the moment ,they will appear here when you have"
          />
        </template>
      </div>
    </div>

    <wallet-withdraw-earning-modal v-model="modals.openWithdrawalModal" />

    <dashboard-pending-estimates-modal v-model="modals.openPendingEstimatesModal" :pending-estimates="pendingEstimates" />
  </div>
</template>
