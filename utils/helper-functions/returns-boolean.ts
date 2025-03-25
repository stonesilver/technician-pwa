export const isTokenValid = () => {
  if (import.meta.client) {
    const token = localStorage.getItem("technician")

    if (!token) {
      return false
    } else {
      try {
        const { exp } = JSON.parse(atob(token?.split(".")[1] ?? {}))

        if (!exp) {
          return false
        }

        return exp * 1000 >= new Date().getTime()
      } catch (error) {
        return false
      }
    }
  }

  return true
}
