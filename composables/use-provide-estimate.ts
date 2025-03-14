import type { ProvideEstimateSchemaContext } from "~/utils/yup-schemas"
import type { SubmissionHandler } from "vee-validate"
import { dummyDamages } from "~/components/provide-estimate/constants.provide-estimate"

export const useProvideEstimate = () => {
  const wrapperRef = ref<HTMLDivElement | null>(null)
  const submitRef = ref<HTMLDivElement | null>(null)
  const partsRef = ref<(HTMLDivElement | null)[]>([])
  const active = ref(0)
  const observer = ref<IntersectionObserver>()
  const damages = ref(dummyDamages)
  const selectedPart = ref<(typeof damages.value)[0] | undefined>()
  const modals = reactive({ success: false, estimate: false, doLater: false, sessionExpired: false })
  const submittedEstimates = reactive<Record<number, ProvideEstimateSchemaContext>>({})
  const { isDownloading, download } = useDownloadFile()

  const callback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        active.value = Number((entry.target as HTMLDivElement).dataset.index)
      }
    })
  }

  const handleProvideEstimate = (arg: (typeof damages.value)[0]) => {
    selectedPart.value = arg
    modals.estimate = true
  }

  const handleAdd: SubmissionHandler<ProvideEstimateSchemaContext, any> = (values: ProvideEstimateSchemaContext) => {
    if (selectedPart.value) {
      submittedEstimates[selectedPart.value.index] = values
    }

    modals.estimate = false

    if (partsRef.value) {
      const addedPartsIndex = Object.keys(submittedEstimates).map((index) => Number(index))
      const nextCard = [...Array(damages.value.length).keys()].find((index) => !addedPartsIndex.includes(index))
      if (nextCard) {
        partsRef.value[nextCard]?.scrollIntoView()
      }

      if (submitRef.value && nextCard === undefined) {
        submitRef.value.scrollIntoView(false)
      }
    }
  }

  const handleDownloadImage = (src: string, filename: string) => {
    if (isDownloading.value) return
    download(src, filename)
  }

  const addedCount = computed(() => Object.values(submittedEstimates).length)

  const estimateTotalAmount = computed(() => {
    const values = Object.values(submittedEstimates)

    return values.reduce((acc, { amount, workmanship }) => acc + (parseFloat(amount) + parseFloat(workmanship)), 0)
  })

  onMounted(() => {
    if (wrapperRef.value) {
      observer.value = new IntersectionObserver(callback, { threshold: 1, root: wrapperRef.value, rootMargin: "0px" })

      partsRef.value.forEach((node) => {
        if (node && observer.value) {
          observer.value.observe(node)
        }
      })
    }
  })

  onBeforeUnmount(() => {
    observer.value?.disconnect()
  })

  return {
    wrapperRef,
    submitRef,
    partsRef,
    handleProvideEstimate,
    handleAdd,
    handleDownloadImage,
    addedCount,
    estimateTotalAmount,
    damages,
    submittedEstimates,
    modals,
    active,
    selectedPart,
    isDownloading,
  }
}
