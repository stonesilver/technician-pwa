import type { TechnicianContext } from "~/types/auth"
import type { EstimatesStats, SubmittedEstimateContext } from "~/types/estimates"
import { formatSubmittedEstimate } from "~/utils/helper-functions/returns-array"

export const useEstimateSubmitted = () => {
  const technician = useState<TechnicianContext>("technician")
  const statState = reactive<{ stat: EstimatesStats | null; isLoading: boolean }>({ stat: null, isLoading: true })

  const { data: submittedEstimates, status } = useCustomFetch<SubmittedEstimateContext>(getSubmittedEstimatesUrl, {
    headers: { "show-error": "400" },
    dedupe: "cancel",
    server: false,
  })

  const estimates = computed(() => {
    return formatSubmittedEstimate(submittedEstimates.value?.estimates)
  })

  const getEstimates = async (val: TechnicianContext) => {
    if (!!val) {
      try {
        statState.isLoading = true
        const res = await useApi()<EstimatesStats>(`${getEstimatesStatUrl}${technician.value?.id}`, { headers: { "show-error": "400" } })
        statState.stat = res
      } catch (error) {
      } finally {
        statState.isLoading = false
      }
    }
  }

  watch(() => technician.value, getEstimates, { immediate: true })

  return { submittedEstimates, estimates, status, statState }
}
