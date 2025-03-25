<script lang="ts" setup>
import type { UserContext } from "~/types/auth"

onMounted(async () => {
  if (!useState("technician").value) {
    try {
      const { user } = await useApi()<{ user: UserContext }>(getUserUrl, { retry: 5, retryDelay: 5000 })
      useState<UserContext>("technician", () => user)
    } catch (error) {
      useToast.error(error as string)
      localStorage.removeItem("technician")
      return navigateTo("/")
    }
  }
})
</script>

<template>
  <div id="app-layout" class="w-full relative max-w-3xl mx-auto flex flex-col bg-white flex-1">
    <layout-the-nav-bar />
    <div class="px-5 pb-12">
      <slot />
    </div>
  </div>
</template>
