<script lang="ts" setup>
definePageMeta({ layout: "default", titleTag: "Wallet" })

import { cn } from "@/lib/utils"
import { numberToCurrency } from "~/utils/helper-functions/return-string.ts"

const openModal = ref(false)
const openWithdrawalModal = ref(false)
const selectedTransaction = ref("")
const dummyTransactions = ["in", "out", "in", "in"]

const transactionDetails = [
  { label: "Transaction date", value: "12th july 2024" },
  { label: "Transaction I.D", value: "REF8748H34VJ9373" },
  { label: "To", value: "Wallet" },
]

const handleViewTransactionDetails = (arg: string) => {
  selectedTransaction.value = arg
  openModal.value = true
}
</script>

<template>
  <div>
    <div class="mt-8 bg-gray-50 text-center border-[0.4px] border-purple-100 rounded pt-[26px] pb-5 px-6">
      <p class="text-gray-500 text-sm leading-none">Total Earnings</p>
      <p class="text-[2rem] text-mca font-semibold leading-none mt-3.5">{{ numberToCurrency(400000) }}</p>

      <div class="mt-5 pt-5">
        <Button variant="default_light" class="w-full h-[50px] rounded" @click="openWithdrawalModal = true">
          Withdraw Earnings
        </Button>
      </div>
    </div>

    <shared-section-details-card title="Transaction History" description="240 history">
      <shared-search-and-filter />

      <div class="mt-3.5 space-y-[18px]">
        <shared-estimate-submitted-card
          v-for="(item, index) in dummyTransactions"
          :key="index"
          :row-one="{ label: item === 'in' ? 'Earnings' : 'Withdrawal', value: item === 'in' ? 'Inflow' : 'Outflow' }"
          :row-two="{ label: `${numberToCurrency(2500)} Earned`, value: '12th july 2024' }"
          view-more
          @view-more="handleViewTransactionDetails(item)"
        >
          <template #icon>
            <div class="size-[38px] rounded center-item" :class="item === 'in' ? 'bg-success-50' : 'bg-error-50'">
              <shared-icon
                name="arrow-right"
                :class-name="
                  cn(
                    'size-[18px]',
                    item === 'in'
                      ? '[&>path]:stroke-success-500 -rotate-45'
                      : '[&>path]:stroke-error-500 rotate-[135deg]'
                  )
                "
              />
            </div>
          </template>
        </shared-estimate-submitted-card>
      </div>
    </shared-section-details-card>

    <shared-responsive-modal
      v-model="openModal"
      title="Transaction details"
      header-class="max-lg:px-5"
      content-class="bg-gray-50"
    >
      <template #content>
        <div class="py-4 pb-8 max-lg:px-5">
          <div
            class="border-[0.4px] max-[375px]:px-2 py-3 px-4 flex gap-3.5"
            :class="selectedTransaction === 'in' ? 'bg-success-25 border-success-500' : 'bg-error-25 border-error-500'"
          >
            <div
              class="size-[38px] rounded center-item"
              :class="selectedTransaction === 'in' ? 'bg-success-50' : 'bg-error-50'"
            >
              <shared-icon
                name="arrow-right"
                :class-name="
                  cn(
                    'size-[18px]',
                    selectedTransaction === 'in'
                      ? '[&>path]:stroke-success-500 -rotate-45'
                      : '[&>path]:stroke-error-500 rotate-[135deg]'
                  )
                "
              />
            </div>
            <div class="flex-1 grid grid-cols-[auto_auto]">
              <shared-list-item
                label="Transaction type"
                :value="selectedTransaction === 'in' ? 'Inflow' : 'Outflow'"
                label-class="font-medium text-[#999CA0]"
                value-class="font-semibold"
              />
              <shared-list-item
                label="Earnings"
                :value="numberToCurrency(50000)"
                label-class="font-medium text-[#999CA0]"
                value-class="font-semibold"
                class="text-right"
              />
            </div>
          </div>

          <div class="mt-[31px] grid grid-cols-2 gap-3 pb-8">
            <shared-list-item
              v-for="({ label, value }, index) in transactionDetails"
              :key="index"
              :label="label"
              :value="value"
              class="even:text-right"
            />
          </div>
        </div>
      </template>
    </shared-responsive-modal>

    <wallet-withdraw-earning-modal v-model="openWithdrawalModal" />
  </div>
</template>
