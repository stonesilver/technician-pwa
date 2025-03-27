<script lang="ts" setup>
import type { TechnicianContext } from "~/types/auth"

const checked = defineModel({ default: false })
const showContent = ref(false)
const route = useRoute()

const routes = [
  { label: "Overview", icons: { active: "overview-filled", inactive: "overview-outline" }, href: "/app/dashboard" },
  {
    label: "Estimate",
    icons: { active: "estimate-filled", inactive: "estimate-outline" },
    href: "/app/estimate-submitted",
  },
  { label: "Wallet", icons: { active: "wallet-filled", inactive: "wallet-outline" }, href: "/app/wallet" },
]

const technician = useState<TechnicianContext>("technician")

watch(route, () => {
  showContent.value = false
})
</script>

<template>
  <label class="relative w-[25px] h-[17.5px] bg-transparent cursor-pointer block" for="burger">
    <input v-model="checked" type="checkbox" id="burger" class="hidden" />
    <span
      class="block absolute h-[2.5px] w-full bg-mca rounded-[9px] opacity-[1] transition-all duration-200 ease-in-out origin-[left_center]"
      :class="checked ? 'rotate-45 top-0 left-[5px]' : 'rotate-0 top-0'"
    />
    <span
      class="block absolute h-[2.5px] bg-mca rounded-[9px] rotate-0 transition-all duration-200 ease-in-out top-1/2 origin-[left_center] -translate-y-[50%]"
      :class="checked ? 'w-0 opacity-0' : 'w-full opacity-[1]'"
    />
    <span
      class="block absolute h-[2.5px] w-full bg-mca rounded-[9px] opacity-[1] transition-all duration-200 ease-in-out origin-[left_center] -translate-y-[100%]"
      :class="checked ? '-rotate-45 top-[20.5px] left-[5px]' : 'rotate-0 top-full'"
    />

    <teleport to="body">
      <transition
        mode="in-out"
        enter-active-class="transition-opacity duration-100"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        @after-enter="showContent = true"
      >
        <div v-if="checked" class="fixed inset-0 w-full h-dvh z-[6] bg-[#00000085]" @click.self="showContent = false">
          <transition
            mode="in-out"
            enter-active-class="transition-transform duration-200"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition-transform duration-200"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full"
            @after-leave="checked = false"
          >
            <div v-if="showContent" class="bg-white w-full max-w-[266px] h-full">
              <div class="h-[73px] border-b px-5 flex justify-center flex-col">
                <p class="text-xl font-medium text-gray-800">{{ technician?.first_name ?? "" }}</p>
                <p class="text-gray-600 text-sm leading-[115%] capitalize">{{ technician?.category ?? "" }}</p>
              </div>

              <div class="mt-10 px-5 space-y-[18px]">
                <nuxt-link
                  v-for="{ label, icons: { active, inactive }, href } in routes"
                  :key="href"
                  :to="href"
                  active-class="bg-primary-50 text-[#094063] font-semibold"
                  v-slot="{ isActive }"
                  class="flex gap-6 items-center h-12 rounded w-full p-[14px_13px] font-medium"
                >
                  <shared-icon :name="isActive ? active : inactive" />
                  <span class="text-base">{{ label }}</span>
                </nuxt-link>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </teleport>
  </label>
</template>
