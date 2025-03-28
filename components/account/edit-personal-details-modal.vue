<script lang="ts" setup>
import { type UserSchemaContext, UserSchema } from "~/utils/yup-schemas"
import { type SubmissionHandler } from "vee-validate"
import type { TechnicianContext } from "~/types/auth"

const open = defineModel<boolean>()
const technician = defineModel<TechnicianContext>("technician")
defineProps<{ defaultValues: UserSchemaContext }>()

const loading = shallowRef(false)
const formFields = [
  { model: "first_name", label: "First name", type: "text", disable: false },
  { model: "last_name", label: "Last name", type: "text", disable: false },
  { model: "phone_number", label: "Phone number", type: "text", disable: true },
  { model: "email", label: "E-mail address", type: "email", disable: true },
]

const handleSubmit: SubmissionHandler<UserSchemaContext, any> = async (values: UserSchemaContext) => {
  try {
    loading.value = true
    const body = { first_name: values.first_name, last_name: values.last_name }
    const res = await useApi()<TechnicianContext>(`${getTechnicianUrl}${technician.value?.id}`, { method: "PATCH", body })
    technician.value = res
    useToast.success("Profile updated successfully.")
    open.value = false
  } catch (error) {
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <shared-responsive-modal v-model="open" :dismissible="false">
    <template #content>
      <div class="max-lg:px-5 max-h-[75vh] overflow-y-auto lg:px-[2px]">
        <div class="size-[50px] mx-auto bg-success-50 rounded-full center-item">
          <shared-icon name="padlock" />
        </div>

        <p class="text-secondary-3 text-xl font-semibold text-center leading-none mt-4">Edit Personal details</p>

        <vee-form
          id="change-user"
          class="mt-10 space-y-4 pb-16"
          :initial-values="defaultValues"
          :validation-schema="UserSchema"
          @submit="handleSubmit"
        >
          <shared-form-field v-for="{ model, label, type, disable } in formFields" :key="model" :name="model" :label="label" v-slot="{ field }">
            <Input :model-value="field.value" :type="type" :placeholder="label" :disabled="disable" :readonly="disable" v-bind="field" />
          </shared-form-field>
        </vee-form>
      </div>
    </template>

    <template #footer>
      <div class="grid grid-cols-[123px_1fr] w-full gap-3.5 max-lg:px-5 max-lg:pb-5">
        <Button variant="secondary_soft" class="h-14" :disabled="loading" @click="open = false">Cancel</Button>
        <Button form="change-user" class="h-14" :disabled="loading" :is-loading="loading">Save changes</Button>
      </div>
    </template>
  </shared-responsive-modal>
</template>
