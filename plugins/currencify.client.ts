import { formatCurrency } from "~/utils/helper-functions/returns-string.ts"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("currency", {
    mounted(el, binding) {
      if (el.value && binding.value) {
        el.value = formatCurrency(el.value)
      }
    },
    updated(el, binding) {
      if (binding.value) {
        el.value = formatCurrency(el.value)
      }
    },
  })
})
