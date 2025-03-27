import { isTokenValid } from "~/utils/helper-functions/returns-boolean"
import { logoutUser } from "~/utils/helper-functions/returns-void.ts"

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    if (to.meta.layout === "default") {
      const isAuth = isTokenValid()

      if (!isAuth) {
        logoutUser()
        return navigateTo({ path: "/", query: { callback: to.fullPath } }, { replace: true })
      }
    }

    if (to.meta.layout === "auth") {
      const isAuth = isTokenValid()

      if (isAuth) {
        const path = from.fullPath === "/" ? "/app/dashboard" : from.fullPath
        return navigateTo(path)
      }
    }
  }
})
