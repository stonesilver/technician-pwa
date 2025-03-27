<script lang="ts" setup>
definePageMeta({ layout: "default", titleTag: "Wallet" })

import { cn } from "@/lib/utils"
import type { Transaction, WalletTransactions } from "~/types/wallet"
import { numberToCurrency } from "~/utils/helper-functions/returns-string.ts"

const { data: walletBalance, status } = useCustomFetch<{ balance_withdrawable: string }>(getWalletBalanceUrl, {
  headers: { "show-error": "400" },
  dedupe: "cancel",
  server: false,
})

const { data: transactions, status: transactionStatus } = useCustomFetch<WalletTransactions>(getWalletTransactionUrl, {
  headers: { "show-error": "400" },
  dedupe: "cancel",
  transform: (data) => {
    data.transactions = [
      {
        id: "cc716136-99f6-4787-be5f-1b77646f12fc",
        reference_id: "TRN_LKSHBPEDIU1741248587805",
        account_withdrawn_to: null,
        type: "in",
        source: "purchase profit",
        status: "success",
        amount: "2240.0000",
        balance_before_transaction: "373248.2662",
        balance_after_transaction: "365288.3190",
        created_at: "2025-03-06T08:09:47.806Z",
      },
      {
        id: "63a87c54-33fe-4ac9-9270-709c614ac117",
        reference_id: "TRN_FCFBPECKGP1741248587449",
        account_withdrawn_to: null,
        type: "out",
        source: "purchase",
        status: "success",
        amount: "28000.0000",
        balance_before_transaction: "393288.3190",
        balance_after_transaction: "365288.3190",
        created_at: "2025-03-06T08:09:47.450Z",
      },
      {
        id: "b9ea23d2-83ea-4311-8b50-5a7421feb673",
        reference_id: "TRN_VTEEHCQLEY1741190314177",
        account_withdrawn_to: null,
        type: "in",
        source: "purchase profit",
        status: "success",
        amount: "1800.0000",
        balance_before_transaction: "399448.2662",
        balance_after_transaction: "393288.3190",
        created_at: "2025-03-05T15:58:34.178Z",
      },
      {
        id: "085a7d19-d215-4e78-99c3-0809bcabfead",
        reference_id: "TRN_GJJAPWYBIH1741190313810",
        account_withdrawn_to: null,
        type: "out",
        source: "purchase",
        status: "success",
        amount: "22500.0000",
        balance_before_transaction: "415788.3190",
        balance_after_transaction: "393288.3190",
        created_at: "2025-03-05T15:58:33.811Z",
      },
      {
        id: "96ab73f6-dd67-44ab-9a94-42cb69af35ea",
        reference_id: "TRN_TJEJALCVIL1741185663441",
        account_withdrawn_to: null,
        type: "in",
        source: "purchase profit",
        status: "success",
        amount: "80.0000",
        balance_before_transaction: "421868.2662",
        balance_after_transaction: "415788.3190",
        created_at: "2025-03-05T14:41:03.441Z",
      },
    ]
    return data
  },
  server: false,
})

const openModal = ref(false)
const openWithdrawalModal = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

const transactionDetails = computed(() => {
  return [
    { label: "Transaction date", value: Dayjs(selectedTransaction.value?.created_at).format("Do MMMM YYYY") },
    { label: "Transaction I.D", value: selectedTransaction.value?.reference_id as string },
    {
      label: "To",
      value:
        selectedTransaction.value?.type === "in"
          ? "Wallet"
          : selectedTransaction.value?.account_withdrawn_to?.bank_name
            ? `${selectedTransaction.value?.account_withdrawn_to?.bank_name ?? ""} || ${selectedTransaction.value?.account_withdrawn_to?.account_name ?? ""} || ${selectedTransaction.value?.account_withdrawn_to?.account_number ?? ""}`
            : "Bank account",
    },
  ]
})

const handleViewTransactionDetails = (arg: Transaction) => {
  selectedTransaction.value = arg
  openModal.value = true
}

const handleWithdrawalOnClick = () => {
  if (walletBalance.value && parseFloat(walletBalance.value.balance_withdrawable) > 0) {
    openWithdrawalModal.value = true
  } else {
    useToast.error("You do not have any withdrawable earnings")
  }
}
</script>

