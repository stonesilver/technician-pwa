export const useApi = () => {
  const nuxtApp = useNuxtApp()

  const api = $fetch.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    onRequest({ options }) {
      const token = localStorage.getItem("mca-tch")
      if (token) {
        options.headers.set("Authorization", `Bearer ${token}`)
      }
    },
    onResponse({ response }) {
      if (response._data.data) response._data = response._data.data
    },
    async onResponseError({ response, options }) {
      if (response.status === 401) {
        const route = useRoute()
        const callback = route.query?.callback ? route.query.callback : "/app/dashboard"
        await nuxtApp.runWithContext(() => navigateTo({ path: "/", query: { callback } }, { replace: true }))
      }

      const errorStatus = options.headers.get("show-error")
      if (errorStatus) {
        showError({ status: response.status, message: response._data?.responseText ?? "Oops!, an error occurred" })
      }

      const responseText = response._data?.responseText
      const errorMessage = Array.isArray(responseText) ? responseText[0] : response._data?.responseText || "Network error. Please try again soon."
      useToast.error(errorMessage)
      throw response._data?.responseText || "Network error. Please try again soon."
    },
  })
  return api
}
