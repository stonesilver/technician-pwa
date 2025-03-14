<script lang="ts" setup>
import { DropdownMenuArrow } from "reka-ui"

const open = ref(false)
const passwordIsVisible = reactive({ current_password: false, new_password: false })

const formFields = [
  { model: "current_password", label: "Enter current password" },
  { model: "new_password", label: "Enter new password" },
]
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <button type="button" class="size-[38px] relative bg-gray-300 rounded-full center-item border border-purple-500">
        <img
          src="https://www.svgrepo.com/show/384670/account-avatar-profile-user.svg"
          alt="technician"
          class="size-full object-cover rounded-full"
        />

        <div
          class="size-[18px] rounded-full bg-white center-item absolute -right-[9px] bottom-[0] border border-purple-500"
        >
          <shared-icon name="caret-down" />
        </div>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="rounded-xl w-[125px]">
      <DropdownMenuItem class="text-sm !text-gray-700 font-medium cursor-pointer" @click="open = true">
        Password
      </DropdownMenuItem>
      <DropdownMenuItem class="text-sm !text-error-500 font-medium cursor-pointer">Logout</DropdownMenuItem>

      <DropdownMenuArrow class="[&>path]:fill-white stroke-slate-200 w-4 h-3" />
    </DropdownMenuContent>
  </DropdownMenu>

  <shared-responsive-modal v-model="open" :dismissible="false">
    <template #content>
      <div class="max-lg:px-5">
        <div class="size-[50px] mx-auto bg-success-50 rounded-full center-item">
          <shared-icon name="padlock" />
        </div>

        <p class="text-secondary-3 text-xl font-semibold text-center leading-none mt-4">Update Password</p>

        <vee-form class="mt-10 space-y-4">
          <shared-form-field
            v-for="{ model, label } in formFields"
            :key="model"
            :name="model"
            :label="label"
            v-slot="{ field }"
          >
            <Input :placeholder="label" v-bind="field">
              <template #append>
                <shared-icon
                  :name="passwordIsVisible[model as keyof typeof passwordIsVisible] ? 'eye' : 'eye-slash'"
                  class="cursor-pointer"
                  @click="
                    passwordIsVisible[model as keyof typeof passwordIsVisible] =
                      !passwordIsVisible[model as keyof typeof passwordIsVisible]
                  "
                />
              </template>
            </Input>
          </shared-form-field>
        </vee-form>

        <shared-info-card text="Pick a password you'll remember, but make sure it's secure!" class="mb-10 mt-20" />
      </div>
    </template>

    <template #footer>
      <div class="grid grid-cols-[123px_1fr] w-full gap-3.5 max-lg:px-5 max-lg:pb-5">
        <Button variant="secondary_soft" class="h-14" @click="open = false">Cancel</Button>
        <Button class="h-14">Save changes</Button>
      </div>
    </template>
  </shared-responsive-modal>
</template>