<template>
  <div>
    <div class="mt-8 bg-gray-50 text-center border-[0.4px] border-purple-100 rounded pt-[26px] pb-5 px-6">
      <p class="text-gray-500 text-sm leading-none">Wallet Balance</p>
      <Skeleton v-if="status === 'pending'" class="w-[150px] h-8 mx-auto mt-3.5" />
      <p v-else class="text-[2rem] text-mca font-semibold leading-none mt-3.5">{{ numberToCurrency(walletBalance?.balance_withdrawable ?? "0") }}</p>

      <div class="mt-5 pt-5">
        <Button variant="default_light" class="w-full h-[50px] rounded" :disabled="status === 'pending'" @click="handleWithdrawalOnClick">
          Withdraw Earnings
        </Button>
      </div>
    </div>

    <shared-section-details-card
      title="Transaction History"
      :description="`${transactions?.total_count ?? 0} transaction`"
      :is-loading="transactionStatus === 'pending'"
    >
      <shared-search-and-filter />

      <div class="mt-3.5 space-y-[18px]">
        <div v-for="item in 5" :key="item" v-if="transactionStatus === 'pending'">
          <Skeleton class="w-full h-[65.5px] mt-3.5" />
        </div>

        <shared-estimate-submitted-card
          v-else
          v-for="(item, index) in transactions?.transactions ?? []"
          :key="index"
          :column-one="{ label: item.type === 'in' ? 'Earnings' : 'Withdrawal', value: item.type === 'in' ? 'Inflow' : 'Outflow' }"
          :column-two="{ label: `${numberToCurrency(item.amount)} Earned`, value: Dayjs(item.created_at).format('Do MMMM YYYY') }"
          view-more
          @view-more="handleViewTransactionDetails(item)"
        >
          <template #icon>
            <div class="size-[38px] rounded center-item" :class="item.type === 'in' ? 'bg-success-50' : 'bg-error-50'">
              <shared-icon
                name="arrow-right"
                :class-name="
                  cn('size-[18px]', item.type === 'in' ? '[&>path]:stroke-success-500 -rotate-45' : '[&>path]:stroke-error-500 rotate-[135deg]')
                "
              />
            </div>
          </template>
        </shared-estimate-submitted-card>
      </div>
    </shared-section-details-card>

    <shared-responsive-modal v-model="openModal" title="Transaction details" header-class="max-lg:px-5" content-class="bg-gray-50 h-auto">
      <template #content>
        <div class="py-4 lg:pb-0 max-lg:pb-8 max-lg:px-5">
          <div
            class="border-[0.4px] max-[375px]:px-2 py-3 px-4 flex gap-3.5"
            :class="selectedTransaction?.type === 'in' ? 'bg-success-25 border-success-500' : 'bg-error-25 border-error-500'"
          >
            <div class="size-[38px] rounded center-item" :class="selectedTransaction?.type === 'in' ? 'bg-success-50' : 'bg-error-50'">
              <shared-icon
                name="arrow-right"
                :class-name="
                  cn(
                    'size-[18px]',
                    selectedTransaction?.type === 'in' ? '[&>path]:stroke-success-500 -rotate-45' : '[&>path]:stroke-error-500 rotate-[135deg]'
                  )
                "
              />
            </div>
            <div class="flex-1 grid grid-cols-[auto_auto]">
              <shared-list-item
                label="Transaction type"
                :value="selectedTransaction?.type === 'in' ? 'Inflow' : 'Outflow'"
                label-class="font-medium text-[#999CA0]"
                value-class="font-semibold"
              />
              <shared-list-item
                :label="selectedTransaction?.type === 'in' ? 'Earned' : 'Withdrew'"
                :value="numberToCurrency(selectedTransaction?.amount as string)"
                label-class="font-medium text-[#999CA0]"
                value-class="font-semibold"
                class="text-right"
              />
            </div>
          </div>

          <div class="mt-[31px] grid grid-cols-2 gap-3 max-lg:pb-8">
            <shared-list-item
              v-for="({ label, value }, index) in transactionDetails"
              :key="index"
              :label="label"
              :value="value"
              class="even:text-right break-words"
            />
          </div>
        </div>
      </template>
    </shared-responsive-modal>

    <wallet-withdraw-earning-modal v-model="openWithdrawalModal" />
  </div>
</template>
