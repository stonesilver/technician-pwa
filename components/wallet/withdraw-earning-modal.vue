<script lang="ts" setup>
import { type AddBankContext, AddBankSchema } from "~/utils/yup-schemas"
import { type SubmissionHandler } from "vee-validate"
import { cn } from "@/lib/utils"
import type { Options } from "~/types"
import { debounce } from "~/utils/helper-functions/returns-function"
import { currencyToNumber } from "~/utils/helper-functions/returns-number"
import { numberToCurrency } from "~/utils/helper-functions/returns-string.ts"
import type { BankAccountContext } from "~/types/wallet"

const open = defineModel({ default: false })
const state = reactive({ loading: false, name: "", submitting: false })
const debounceFunc = debounce()

const bankOptions = ref<Options[]>([])

const { data: bankAccount, refresh } = useCustomFetch<{ bankAccounts: BankAccountContext[] }>(getBankAccountUrl, {
  headers: { "show-error": "400" },
  dedupe: "cancel",
  server: false,
  getCachedData(key, nuxtApp) {
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  },
})

onMounted(async () => {
  try {
    await useCustomFetch<{ banks: { name: string; code: string }[] }>(listBankUrl, {
      transform: (data) => {
        bankOptions.value = data.banks.map(({ code, name }) => ({ label: name, value: code }))
        return data
      },
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
      },
      server: false,
    })
  } catch (error) {}
})

const handleSubmit: SubmissionHandler<AddBankContext, any> = async (body: AddBankContext) => {
  if (state.loading) return useToast.warning("Please wait while we verify your account number.")
  if (!state.name) return useToast.error("Enter a valid account number.")

  try {
    const api = useApi()
    state.submitting = true
    const { account_number, bank_code, bank_name, isDefault, ...rest } = body
    let id = defaultValues.value?.id
    if (!defaultValues.value) {
      const createAccountPayload = { account_number, bank_code, bank_name, isDefault: true }
      const { bankAccount } = await api<{ bankAccount: BankAccountContext }>(createBankAccountUrl, { method: "POST", body: createAccountPayload })
      id = bankAccount.id
    }

    rest.amount = currencyToNumber(rest.amount) as unknown as string
    const data = await api(transferFromWalletUrl, {
      method: "POST",
      body: { bank_account_id: id, ...rest },
    })
    useToast.success(`${numberToCurrency(rest.amount)} has been transfer to your ${bank_name} account.`)
    refresh()
  } catch (error) {
  } finally {
    state.submitting = false
  }
}

const handleGetAccountNumber = (account_number: string, bank_code: string) => {
  return debounceFunc(async () => {
    if (account_number.length === 10 && bank_code) {
      state.loading = true
      try {
        const body = { account_number, bank_code }
        const { bankAccount } = await useApi()<{ bankAccount: BankAccountContext }>(verifyAccountNumberUrl, { method: "POST", body })
        state.name = bankAccount.account_name
      } catch (error) {
        state.name = ""
      } finally {
        state.loading = false
      }
    } else {
      state.name = ""
    }
  }, 1000)
}

const defaultValues = computed(() => {
  const bank = bankAccount.value?.bankAccounts?.find((acc) => acc.isDefault)
  if (bank) {
    const { account_number, bank_code, bank_name, isDefault, id } = bank
    handleGetAccountNumber(account_number, bank_code)
    return { account_number, bank_code, bank_name, isDefault, id }
  } else {
    return undefined
  }
})
</script>

