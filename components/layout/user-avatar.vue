<script lang="ts" setup>
import { DropdownMenuArrow } from "reka-ui"
import type { TechnicianContext } from "~/types/auth"
import { logoutUser } from "~/utils/helper-functions/returns-void.ts"

const route = useRoute()
const technician = useState<TechnicianContext>("technician")

const handleLogout = () => {
  logoutUser()

  const callback = route.fullPath
  return navigateTo({ path: "/", query: { callback } })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <button type="button" class="size-[38px] relative rounded-full center-item border border-purple-500">
        <img v-if="!!technician?.logo_url" :src="technician.logo_url" alt="technician" class="size-full object-cover rounded-full" />
        <span v-else class="font-semibold text-purple-500 text-lg">
          {{ technician?.first_name?.[0] ?? "" }}{{ technician?.last_name?.[0] ?? "" }}
        </span>

        <div class="size-[18px] rounded-full bg-white center-item absolute -right-[9px] bottom-[0] border border-purple-500">
          <shared-icon name="caret-down" />
        </div>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="rounded-xl w-[125px]">
      <DropdownMenuItem class="text-sm !text-gray-700 font-medium h-[36px] rounded-lg cursor-pointer">
        <nuxt-link to="/app/account" class="size-full">Account</nuxt-link>
      </DropdownMenuItem>
      <DropdownMenuItem class="text-sm !text-error-500 font-medium h-[36px] rounded-lg cursor-pointer" @click="handleLogout">
        Logout
      </DropdownMenuItem>

      <DropdownMenuArrow class="[&>path]:fill-white stroke-slate-200 w-4 h-3" />
    </DropdownMenuContent>
  </DropdownMenu>
</template>
