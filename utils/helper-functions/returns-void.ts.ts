export const logoutUser = () => {
  localStorage.removeItem("mca-tch")
  clearNuxtState("user")
  clearNuxtState("technician")
}
