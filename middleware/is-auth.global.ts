import { isTokenValid } from "~/utils/helper-functions/returns-boolean"

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    if (to.meta.layout === "default") {
      const isAuth = isTokenValid()

      if (!isAuth) {
        return navigateTo("/")
      }
    }

    if (to.meta.layout === "auth") {
      const isAuth = isTokenValid()

      if (isAuth) {
        const navigateUrl = from.fullPath === "/" ? "/app/dashboard" : from.fullPath
        return navigateTo(navigateUrl)
      }
    }
  }
})
