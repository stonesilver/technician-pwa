<script lang="ts" setup>
import { type ChangePasswordContext, ChangePasswordSchema } from "~/utils/yup-schemas"
import { type SubmissionHandler } from "vee-validate"
import type { UserContext } from "~/types/auth"

const open = defineModel<boolean>()
const isLoading = ref(false)

const formFields = [
  { model: "password", label: "Enter password" },
  { model: "new_password", label: "Confirm password" },
]

const handleSubmit: SubmissionHandler<ChangePasswordContext, any> = async (body: ChangePasswordContext) => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    const { token } = await useApi()<{ user: UserContext; token: string }>(changeAuthUserPasswordUrl, { method: "PATCH", body })
    localStorage.setItem("mca-tch", token)

    useToast.success("Password reset successful")
    open.value = false
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <shared-responsive-modal v-model="open" :dismissible="false">
    <template #content>
      <div class="max-lg:px-5">
        <div class="size-[50px] mx-auto bg-success-50 rounded-full center-item">
          <shared-icon name="padlock" />
        </div>

        <p class="text-secondary-3 text-xl font-semibold text-center leading-none mt-4">Change Password</p>

        <vee-form id="auth-change-password" class="mt-10 space-y-4" :validation-schema="ChangePasswordSchema" @submit="handleSubmit">
          <shared-form-field v-for="{ model, label } in formFields" :key="model" :name="model" :label="label" v-slot="{ field }">
            <shared-password-input :field="field" :placeholder="label" />
          </shared-form-field>
        </vee-form>

        <shared-info-card text="Pick a password you'll remember, but make sure it's secure!" class="my-10" />
      </div>
    </template>

    <template #footer>
      <div class="grid grid-cols-[123px_1fr] w-full gap-3.5 max-lg:px-5 max-lg:pb-5">
        <Button variant="secondary_soft" class="h-14" :disabled="isLoading" @click="open = false">Cancel</Button>
        <Button form="auth-change-password" class="h-14" :disabled="isLoading" :is-loading="isLoading">Save changes</Button>
      </div>
    </template>
  </shared-responsive-modal>
</template>
