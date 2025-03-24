import * as yup from "yup"
import { toTypedSchema } from "@vee-validate/yup"

export const LoginYupSchema = yup.object({
  phone_number: yup.string().required("Enter your phone number"),
  // .test("validate-phone-number", "Enter a valid phone number", (value) => {
  //   return /^(0[789][01]\d{8})$/.test(value)
  // }),
  password: yup.string().required("Enter your password"),
  domain: yup.string().optional().default("technician"),
})

export const ProvideEstimateSchema = yup.object({
  amount: yup
    .string()
    .required("This a required field")
    .test("must be greater than 0", "Must be greater than 0", (value) => {
      return parseFloat(value) > 0
    }),
  workmanship: yup
    .string()
    .required("This a required field")
    .test("must be greater than 0", "Must be greater than 0", (value) => {
      return parseFloat(value) > 0
    }),
})

export const LoginSchema = toTypedSchema(LoginYupSchema)
export type LoginPayload = yup.InferType<typeof LoginYupSchema>
export type ProvideEstimateSchemaContext = yup.InferType<typeof ProvideEstimateSchema>
