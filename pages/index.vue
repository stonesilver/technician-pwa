<script lang="ts" setup>
import type { LoginPayload } from "~/utils/yup-schemas"
import { LoginSchema } from "~/utils/yup-schemas"
import { type SubmissionHandler } from "vee-validate"
import { welcomeBackMessage } from "~/utils/helper-functions/returns-string.ts"

definePageMeta({ layout: "auth" })

const isLoading = ref(false)

const handleLogin: SubmissionHandler<LoginPayload, any> = async (values: LoginPayload) => {
  isLoading.value = true

  const res = useApi()<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: { ...values, email: values.phone_number },
  })
  useToast.promise(res, {
    loading: "Authenticating",
    success: async (data: any) => {
      localStorage.setItem("technician", data.access_token)

      await navigateTo("/app/provide-estimate?q=8677-7567-766-43245-hh64")

      isLoading.value = false
      return welcomeBackMessage()
    },
    error: (error: any) => {
      isLoading.value = false
      return error as string
    },
    description: (arg: any) => {
      console.log(arg, "******* arg *****")
      return typeof arg === "string" ? "Ensure your phone number and password is correct." : ""
    },
  })
}
</script>

<template>
  <div class="flex flex-col flex-1">
    <div class="flex-1 flex flex-col md:justify-center pt-12">
      <div class="mx-auto size-[90px] bg-primary-50 center-item rounded-lg">
        <shared-icon name="repair-technician" />
      </div>

      <p class="mt-[26px] text-xl text-secondary-3 text-center mx-auto max-w-[255px] leading-[22px] font-semibold">
        Welcome to Technician Repair Portal
      </p>

      <vee-form
        class="max-w-[434px] mx-auto w-full flex flex-col justify-end pt-14"
        autocomplete="off"
        :validation-schema="LoginSchema"
        @submit="handleLogin"
      >
        <div class="flex-1 flex flex-col justify-center space-y-6">
          <shared-form-field name="phone_number" label="Phone number" v-slot="{ field }">
            <Input
              type="tel"
              inputmode="numeric"
              placeholder="Enter  phone number"
              maxlength="110"
              autocomplete="off"
              v-bind="field"
            />
          </shared-form-field>

          <shared-form-field name="password" label="Password" v-slot="{ field }">
            <shared-password-input :field="field" />
          </shared-form-field>
        </div>

        <Button class="mt-28" :is-loading="isLoading" :disabled="isLoading">Continue</Button>
      </vee-form>
    </div>

    <div class="py-4 mb-6 flex justify-center items-center gap-[5px]">
      <shared-icon name="shield" class-name="size-3.5" />
      <p class="text-xs text-gray-500 font-medium">Powered by</p>
      <shared-icon name="mca-logo" />
    </div>
  </div>
</template>
