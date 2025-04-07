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
        const isPasswordReset = from.fullPath.includes("/password-reset")
        if (isPasswordReset) {
          logoutUser()
          return
        }

        const path = ["/", "/app/account"].includes(from.fullPath) ? "/app/dashboard" : from.fullPath
        // if (from.fullPath === to.fullPath && history.length) {
        //   return useRouter().back()
        // }

        return navigateTo(path)
      }
    }
  }
})
