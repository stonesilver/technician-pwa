<script lang="ts" setup>
import type { PendingEstimateListContext } from "~/types/estimates"

defineProps<{ pendingEstimates: PendingEstimateListContext[] }>()
const open = defineModel<boolean>({ default: false })

const selected = ref<PendingEstimateListContext | null>(null)

const handleProceed = async () => {
  if (!selected.value) return

  await navigateTo(`/app/provide-estimate?q=${selected.value?.id}`)
}
</script>

<template>
  <shared-responsive-modal v-model="open" title="Pending estimate" title-class="text-base text-warning-500">
    <template #content>
      <div class="min-h-[190px] modal-content-max-height maxi-h-[70vh] overflow-y-auto pt-3 max-lg:px-5 pb-[47px] lg:px-[1px]">
        <p class="text-sm text-[#999CA0]">Select any of the repair estimate to proceed</p>

        <div class="mt-7 space-y-[18px]">
          <template v-for="item in pendingEstimates" :key="item.id">
            <div
              class="flex flex-col justify-end min-h-[66px] bg-gray-50 rounded-[4.64px] px-[15px] py-2 ring-1 lg:cursor-pointer"
              :class="selected?.id === item.id ? 'ring-mca' : 'ring-transparent'"
              @click="selected = item"
            >
              <p class="text-base font-semibold leading-[24px]" :class="selected?.id === item.id ? 'text-mca' : 'text-gray-600'">
                {{ item.description }}
              </p>
              <p class="text-xs">
                Estimate provided
                <span class="text-warning-500 font-medium">( {{ item.provided }} of {{ item.limit }})</span>
              </p>
            </div>
          </template>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="max-lg:px-5 max-lg:pb-[30px] w-full">
        <Button class="h-12 w-full rounded-[6.92px]" :disabled="selected === null" @click="handleProceed"> Continue </Button>
      </div>
    </template>
  </shared-responsive-modal>
</template>
