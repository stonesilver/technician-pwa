<script lang="ts" setup>
import { numberToCurrency } from "~/utils/helper-functions/returns-string.ts"
import { currencyToNumber } from "~/utils/helper-functions/returns-number"
import type { DamageEstimateContext } from "~/types/estimates"

const {
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
} = useProvideEstimate()
</script>

<template>
  <div>
    <div class="mt-8 p-[17px_10px] md:p-[17px_16px] border-[0.4px] border-mca bg-primary-25">
      <p class="text-mca font-medium text-sm leading-none">Vehicle Information</p>

      <div class="mt-3 grid grid-cols-[auto_auto] gap-x-5 gap-y-2">
        <div v-for="item in 5" :key="item" v-if="isFetchingEstimateRequest" class="even:flex even:flex-col even:items-end py-1">
          <Skeleton class="h-[10.2px] w-full max-w-[140px] bg-primary-100/70 rounded-lg" />
          <Skeleton class="h-[10.2px] w-full max-w-[88px] bg-primary-100/70 mt-2 rounded-lg" />
        </div>

        <shared-list-item v-else v-for="(item, index) in vehicleDetails" :key="index" v-bind="item" class="even:text-right" />
      </div>
    </div>

    <div class="mt-14">
      <div
        ref="wrapperRef"
        class="no-scrollbar max-md:w-[calc(100%+20px)] w-full overflow-x-auto snap-x snap-mandatory scroll-smooth grid grid-flow-col gap-3"
        :class="[damages.length === 1 ? 'auto-cols-[98%] md:auto-cols-[99%]' : damages.length >= 2 ? 'auto-cols-[85%] md:auto-cols-[295px]' : '']"
      >
        <div
          v-if="isFetchingEstimateRequest"
          v-for="item in 5"
          :key="item"
          class="min-h-[469px] w-[85vw] md:w-[295px] bg-gray-50 snap-start p-[11px_12px] rounded"
        >
          <shared-image-loader class="h-[342px]" />
          <div class="flex items-center justify-between gap-5">
            <Skeleton class="h-[16px] w-[59.7px] bg-gray-200 rounded-lg mt-[18px]" />
            <Skeleton class="h-[21px] bg-warning-50 w-2/3 border-[0.5px] border-warning-500 rounded-lg mt-[18px]" />
          </div>
          <Skeleton class="h-12 rounded-lg mt-[19px]" />
        </div>

        <div
          v-else
          v-for="(item, index) in damages"
          :key="item.damage_area + item.damage_part"
          ref="partsRef"
          class="min-h-[469px] bg-gray-50 snap-start p-[11px_12px] rounded"
          :data-index="index"
        >
          <div class="relative w-full">
            <nuxt-img
              v-slot="{ src, isLoaded, imgAttrs }"
              :src="item.close_range"
              :alt="item.damage_area"
              class="h-[342px] w-full object-cover block rounded-[3.68px] bg-gray-200"
              :custom="true"
            >
              <img v-if="isLoaded" v-bind="imgAttrs" :src="src" class="h-[342px] object-cover block rounded-[3.68px]" />

              <shared-image-loader v-else class="h-[342px]" />
            </nuxt-img>

            <img
              v-if="submittedEstimates[item.index]"
              src="/images/done-stamp.webp"
              alt="estimate provided"
              class="size-[97px] absolute bottom-[7px] right-1"
            />
          </div>

          <div class="mt-[18px] flex justify-between items-center gap-4">
            <p class="text-sm leading-[18px] font-medium text-mca flex-shrink-0">Damage {{ damages.length > 1 ? index + 1 : "" }}</p>
            <shared-badge :text="`${item.damage_area} damage || ${item.damage_part}`" class="max-w-[70%] p-[4px_12px]" />
          </div>

          <div
            v-if="submittedEstimates[item.index]"
            class="w-full h-12 mt-[19px] bg-gray-100 rounded-lg flex items-center justify-between p-[11px_14px]"
          >
            <shared-list-item
              :label="submittedEstimates[item.index].type"
              :value="numberToCurrency(currencyToNumber(submittedEstimates[item.index].damage_part_cost))"
              label-class="leading-none text-gray-400 capitalize"
              value-class="text-mca leading-none mt-[2px]"
            />
            <shared-list-item
              label="Workmanship"
              :value="numberToCurrency(currencyToNumber(submittedEstimates[item.index].service_charge))"
              label-class="leading-none text-gray-400 capitalize"
              value-class="text-mca leading-none mt-[2px]"
            />

            <button
              type="button"
              class="flex items-center gap-1 text-mca flex-shrink-0 border-l pl-3 border-l-gray-400 text-sm font-semibold"
              @click="handleProvideEstimate(item)"
            >
              <shared-icon name="edit" />
              Edit
            </button>
          </div>

          <Button v-else variant="default_light" class="w-full h-12 mt-[19px]" @click="handleProvideEstimate(item)"> Provide estimate </Button>
        </div>
      </div>

      <div class="mt-8 w-fit mx-auto flex gap-1">
        <span
          v-for="(item, index) in damages.length || 4"
          :key="item"
          class="block rounded-full h-2 bg-gray-200 transition-all duration-200"
          :class="index === active ? 'w-10' : 'w-2'"
        />
      </div>
    </div>

    <div
      class="mt-12 h-20 border-t-[0.6px] border-t-success-500 lg:border-[0.6px] lg:border-success-500 bg-success-50 text-center center-item w-[calc(100%+40px)] max-md:-translate-x-5 md:w-full"
    >
      <p class="text-gray-500 text-sm leading-none font-medium">Total Estimate</p>
      <p class="text-2xl font-semibold text-gray-800 mt-[6px]">{{ numberToCurrency(estimateTotalAmount) }}</p>
    </div>

    <shared-info-card text="Please ensure that the repair estimate is accurate and aligns with the current market rates" class="my-8" />

    <div ref="submitRef" class="grid grid-cols-[auto_1fr] gap-3.5">
      <Button variant="secondary_soft" class="h-14" :disabled="isFetchingEstimateRequest || isSubmitting" @click="modals.doLater = true">
        Do this later
      </Button>
      <Button class="h-14" :disabled="isFetchingEstimateRequest || isSubmitting" :is-loading="isSubmitting" @click="handleSubmitEstimate">
        <span v-if="addedCount === damages.length || damages.length === 1"> Submit </span>
        <span v-else> {{ addedCount }} of {{ damages.length }}</span>
      </Button>
    </div>

    <provide-estimate-add-estimate-modal
      v-model="modals.provideEstimate"
      :selected-part="(selectedPart as DamageEstimateContext) ?? {}"
      :submitted-estimates="submittedEstimates"
      @submit-estimate="handleAdd"
    />

    <shared-the-modal v-model="modals.doLater" :dismissible="false">
      <template #content>
        <shared-modal-icon type="warning" />

        <p class="text-center text-secondary-3 text-xl font-semibold mt-4">Do This Later</p>

        <p class="text-gray-700 text-base text-center">
          <span class="block">We understand you may not have repair estimate for this damage at the moment</span>
          <span class="block mt-4">
            <span class="text-warning-500">Note :</span> Kindly submit this within the next <span class="text-mca">8hours</span>.
          </span>
        </p>

        <shared-info-card class="mt-7">
          <p class="text-gray-900 text-sm">
            If we don’t receive repair estimate within 24 hours,
            <span class="font-medium">you may not be able to send this request again</span>
          </p>
        </shared-info-card>
      </template>

      <template #footer>
        <div class="grid grid-cols-2 gap-3 w-full mt-14">
          <Button variant="secondary_soft" type="button" class="h-12 rounded-[6.92px]" @click="modals.doLater = false"> Cancel </Button>

          <Button class="h-12 rounded-[6.92px]" @click="navigateTo('/app/dashboard')">Alright</Button>
        </div>
      </template>
    </shared-the-modal>

    <shared-the-modal v-model="modals.sessionExpired" :dismissible="false">
      <template #content>
        <shared-modal-icon type="warning" />

        <p class="text-center text-secondary-3 text-xl font-semibold mt-4">Session expired</p>

        <p class="text-gray-700 text-base text-center">
          <span class="block">
            This repair estimate submission session has expired, as someone else has already provided an estimate for this damage.
          </span>
          <span class="block mt-4"> We recommend responding quickly next time to secure your submission. </span>
        </p>
      </template>

      <template #footer>
        <Button class="h-12 rounded-[6.92px] w-full mt-14" @click="navigateTo('/app/dashboard')">Alright</Button>
      </template>
    </shared-the-modal>

    <shared-the-modal v-model="modals.estimateSubmitted" :dismissible="false" content-class="py-9">
      <template #content>
        <shared-modal-icon type="check" />

        <p class="text-center text-secondary-3 text-xl font-semibold mt-4">Estimate Submitted</p>

        <p class="text-gray-700 text-base text-center">
          You've successfully submitted the repair estimate for this damage. We'll review it and process your earnings shortly.
        </p>
      </template>

      <template #footer>
        <Button class="h-12 rounded-[6.92px] w-full mt-14" @click="navigateTo('/app/dashboard')"> Go to dashboard </Button>
      </template>
    </shared-the-modal>
  </div>
</template>
