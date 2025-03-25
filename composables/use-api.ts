export const useApi = () => {
  const nuxtApp = useNuxtApp()

  const api = $fetch.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    onRequest({ options }) {
      const token = localStorage.getItem("technician")
      if (token) {
        options.headers.set("Authorization", `Bearer ${token}`)
      }
    },
    onResponse({ response }) {
      if (response._data.data) response._data = response._data.data
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo("/", { replace: true }))
      }

      throw response._data?.responseText || "Network error. Please try again soon."
    },
  })
  return api
}
