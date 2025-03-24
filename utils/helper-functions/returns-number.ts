export const currencyToNumber = (arg: string) => {
  if (typeof arg !== "string") return 0

  return parseFloat(arg?.toString().replace(/,/g, ""))
}
