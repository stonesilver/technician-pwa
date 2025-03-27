<script lang="ts" setup>
import { type ChangePasswordContext, ChangePasswordSchema } from "~/utils/yup-schemas"
import { type SubmissionHandler } from "vee-validate"
import type { TechnicianContext, UserContext } from "~/types/auth"

const open = defineModel<boolean>()
const technician = defineModel<TechnicianContext>("technician")
const isLoading = ref(false)

const formFields = [
  { model: "password", label: "Enter old password" },
  { model: "new_password", label: "Enter new password" },
]

const handleSubmit: SubmissionHandler<ChangePasswordContext, any> = async (body: ChangePasswordContext) => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    const { user, token } = await useApi()<{ user: UserContext; token: string }>(changeAuthUserPasswordUrl, { method: "PATCH", body })
    localStorage.setItem("mca-tch", token)
    const tech = await useApi()<TechnicianContext>(`${getTechnicianUrl}${user.id}`)
    useState<TechnicianContext>("technician", () => tech)
    technician.value = tech
    useToast.success("Password reset successful")
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <shared-the-modal v-model="open" :dismissible="false">
    <template #content>
      <div class="max-h-[70vh]">
        <shared-modal-icon type="warning" />

        <p class="text-center text-secondary-3 leading-none text-xl font-semibold mt-[26px]">Secure Your Account</p>

        <p class="text-gray-600 text-sm text-center leading-[18px] mt-3">
          To access your account, you need to create a secure password. This password will be used to log in and keep your account safe.
        </p>

        <vee-form
          id="change-first-password"
          class="mt-10 space-y-4 rounded-lg bg-gray-50 px-5 py-8"
          :validation-schema="ChangePasswordSchema"
          @submit="handleSubmit"
        >
          <shared-form-field v-for="{ model, label } in formFields" :key="model" :name="model" :label="label" v-slot="{ field }">
            <shared-password-input :field="field" :placeholder="label" />
          </shared-form-field>
        </vee-form>

        <shared-info-card text="Pick a password you'll remember, but make sure it's secure!" class="my-10" />
      </div>
    </template>

    <template #footer>
      <div class="grid grid-cols-1 w-full gap-3.5">
        <!-- <Button variant="secondary_soft" class="h-14" @click="open = false">Cancel</Button> -->
        <Button form="change-first-password" class="h-14" :disabled="isLoading" :is-loading="isLoading">Save change</Button>
      </div>
    </template>
  </shared-the-modal>
</template>