<template>
  <shared-responsive-modal
    v-model="open"
    title="Withdraw Fund"
    description="Enter your account details"
    title-class="text-gray-800 text-base"
    :dismissible="false"
  >
    <template #content>
      <vee-form
        id="withdraw-earnings"
        v-slot="{ values, setFieldValue }"
        class="mt-[31px] max-lg:px-4 space-y-5"
        :initial-values="defaultValues"
        :validation-schema="AddBankSchema"
        @submit="handleSubmit"
      >
        <shared-form-field name="bank_name" label="Select bank" v-slot="{ field }">
          <shared-select
            :model-value="{ label: values.bank_name, value: values.bank_code }"
            :options="bankOptions"
            :disabled="!!defaultValues"
            placeholder="Select bank"
            empty-text="No bank found"
            @update:model-value="
              ($event) => {
                const value = $event as unknown as Options
                setFieldValue('bank_name', value.label)
                setFieldValue('bank_code', value.value)
                handleGetAccountNumber(values.account_number, values.bank_code)
              }
            "
          />
        </shared-form-field>

        <shared-form-field name="account_number" label="Account number" v-slot="{ field }">
          <Input
            v-bind="field"
            type="tel"
            inputmode="numeric"
            placeholder="Enter account number"
            autocomplete="off"
            :disabled="!!defaultValues"
            :readonly="!!defaultValues"
            :maxlength="10"
            number
            @input="handleGetAccountNumber(values.account_number, values.bank_code)"
          >
            <template #append>
              <shared-icon v-if="state.loading" name="loader" class-name="text-mca size-7" class="bg-mcaDim rounded-sm px-2 h-[35px] center-item" />
              <p v-else-if="state.name" class="h-[35px] px-[10px] center-item bg-mcaDim text-gray-900 text-sm leading-none min-w-[105px] rounded-sm">
                {{ state.name }}
              </p>
            </template>
          </Input>
        </shared-form-field>

        <shared-form-field name="amount" label="Amount" v-slot="{ field }">
          <Input
            type="tel"
            inputmode="numeric"
            placeholder="Enter amount"
            autocomplete="off"
            currency
            :prepend-icon="{ name: 'naira', className: 'size-3 [&>path]:fill-gray-600' }"
            v-bind="field"
          />
        </shared-form-field>

        <shared-form-field name="password" label="Enter Password" v-slot="{ field }">
          <shared-password-input :field="field" placeholder="Enter Password" />
        </shared-form-field>
      </vee-form>
    </template>

    <template #footer>
      <div :class="cn('grid grid-cols-2 gap-3 mt-[47px] w-full max-lg:pb-[30px] max-lg:px-4')">
        <Button variant="secondary_soft" type="button" class="h-12 rounded-[6.92px]" :disabled="state.submitting" @click="open = false">
          Go back
        </Button>

        <Button form="withdraw-earnings" class="h-12 rounded-[6.92px]" :disabled="state.loading" :is-loading="state.submitting"> Withdraw </Button>
      </div>
    </template>
  </shared-responsive-modal>

  <!-- <shared-the-modal v-else v-model="open">
    <template #content>
      <div
        class="size-[34px] rounded-full mx-auto center-item ring-[12px]"
        :class="step === 0 ? 'bg-warning-500 ring-warning-50' : 'bg-success-500 ring-success-50'"
      >
        <shared-icon
          :name="step === 0 ? 'exclamation-mark' : 'check'"
          :class-name="cn('[&>g]:fill-white', step === 0 ? 'size-6' : 'size-4')"
        />
      </div>

      <h3 class="text-2xl text-center text-secondary-3 font-semibold leading-none mt-5">
        {{ step === 0 ? "Secure Your Withdrawals" : "PIN Set Successfully!" }}
      </h3>

      <p class="leading-[18px] text-sm text-center">
        {{
          step === 0
            ? "To proceed with your withdrawal, you need to create a secure PIN. This PIN will be used to authorize all future withdrawal transactions."
            : "Your PIN has been created successfully. You can now proceed with your withdrawal securely.Click the button below to continue."
        }}
      </p>

      <vee-form
        v-if="step === 0"
        class="mt-[22px] bg-gray-50 rounded-lg sm:max-w-fit mx-auto max-[375px]:px-5 px-6 py-5 space-y-5"
      >
        <shared-form-field name="pin" label="Create PIN" v-slot="{ field }">
          <shared-otp :count="4" id="create-pin" />
        </shared-form-field>

        <shared-form-field name="pin" label="Confirm PIN" v-slot="{ field }">
          <shared-otp :count="4" id="create-pin" />
        </shared-form-field>
      </vee-form>
    </template>

    <template #footer>
      <div :class="cn('grid gap-3 mt-[47px] w-full', step === 0 ? 'grid-cols-2' : 'grid-cols-1')">
        <Button
          v-if="step === 0"
          variant="secondary_soft"
          type="button"
          class="h-12 rounded-[6.92px]"
          @click="open = false"
        >
          Cancel
        </Button>

        <Button class="h-12 rounded-[6.92px]" @click="hasSetTransactionPin = true">Save</Button>
      </div>
    </template>
  </shared-the-modal> -->
</template>
