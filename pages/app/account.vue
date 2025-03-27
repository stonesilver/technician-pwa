<script lang="ts" setup>
import type { TechnicianContext } from "~/types/auth"

definePageMeta({ layout: "default", titleTag: "Account", goBack: "yes" })

const technician = useState<TechnicianContext>("technician")
const modals = reactive({ changePassword: false, changeUser: false })
const uploading = shallowRef(false)

const details = computed(() => {
  return [
    {
      title: "Personal details",
      type: "list" as const,
      listItems: [
        { label: "Fullname", value: `${technician.value?.first_name ?? ""} ${technician.value?.last_name ?? ""}` },
        { label: "Phone number", value: technician.value?.phone_number ?? "" },
        { label: "E-mail address", value: technician.value?.email ?? "" },
      ],
      editText: "Edit",
      onEdit: () => {
        modals.changeUser = true
      },
    },
    {
      title: "Business details",
      type: "list" as const,
      listItems: [
        { label: "Business name", value: technician.value?.business_name ?? "" },
        { label: "Business email", value: technician.value?.email ?? "" },
      ],
      editText: "",
      onEdit: () => {},
    },
    {
      title: "Password",
      type: "password" as const,
      listItems: [],
      editText: "Change",
      onEdit: () => {
        modals.changePassword = true
      },
    },
  ]
})

const defaultValues = computed(() => ({
  first_name: technician.value?.first_name ?? "",
  last_name: technician.value?.last_name ?? "",
  phone_number: technician.value?.phone_number ?? "",
  email: technician.value?.email ?? "",
}))

const field = { value: "placeholder-password" } as any

const handleUploadLogo = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]

  if (file) {
    if (typeof file.type === "string" && !file.type.includes("image")) {
      useToast.error("Only images allowed")
      return
    }

    if (!!file.size && file.size / 1024 > 2048) {
      useToast.error("Image can not be more than 2MB")
      return
    }

    try {
      uploading.value = true
      const formData = new FormData()
      formData.set("file", file)
      const { file_url: logo_url } = await useApi()<{ file_url: string }>(uploadFileUrl, { method: "POST", body: formData })
      const res = await useApi()<TechnicianContext>(`${getTechnicianUrl}${technician.value.id}`, { method: "PATCH", body: { logo_url } })
      technician.value = res
    } catch (error) {
    } finally {
      uploading.value = false
    }
  } else {
    useToast.error("Oops! no file was selected. Please try again.")
  }
}
</script>

<template>
  <div>
    <div class="center-item relative mx-auto size-[70px] rounded-full bg-primary-50 text-[1.85rem] font-bold text-mca mt-[38px]">
      <img v-if="!!technician?.logo_url" :src="technician.logo_url" alt="technician" class="size-full object-cover rounded-full" />
      <span v-else> {{ technician?.first_name?.[0] ?? "" }}{{ technician?.last_name?.[0] ?? "" }} </span>

      <div class="size-[26px] overflow-hidden rounded-full bg-white center-item absolute right-0 bottom-[0]">
        <shared-icon name="edit" class-name="size-3 [&>path]:stroke-mca" />

        <span
          class="size-full border border-primary-500 absolute top-0 left-0 rounded-full"
          :class="uploading ? 'animate-spin border-r-transparent border-t-transparent border-b-transparent' : undefined"
        />
        <input type="file" class="size-full rounded-full opacity-0 absolute top-0 left-0 appearance-none" @input="handleUploadLogo" />
      </div>
    </div>

    <div class="mt-[26px] space-y-[18px]">
      <account-details-card v-for="(item, index) in details" :key="index" :title="item.title" :edit-text="item.editText" @on-edit="item.onEdit">
        <div v-if="item.type === 'list'" class="grid grid-cols-2 gap-5">
          <shared-list-item v-for="({ label, value }, index) in item.listItems" :key="index" :label="label" :value="value" class="even:text-right" />
        </div>

        <shared-password-input v-if="item.type === 'password'" :field="field" placeholder="" input-class="bg-white" do-not-change-type />
      </account-details-card>
    </div>

    <account-change-password-modal v-model="modals.changePassword" />
    <account-edit-personal-details-modal v-model="modals.changeUser" v-model:technician="technician" :default-values="defaultValues" />
  </div>
</template>
