<script lang="ts" setup>
import { ProvideEstimateSchema } from "~/utils/yup-schemas"
import { numberToCurrency } from "~/utils/helper-functions/returns-string.ts"
import { currencyToNumber } from "~/utils/helper-functions/returns-number"

const {
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
  handleSubmitEstimate,
} = useProvideEstimate()
</script>

<template>
  <div>
    <div class="mt-14">
      <div
        ref="wrapperRef"
        class="no-scrollbar max-md:w-[calc(100%+20px)] w-full overflow-x-auto snap-x snap-mandatory scroll-smooth grid grid-flow-col gap-3 auto-cols-[85%] md:auto-cols-[295px]"
      >
        <div
          v-for="(item, index) in damages"
          :key="item.side"
          ref="partsRef"
          class="h-[469px] bg-gray-50 snap-start p-[11px_12px] rounded"
          :data-index="index"
        >
          <div class="relative w-full">
            <nuxt-img
              v-slot="{ src, isLoaded, imgAttrs }"
              :src="item.image"
              :alt="item.side"
              class="h-[342px] object-cover block rounded-[3.68px] bg-gray-200"
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

          <div class="mt-[18px] flex justify-between items-center gpa-2">
            <p class="text-sm leading-[18px] font-medium text-mca">Damage {{ index + 1 }}</p>
            <shared-badge :text="item.side" />
          </div>

          <div
            v-if="submittedEstimates[item.index]"
            class="w-full h-12 mt-[19px] bg-gray-100 rounded-lg flex items-center justify-between p-[11px_14px]"
          >
            <shared-list-item
              v-for="(value, key) in submittedEstimates[item.index]"
              :key="key"
              :label="key"
              :value="numberToCurrency(currencyToNumber(value))"
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

          <Button v-else variant="default_light" class="w-full h-12 mt-[19px]" @click="handleProvideEstimate(item)">
            Provide estimate
          </Button>
        </div>
      </div>

      <div class="mt-11 w-fit mx-auto flex gap-1">
        <span
          v-for="(item, index) in damages"
          :key="item.side"
          class="block rounded-full h-2 bg-gray-200 transition-all duration-200"
          :class="index === active ? 'w-10' : 'w-2'"
        />
      </div>
    </div>

    <div
      class="mt-24 h-20 border-t-[0.6px] border-t-success-500 bg-success-50 text-center center-item w-[calc(100%+40px)] max-md:-translate-x-5 md:w-full"
    >
      <p class="text-gray-500 text-sm leading-none font-medium">Total Estimate</p>
      <p class="text-2xl font-semibold text-gray-800 mt-[6px]">{{ numberToCurrency(estimateTotalAmount) }}</p>
    </div>

    <shared-info-card
      text="Please ensure that the repair estimate is accurate and aligns with the current market rates"
      class="my-[26px]"
    />

    <div ref="submitRef" class="pb-6 grid grid-cols-[auto_1fr] gap-3.5">
      <Button variant="secondary_soft" class="h-14" @click="modals.doLater = true">Do this later</Button>
      <Button class="h-14" @click="handleSubmitEstimate">{{ addedCount }} of 5</Button>
    </div>

    <shared-responsive-modal
      v-model="modals.provideEstimate"
      title="Provide Estimate"
      title-class="text-base text-secondary-3"
    >
      <template #content>
        <div class="max-lg:px-5 max-h-[75vh] overflow-y-auto pb-[47px]">
          <div class="h-[251px] overflow-hidden mt-4">
            <img :src="selectedPart?.image" alt="" class="object-cover size-full" />
          </div>

          <div class="mt-5 flex justify-between items-center gap-2">
            <shared-badge :text="selectedPart?.side ?? ''" />
            <Button
              variant="ghost"
              type="button"
              :disabled="isDownloading"
              class="text-sm hover:bg-success-50 leading-none font-medium !text-mca h-auto"
              @click="handleDownloadImage(selectedPart?.image ?? '', selectedPart?.side ?? '')"
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
            <shared-form-field name="amount" label="Damage part amount" v-slot="{ field }">
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

            <shared-form-field name="workmanship" label="Workmanship" v-slot="{ field }">
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
          <Button
            variant="secondary_soft"
            type="button"
            class="h-12 rounded-[6.92px]"
            @click="modals.provideEstimate = false"
          >
            Cancel
          </Button>

          <Button form="provide-estimate" class="h-12 rounded-[6.92px]">Save</Button>
        </div>
      </template>
    </shared-responsive-modal>

    <shared-the-modal v-model="modals.doLater" :dismissible="false">
      <template #content>
        <div class="size-[34px] rounded-full mx-auto center-item ring-[12px] bg-warning-500 ring-warning-50">
          <shared-icon name="exclamation-mark" class-name="[&>g]:fill-white size-6" />
        </div>

        <p class="text-center text-secondary-3 text-xl font-semibold mt-4">Do This Later</p>

        <p class="text-gray-700 text-base text-center">
          <span class="block">We understand you may not have repair estimate for this damage at the moment</span>
          <span class="block mt-4">
            <span class="text-warning-500">Note :</span> Kindly submit this within the next
            <span class="text-mca">8hours</span>.
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
          <Button variant="secondary_soft" type="button" class="h-12 rounded-[6.92px]" @click="modals.doLater = false">
            Cancel
          </Button>

          <Button class="h-12 rounded-[6.92px]" @click="navigateTo('/app/dashboard')">Alright</Button>
        </div>
      </template>
    </shared-the-modal>

    <shared-the-modal v-model="modals.sessionExpired" :dismissible="false">
      <template #content>
        <div class="size-[34px] rounded-full mx-auto center-item ring-[12px] bg-warning-500 ring-warning-50">
          <shared-icon name="exclamation-mark" class-name="[&>g]:fill-white size-6" />
        </div>

        <p class="text-center text-secondary-3 text-xl font-semibold mt-4">Session expired</p>

        <p class="text-gray-700 text-base text-center">
          <span class="block">
            This repair estimate submission session has expired, as someone else has already provided an estimate for
            this damage.
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
        <div class="size-[34px] rounded-full mx-auto center-item ring-[12px] bg-success-500 ring-success-50">
          <shared-icon name="check" />
        </div>

        <p class="text-center text-secondary-3 text-xl font-semibold mt-4">Estimate Submitted</p>

        <p class="text-gray-700 text-base text-center">
          You've successfully submitted the repair estimate for this damage. We'll review it and process your earnings
          shortly.
        </p>
      </template>

      <template #footer>
        <Button class="h-12 rounded-[6.92px] w-full mt-14" @click="navigateTo('/app/dashboard')">
          Go to dashboard
        </Button>
      </template>
    </shared-the-modal>
  </div>
</template>
