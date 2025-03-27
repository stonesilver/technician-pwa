<script lang="ts" setup>
import { type ProvideEstimateSchemaContext, ProvideEstimateSchema } from "~/utils/yup-schemas"
import { type SubmissionHandler } from "vee-validate"
import type { Options } from "~/types"
import type { DamageEstimateContext } from "~/types/estimates"

type SelectedPart = { far_range: string; close_range: string; damage_area: string; damage_part: string; index: number }
const open = defineModel<boolean>()
const props = defineProps<{
  selectedPart: SelectedPart
  submittedEstimates: any
}>()

const emits = defineEmits<{ (e: "submit-estimate", arg: DamageEstimateContext): void }>()
const { isDownloading, download } = useDownloadFile()
const wrapperRef = ref<HTMLDivElement | null>(null)
const partsRef = ref<(HTMLDivElement | null)[]>([])
const active = ref(0)
const observer = ref<IntersectionObserver>()

const selectOptions = [
  { label: "Replacement", value: "Replacement" },
  { label: "Fixing", value: "Fixing" },
]

const images = computed(() => {
  return [
    { label: "Close range", src: props.selectedPart?.close_range },
    { label: "Far range", src: props.selectedPart?.far_range },
  ]
})

const handleDownloadImage = (src: string, filename: string) => {
  if (isDownloading.value) return
  download(src, filename)
}
const handleAdd: SubmissionHandler<ProvideEstimateSchemaContext, any> = (values: ProvideEstimateSchemaContext) => {
  emits("submit-estimate", { ...props.selectedPart, ...values })
}

// TODO: convert this to a composable
const callback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      active.value = Number((entry.target as HTMLDivElement).dataset.index)
    }
  })
}

watch(
  () => wrapperRef.value,
  (val) => {
    if (val) {
      if (wrapperRef.value) {
        observer.value = new IntersectionObserver(callback, { threshold: 1, root: wrapperRef.value, rootMargin: "0px" })

        partsRef.value.forEach((node) => {
          if (node && observer.value) {
            observer.value.observe(node)
          }
        })
      }
    } else {
      observer.value?.disconnect()
    }
  }
)
</script>

<template>
  <shared-responsive-modal v-model="open" title="Provide Estimate" title-class="text-base text-secondary-3">
    <template #content>
      <div class="max-lg:px-5 max-h-[75vh] overflow-y-auto pb-[47px]">
        <div class="size-fit relative">
          <div
            ref="wrapperRef"
            class="h-[251px] rounded no-scrollbar w-full overflow-x-auto snap-x snap-mandatory scroll-smooth grid grid-flow-col gap-1 auto-cols-[100%]"
          >
            <img
              ref="partsRef"
              v-for="({ label, src }, index) in images"
              :key="index"
              :src="src"
              alt=""
              class="object-cover block size-full snap-start"
              :data-index="index"
            />

            <span class="bg-gray-50 p-[2px_4px] absolute top-4 right-4 z-[1] text-sm leading-none text-gray-500">
              {{ images[active].label }}
            </span>
          </div>
        </div>

        <div class="mt-3 w-fit mx-auto flex gap-1">
          <span
            v-for="(item, index) in 2"
            :key="item"
            class="block rounded-full h-2 bg-gray-200 transition-all duration-200"
            :class="index === active ? 'w-10' : 'w-2'"
          />
        </div>

        <div class="mt-5 flex justify-between items-center gap-2">
          <shared-badge :text="`${selectedPart?.damage_area ?? ''} damage || ${selectedPart?.damage_part}`" class="truncate p-[4px_12px]" />
          <Button
            variant="ghost"
            type="button"
            :disabled="isDownloading"
            class="text-sm hover:bg-success-50 leading-none font-medium !text-mca h-auto"
            @click="handleDownloadImage(selectedPart?.close_range ?? '', selectedPart?.damage_area ?? '')"
          >
            Download Damage
          </Button>
        </div>

        <vee-form
          id="provide-estimate"
          class="mt-11 space-y-5 lg:px-[1px]"
          :initial-values="submittedEstimates[selectedPart?.index as unknown as number]"
          :validation-schema="ProvideEstimateSchema"
          @submit="handleAdd"
        >
          <div class="grid grid-cols-2 gap-[10px]">
            <shared-form-field name="damage_part_cost" label="Damage part amount" v-slot="{ field }">
              <Input
                type="text"
                inputmode="numeric"
                placeholder="E.g., ₦25,000"
                autocomplete="off"
                currency
                :prepend-icon="{ name: 'naira', className: 'size-3 [&>path]:fill-gray-600' }"
                v-bind="field"
              />
            </shared-form-field>
            <shared-form-field name="type" label="Type" v-slot="{ field }">
              <shared-select
                :model-value="{ label: field.value, value: field.value }"
                :options="selectOptions"
                placeholder="Select type"
                empty-text="No type found"
                @update:model-value="($event) => field.onChange(($event as unknown as Options).value)"
              />
            </shared-form-field>
          </div>

          <shared-form-field name="service_charge" label="Workmanship" v-slot="{ field }">
            <Input
              type="text"
              inputmode="numeric"
              placeholder="Enter the estimated cost of repair"
              autocomplete="off"
              currency
              :prepend-icon="{ name: 'naira', className: 'size-3 [&>path]:fill-gray-600' }"
              v-bind="field"
            />
          </shared-form-field>
        </vee-form>
      </div>
    </template>

    <template #footer>
      <div class="grid grid-cols-2 gap-3 w-full max-lg:pb-[30px] max-lg:px-4">
        <Button variant="secondary_soft" type="button" class="h-12 rounded-[6.92px]" @click="open = false"> Cancel </Button>

        <Button form="provide-estimate" class="h-12 rounded-[6.92px]">Save</Button>
      </div>
    </template>
  </shared-responsive-modal>
</template>
