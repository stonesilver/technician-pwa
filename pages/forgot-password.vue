<script lang="ts" setup>
definePageMeta({ layout: "auth", titleTag: "Forgot password", goBack: "yes" })

import { ForgotPasswordSchema, type ForgotPasswordPayload } from "~/utils/yup-schemas"
import { type SubmissionHandler } from "vee-validate"

const state = reactive({ submitted: false, loading: false })
const formFields = [
  { model: "username", label: "Email address", type: "email", placeholder: "Enter  email address", inputMode: "numeric" as const },
  { model: "phone_number", label: "Whatsapp number", type: "tel", placeholder: "Enter whatsapp number", inputMode: "text" as const },
]

const handleLogin: SubmissionHandler<ForgotPasswordPayload, any> = async (values: ForgotPasswordPayload) => {
  try {
    state.loading = true
    const body = { ...values, domain: "technician" }
    if (body.phone_number) body.phone_number = "+234" + body.phone_number.slice(1)
    await useApi()(initiateResetPasswordUrl, { method: "POST", body })
    state.submitted = true
  } catch (error) {
  } finally {
    state.loading = false
  }
}
</script>

<template>
  <div class="w-[calc(100%+40px)] -translate-x-5 min-h-dvh">
    <layout-the-nav-bar />

    <div class="px-5 mt-11">
      <shared-info-card text="Please Enter your registered phone number and email to reset your password" />

      <vee-form
        class="max-w-[434px] mx-auto w-full flex flex-col justify-end pt-14"
        autocomplete="off"
        :validation-schema="ForgotPasswordSchema"
        @submit="handleLogin"
      >
        <div class="flex-1 flex flex-col justify-center space-y-6">
          <shared-form-field
            v-for="(formField, index) in formFields"
            :key="index"
            :name="formField.model"
            :label="formField.label"
            v-slot="{ field }"
          >
            <Input :type="formField.type" :inputmode="formField.inputMode" :placeholder="formField.placeholder" autocomplete="off" v-bind="field" />
          </shared-form-field>
        </div>

        <Button class="mt-28" :is-loading="state.loading" :disabled="state.loading">Reset Password</Button>
      </vee-form>
    </div>

    <shared-the-modal v-model="state.submitted" :dismissible="false">
      <template #content>
        <shared-modal-icon type="check" />

        <p class="text-center text-secondary-3 text-xl font-semibold mt-4">Reset Link Sent</p>

        <p class="text-gray-700 text-base text-center">
          A one-time password reset link has been sent to your registered contact. Please check your E-mail or Whatsapp to continue.
        </p>
      </template>

      <template #footer>
        <Button class="h-12 rounded-[6.92px] w-full mt-14" @click="navigateTo('/')">Okay</Button>
      </template>
    </shared-the-modal>
  </div>
</template>
