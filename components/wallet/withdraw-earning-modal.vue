<script lang="ts" setup>
import { cn } from "@/lib/utils"
import { dummyBanks } from "./wallet.constants"
import type { Options } from "~/types"

const open = defineModel({ default: false })

const hasSetTransactionPin = ref(false)
const step = ref<0 | 1>(0)
const value = ref<string[]>([])
const select = ref<string[]>([])

const test = (arg: any) => {
  console.log(arg)
}
</script>

<template>
  <shared-responsive-modal
    v-if="hasSetTransactionPin"
    v-model="open"
    title="Withdraw Fund"
    description="Enter your account details"
    title-class="text-gray-800 text-base"
  >
    <template #content>
      <vee-form class="mt-[31px] max-lg:px-4 space-y-5">
        <shared-form-field name="bank_name" label="Select bank" v-slot="{ field }">
          <shared-select
            :model-value="field.value"
            :options="dummyBanks"
            placeholder="select bank"
            empty-text="No bank found"
            @update:model-value="($event) => field.onChange(($event as unknown as Options))"
          />
          <!-- @update:model-value="test" -->
        </shared-form-field>

        <shared-form-field name="account_number" label="Account number" v-slot="{ field }">
          <Input
            type="tel"
            inputmode="numeric"
            placeholder="Enter account number"
            autocomplete="off"
            :maxlength="10"
            v-bind="field"
          >
            <template #append>
              <p
                class="h-[35px] px-[10px] center-item bg-mcaDim text-gray-900 text-sm leading-none min-w-[105px] rounded-sm"
              >
                Chigozie Ezenwa sunday
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
            :prepend-icon="{ name: 'naira', className: 'size-3 [&>path]:fill-gray-600' }"
            :maxlength="10"
            v-bind="field"
          />
        </shared-form-field>
      </vee-form>
    </template>

    <template #footer>
      <div :class="cn('grid grid-cols-2 gap-3 mt-[47px] w-full max-lg:pb-[30px] max-lg:px-4')">
        <Button
          v-if="step === 0"
          variant="secondary_soft"
          type="button"
          class="h-12 rounded-[6.92px]"
          @click="open = false"
        >
          Go back
        </Button>

        <Button class="h-12 rounded-[6.92px]">Withdraw</Button>
      </div>
    </template>
  </shared-responsive-modal>

  <shared-the-modal v-else v-model="open">
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
  </shared-the-modal>
</template>
