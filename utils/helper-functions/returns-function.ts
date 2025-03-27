export const debounce = () => {
  let time_out_ID: ReturnType<typeof setTimeout>

  return (callback: () => void, delay = 2000) => {
    clearTimeout(time_out_ID)

    time_out_ID = setTimeout(() => callback(), delay)
  }
}
