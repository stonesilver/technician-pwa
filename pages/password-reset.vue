<script lang="ts" setup>
definePageMeta({ layout: "auth", titleTag: "Provide new password", hideNavBar: "yes" })

import { ResetPasswordSchema, type ResetPasswordPayload } from "~/utils/yup-schemas"
import { type SubmissionHandler } from "vee-validate"

const route = useRoute()
const identifier = route.query?.auth as string
const state = reactive({ submitted: false, loading: false, verifyingToken: false })
const formFields = [
  { model: "password", label: "Enter password" },
  { model: "new_password", label: "Confirm Password" },
]

const handleLogin: SubmissionHandler<ResetPasswordPayload, any> = async (values: ResetPasswordPayload) => {
  try {
    state.loading = true
    const body = { password: values.password, identifier, domain: "technician" }
    await useApi()(updatePasswordUrl, { method: "PUT", body })
    state.submitted = true
  } catch (error) {
  } finally {
    state.loading = false
  }
}

onMounted(async () => {
  if (identifier) {
    try {
      state.verifyingToken = true
      const body = { identifier, domain: "technician" }
      await useApi()(verifyAuthTokenUrl, { method: "POST", body })
    } catch (error) {
      showError({ status: 404, message: error as string })
    } finally {
      state.verifyingToken = false
    }
  } else {
    showError({ status: 404, message: "Missing authentication token" })
  }
})
</script>

<template>
  <div class="w-[calc(100%+40px)] -translate-x-5 min-h-dvh">
    <shared-splash-screen v-if="state.verifyingToken" />
    <layout-the-nav-bar />

    <div class="px-5 mt-11">
      <vee-form
        class="max-w-[434px] mx-auto w-full flex flex-col justify-end pt-14"
        autocomplete="off"
        :validation-schema="ResetPasswordSchema"
        @submit="handleLogin"
      >
        <div class="space-y-6">
          <shared-form-field v-for="{ model, label } in formFields" :key="model" :name="model" :label="label" v-slot="{ field }">
            <shared-password-input :field="field" :placeholder="label" />
          </shared-form-field>
        </div>

        <Button class="mt-28" :is-loading="state.loading" :disabled="state.loading">Reset Password</Button>
      </vee-form>
    </div>

    <shared-the-modal v-model="state.submitted" :dismissible="false">
      <template #content>
        <shared-modal-icon type="check" />

        <p class="text-center text-secondary-3 text-xl font-semibold mt-4">Password Reset Successful</p>

        <p class="text-gray-700 text-base text-center">
          Your password has been successfully reset. Click the button below to go to the login page and sign in with your new password.
        </p>
      </template>

      <template #footer>
        <Button class="h-12 rounded-[6.92px] w-full mt-14" @click="navigateTo('/')">Go to login</Button>
      </template>
    </shared-the-modal>
  </div>
</template>
