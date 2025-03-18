const defaultCurrency = { locale: "en-NG", currency: "NGN", style: "currency" }

export const numberToCurrency = (
  number: number | bigint | string | [string],
  minify = false,
  minimumFractionDigits = 0,
  currency = defaultCurrency
) => {
  if (typeof number === "string") {
    number = parseFloat(number)
  }
  if (Array.isArray(number)) {
    number = parseFloat(number[0])
  }

  if (["string", "number", "bigint"].includes(typeof number) || Array.isArray(number)) {
    if (minify) {
      switch (true) {
        case number >= 1000000000:
          const B = Number(
            (Number(number) / 1000000000)
              .toFixed(2)
              .toString()
              .replace(/[0-9]$/, "")
          )
          return (
            new Intl.NumberFormat(currency.locale, {
              //  @ts-ignore
              style: currency.style,
              currency: currency.currency,
              minimumFractionDigits,
            }).format(B) + "B"
          )
        case number >= 1000000:
          const M = Number(
            (Number(number) / 1000000)
              .toFixed(2)
              .toString()
              .replace(/[0-9]$/, "")
          )
          return (
            new Intl.NumberFormat(currency.locale, {
              //  @ts-ignore
              style: currency.style,
              currency: currency.currency,
              minimumFractionDigits,
            }).format(M) + "M"
          )
        case number >= 100000:
          const K = Number(
            (Number(number) / 1000)
              .toFixed(2)
              .toString()
              .replace(/[0-9]$/, "")
          )
          return (
            new Intl.NumberFormat(currency.locale, {
              //  @ts-ignore
              style: currency.style,
              currency: currency.currency,
              minimumFractionDigits,
            }).format(K) + "K"
          )
        default:
          return new Intl.NumberFormat(currency.locale, {
            //  @ts-ignore
            style: currency.style,
            currency: currency.currency,
            minimumFractionDigits,
          }).format(number)
      }
    } else {
      return new Intl.NumberFormat(currency.locale, {
        //  @ts-ignore
        style: currency.style,
        currency: currency.currency,
        minimumFractionDigits,
      }).format(number)
    }
  } else {
    return new Intl.NumberFormat(currency.locale, {
      //  @ts-ignore
      style: currency.style,
      currency: currency.currency,
      minimumFractionDigits,
    }).format(0)
  }
}

export const formatCurrency = (value: string) => {
  if (!value) return ""

  let str = ""
  value
    ?.toString()
    .split("")
    .forEach((item) => {
      if (!str.includes(".") || item !== ".") {
        str = str + item
      }
    })

  const user_input = str
    ?.replace(/[^0-9\s.]/g, "")
    ?.replace(/(?!^)\.(?=.*\.)/g, "")
    ?.split(".")

  user_input[0] = user_input[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  const val = user_input.length ? user_input.join(".") : "0"

  return val
}
