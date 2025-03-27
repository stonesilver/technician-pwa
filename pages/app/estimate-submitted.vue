<script lang="ts" setup>
definePageMeta({ layout: "default", titleTag: "Estimate" })

import type { TechnicianContext } from "~/types/auth"
import type { EstimatesStats, SubmittedEstimateContext } from "~/types/estimates"
import { formatSubmittedEstimate } from "~/utils/helper-functions/returns-array"
import { numberToCurrency } from "~/utils/helper-functions/returns-string.ts"

const technician = useState<TechnicianContext>("technician")
const { data: submittedEstimates, status } = useCustomFetch<SubmittedEstimateContext>(getSubmittedEstimatesUrl, {
  headers: { "show-error": "400" },
  dedupe: "cancel",
  server: false,
})

const openModal = reactive({ open: false, id: "" })
const statState = reactive<{ stat: EstimatesStats | null; isLoading: boolean }>({ stat: null, isLoading: true })

const estimates = computed(() => {
  return formatSubmittedEstimate(submittedEstimates.value?.estimates)
})

const getEstimates = async () => {
  try {
    statState.isLoading = true
    const res = await useApi()<EstimatesStats>(`${getEstimatesStatUrl}${technician.value?.id}`, { headers: { "show-error": "400" } })
    statState.stat = res
  } catch (error) {
  } finally {
    statState.isLoading = false
  }
}

const handleViewEstimateDetail = (id: string) => {
  openModal.id = id
  openModal.open = true
}

watch(
  () => technician.value,
  async (val) => {
    if (!!val) {
      getEstimates()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <div class="mt-8 grid grid-cols-2 bg-primary-50 py-[18px] max-[375px]:px-3 px-6 max-[375px]:text-xs rounded border-[0.7px] border-primary-100">
      <div class="">
        <p class="text-gray-400 leading-[160%]">Total Paid</p>
        <Skeleton v-if="statState.isLoading" class="w-[90px] h-4 mt-[3px]" />
        <p v-else class="text-success-500 font-medium leading-[160%]">{{ numberToCurrency(statState.stat?.total_amount_paid ?? "0") }}</p>
      </div>

      <div class="text-right">
        <p class="text-gray-400 leading-[160%]">Pending Earnings</p>
        <Skeleton v-if="statState.isLoading" class="w-[90px] h-4 mt-[3px] ml-auto" />
        <p v-else class="text-warning-500 font-medium leading-[160%]">{{ numberToCurrency(statState.stat?.total_expected_earning ?? "0") }}</p>
      </div>
    </div>

    <shared-section-details-card
      title="Recent Estimate"
      :description="`${submittedEstimates?.total_results ?? '0'} Estimate submitted`"
      :is-loading="status === 'pending'"
    >
      <shared-search-and-filter />

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
            view-more
            @view-more="handleViewEstimateDetail(item.id)"
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

        <provide-estimate-submitted-estimate-details-modal v-model="openModal.open" :id="openModal.id" />
      </div>
    </shared-section-details-card>
  </div>
</template>
