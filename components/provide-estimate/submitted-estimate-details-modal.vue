<script lang="ts" setup>
import type { Options } from "~/types"
import type { OneSubmittedEstimateContext } from "~/types/estimates"
import { numberToCurrency } from "~/utils/helper-functions/returns-string.ts"

type DetailsContext = {
  estimateDetails: Options[]
  damageDetails: Options[][]
  amountPaidToTechnician: string
  isTechnicianPaid: boolean
  totalDamagedParts: number
}

const props = defineProps<{ id: string }>()

const open = defineModel<boolean>()
const isLoading = ref(true)
const estimateDetails = ref<DetailsContext | null>(null)

const getEstimateDetails = async (val: boolean | undefined) => {
  if (val) {
    try {
      isLoading.value = true
      const estimate = await useApi()<OneSubmittedEstimateContext>(`${getSubmittedEstimatesUrl}/${props.id}`, { headers: { "show-error": "400" } })

      const mcaPayload = estimate.claim.policy.meta.mca_payload
      const details = {
        estimateDetails: [
          { label: "Vehicle name", value: `${mcaPayload.vehicle_make} ${mcaPayload.vehicle_model} ${mcaPayload.vehicle_year_manufactured}` },
          { label: "No of damage part", value: estimate.total_damaged_parts?.toString() },
          { label: "Date submitted", value: Dayjs(estimate.created_at).format("Do MMMM YYYY") },
          { label: "Total estimated", value: numberToCurrency(estimate.total_estimate_cost) },
        ],
        damageDetails: estimate.damage_estimates.map((damage, index) => {
          return [
            { label: `Damage part ${index + 1}`, value: `${damage.damage_area} ( ${damage.damage_part} )` },
            { label: "Type", value: damage.type },
            { label: "Estimated Amount", value: numberToCurrency(damage.damage_part_cost + damage.service_charge) },
          ]
        }),
        amountPaidToTechnician: estimate.expected_earning,
        isTechnicianPaid: estimate.is_technician_paid,
        totalDamagedParts: estimate.total_damaged_parts,
      }

      estimateDetails.value = details
    } catch (error) {
      useToast(error + "")
      open.value = false
    } finally {
      isLoading.value = false
    }
  }
}

watch(() => open.value, getEstimateDetails)
</script>

<template>
  <shared-responsive-modal v-model="open" title="Estimate Details" header-class="max-lg:px-5" content-class="bg-gray-50">
    <template #content>
      <div class="max-h-[73vh] overflow-y-auto">
        <div class="py-4 pb-8 max-lg:px-5 grid grid-cols-[auto_auto] gap-3">
          <div v-if="isLoading" v-for="(item, index) in 4" :key="index" class="space-y-1 even:flex even:flex-col even:items-end mt-1">
            <Skeleton class="w-[80%] h-3" />
            <Skeleton class="w-[60%] h-4" />
          </div>

          <template v-else>
            <shared-list-item
              v-for="{ label, value } in estimateDetails?.estimateDetails"
              :key="label"
              :label="label"
              :value="value"
              class="even:text-right"
            />

            <shared-list-item label="Status">
              <shared-badge
                :text="estimateDetails?.isTechnicianPaid ? 'Paid' : 'Pending'"
                :variant="estimateDetails?.isTechnicianPaid ? 'success' : 'info'"
                class="w-fit px-3"
              />
            </shared-list-item>
          </template>
        </div>

        <div class="pt-7 pb-8 max-lg:bg-white max-lg:px-5">
          <Skeleton v-if="isLoading" class="w-[100px] h-3" />
          <h3 v-else class="text-gray-500 text-sm leading-[18px]">
            {{ estimateDetails?.totalDamagedParts }} Damage part{{ Number(estimateDetails?.totalDamagedParts ?? 0) > 1 ? "s" : "" }}
          </h3>

          <div class="mt-2 space-y-3">
            <Skeleton v-for="item in 3" :key="item" v-if="isLoading" class="w-full h-[58.6px] rounded-sm" />

            <template v-else>
              <div
                v-for="(item, index) in estimateDetails?.damageDetails"
                :key="index"
                class="bg-gray-50 grid grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] gap-3 border-[0.3px] border-gray-300 min-h-[55px] rounded-sm p-[8px_1rem]"
              >
                <shared-list-item
                  v-for="({ label, value }, index) in item"
                  :key="index"
                  :label="label"
                  :value="value"
                  class="last:text-right group"
                  label-class="group-even:text-center"
                  value-class="group-last:text-mca group-even:text-center truncate group-even:font-medium"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="h-[58px] w-full bg-success-50 border-t-[0.4px] border-t-success-500 lg:border lg:border-success-500 lg:mb-4 center-item">
        <Skeleton v-if="isLoading" class="w-[40%] h-5" />

        <p v-else class="flex items-center gap-2 text-lg text-gray-800 font-semibold">
          <span class="text-gray-500 font-normal text-sm">Earnings</span>
          {{ numberToCurrency(estimateDetails?.amountPaidToTechnician ?? "0") }}
        </p>
      </div>
    </template>
  </shared-responsive-modal>
</template>
