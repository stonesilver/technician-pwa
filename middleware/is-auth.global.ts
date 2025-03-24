import type { UserContext } from "~/types/auth"
import { isTokenValid } from "~/utils/helper-functions/returns-boolean"

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    if (to.meta.layout === "default") {
      const isAuth = isTokenValid()

      if (!isAuth) {
        return navigateTo("/")
      } else {
        if (!useState("technician").value) {
          try {
            const user = await useApi()<UserContext>("/auth/profile")
            useState<UserContext>("technician", () => user)
          } catch (error) {
            useToast.error(error as string)
            return navigateTo("/")
          }
        }
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
