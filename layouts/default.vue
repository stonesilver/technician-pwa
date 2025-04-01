<script lang="ts" setup>
import type { TechnicianContext, UserContext } from "~/types/auth"

const technician = useState<TechnicianContext>("technician")
const isFirstTimeLogin = computed(() => technician.value && !technician.value.has_changed_password)
const loading = ref(!technician.value)

onMounted(async () => {
  const user = useState<UserContext>("user")

  if (!user.value || !technician.value) {
    try {
      loading.value = true
      if (!user.value) {
        const res = await useApi()<{ user: UserContext }>(getUserUrl, { retry: 5, retryDelay: 5000 })
        useState<UserContext>("user", () => res.user)
      }

      if (!technician.value) {
        loading.value = true
        const tech = await useApi()<TechnicianContext>(`${getTechnicianUrl}${user.value.id}`)
        useState<TechnicianContext>("technician", () => tech)
      }
    } catch (error) {
      // useToast.error(error as string)
      // logoutUser()
      // const route = useRoute()
      // const callback = route.query?.callback ? route.query.callback : "/app/dashboard"

      // return navigateTo({ path: "/", query: { callback } }, { replace: true })
      showError({ status: 400, message: error + "" })
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <div id="app-layout" class="w-full relative flex flex-col bg-white flex-1">
    <shared-splash-screen v-if="loading" />

    <layout-the-nav-bar />

    <div class="px-5 pb-12 w-full max-w-3xl mx-auto">
      <slot />
    </div>

    <auth-first-time-login-modal v-model="isFirstTimeLogin" v-model:technician="technician" />
  </div>
</template>
