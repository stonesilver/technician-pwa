import { currencyToNumber } from "~/utils/helper-functions/returns-number"
import type { DamageEstimateContext, EstimateRequestContext } from "~/types/estimates"
import type { Options } from "~/types"
import { unifyVehicleDetails } from "~/utils/helper-functions/returns-object"

export const useProvideEstimate = () => {
  const route = useRoute()
  const wrapperRef = ref<HTMLDivElement | null>(null)
  const submitRef = ref<HTMLDivElement | null>(null)
  const partsRef = ref<(HTMLDivElement | null)[]>([])
  const active = ref(0)
  const isSubmitting = ref(false)
  const observer = ref<IntersectionObserver>()
  const damages = ref<DamageEstimateContext[]>([])
  const selectedPart = ref<DamageEstimateContext | undefined>(undefined)
  const modals = reactive({
    success: false,
    provideEstimate: false,
    doLater: false,
    sessionExpired: false,
    estimateSubmitted: false,
  })
  const vehicleDetails = ref<Options[]>([])
  const submittedEstimates = reactive<Record<number, DamageEstimateContext>>({})

  const addedCount = computed(() => Object.values(submittedEstimates).length)

  const estimateTotalAmount = computed(() => {
    const values = Object.values(submittedEstimates)

    return values.reduce(
      (acc, { damage_part_cost, service_charge }) =>
        acc + (currencyToNumber(damage_part_cost?.toString()) + currencyToNumber(service_charge?.toString())),
      0
    )
  })

  const isFetchingEstimateRequest = computed(() => status.value === "pending")

  const { data, status } = useCustomFetch<EstimateRequestContext>(`${getOneEstimateRequestUrl}${route.query.q}`, {
    headers: { "show-error": "400" },
    dedupe: "cancel",
    transform: (data) => {
      if (data.is_window_closed) {
        localStorage.removeItem(data.claim.id)
        modals.sessionExpired = true
      }

      if (!data.i_can_submit) {
        localStorage.removeItem(data.claim.id)
        modals.estimateSubmitted = true
      }

      try {
        const mcaPayload = data.claim.policy.meta.mca_payload

        const vehicle = unifyVehicleDetails(mcaPayload, data.claim.product.route_name)
        vehicleDetails.value = [
          { label: "Vehicle type", value: vehicle.vehicle_category },
          { label: "Vehicle manufacturer", value: vehicle.vehicle_make },
          { label: "Vehicle model", value: vehicle.vehicle_model },
          { label: "Manufactured year", value: vehicle.year_of_manufacture },
          { label: "Vehicle color", value: vehicle.vehicle_color },
        ]

        damages.value = data.claim.damages.map((damage, index) => {
          return {
            far_range: damage.far_range,
            close_range: damage.close_range,
            damage_area: damage.damage_area,
            damage_part: damage.damage_part,
            damage_part_cost: "0",
            service_charge: "0",
            type: "",
            index,
          }
        })

        const savedEstimate = localStorage.getItem(data.claim.id)
        if (savedEstimate) {
          const data = JSON.parse(savedEstimate)
          if (typeof data === "object") {
            for (const key in data) {
              submittedEstimates[Number(key)] = data[Number(key)]
            }
          }
        }
      } catch (error) {}

      return data
    },
    server: false,
  })

  const handleProvideEstimate = (arg: DamageEstimateContext) => {
    if (!data.value?.i_can_submit) return
    selectedPart.value = arg
    modals.provideEstimate = true
  }

  const handleAdd = (values: DamageEstimateContext) => {
    if (selectedPart.value) {
      submittedEstimates[selectedPart.value.index] = values

      localStorage.setItem(data.value?.claim.id as string, JSON.stringify(submittedEstimates))
    }

    modals.provideEstimate = false

    if (partsRef.value) {
      const addedPartsIndex = Object.keys(submittedEstimates).map((index) => Number(index))
      const nextCard = [...Array(damages.value.length).keys()].find((index) => !addedPartsIndex.includes(index))
      if (typeof nextCard === "number") {
        partsRef.value[nextCard]?.scrollIntoView()
      }

      if (submitRef.value && nextCard === undefined) {
        submitRef.value.scrollIntoView(false)
      }
    }
  }

  const handleSubmitEstimate = async () => {
    if (isSubmitting.value || !data.value?.i_can_submit) return

    const estimateLeft = damages.value.length - addedCount.value
    if (!!estimateLeft) {
      useToast.warning(`You have ${estimateLeft} estimate${estimateLeft > 1 ? "s" : ""} left to go.`, {
        duration: 3000,
      })
      return
    }

    const damage_estimates = Object.values(submittedEstimates).map((estimate) => {
      const cloneEstimate = JSON.parse(JSON.stringify(estimate))
      cloneEstimate.damage_part_cost = currencyToNumber(cloneEstimate.damage_part_cost) as unknown as string
      cloneEstimate.service_charge = currencyToNumber(cloneEstimate.service_charge) as unknown as string
      delete cloneEstimate.index

      return cloneEstimate as DamageEstimateContext
    })

    const body = { claim_id: data.value?.claim.id, damage_estimates }

    try {
      isSubmitting.value = true
      await useApi()(submitEstimateUrl, { method: "POST", body })
      localStorage.removeItem(data.value?.claim?.id as string)
      modals.estimateSubmitted = true
    } catch (error) {
    } finally {
      isSubmitting.value = false
    }
  }

  // TODO: convert this to a composable later !important
  const callback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        active.value = Number((entry.target as HTMLDivElement).dataset.index)
      }
    })
  }

  watch(
    () => damages.value,
    (val) => {
      if (val.length >= 1) {
        observer.value = new IntersectionObserver(callback, { threshold: 1, root: wrapperRef.value, rootMargin: "0px" })

        setTimeout(() => {
          partsRef.value.forEach((node) => {
            if (node && observer.value) {
              observer.value.observe(node)
            }
          })
        }, 100)
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    observer.value?.disconnect()
  })

  return {
    wrapperRef,
    submitRef,
    partsRef,
    handleProvideEstimate,
    handleAdd,
    addedCount,
    estimateTotalAmount,
    damages,
    submittedEstimates,
    modals,
    active,
    selectedPart,
    handleSubmitEstimate,
    vehicleDetails,
    isFetchingEstimateRequest,
    isSubmitting,
  }
}
