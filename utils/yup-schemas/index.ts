import * as yup from "yup"
import { toTypedSchema } from "@vee-validate/yup"

export const LoginYupSchema = yup.object({
  phone_number: yup
    .string()
    .required("Enter your phone number")
    .test("validate-phone-number", "Enter a valid phone number", (value) => {
      return /^(0[789][01]\d{8})$/.test(value)
    }),
  password: yup.string().required("Enter your password"),
  domain: yup.string().optional().default("technician"),
})

export const ForgotPasswordSchema = yup.object({
  phone_number: yup
    .string()
    .required("Enter your whatsapp number")
    .test("validate-phone-number", "Enter a valid phone number", (value) => {
      return /^(0[789][01]\d{8})$/.test(value)
    }),
  username: yup.string().email().required("Enter your e-mail address"),
  domain: yup.string().optional().default("technician"),
})

export const ProvideEstimateSchema = yup.object({
  damage_part_cost: yup
    .string()
    .required("This a required field")
    .test("must be greater than 0", "Must be greater than 0", (value) => {
      return parseFloat(value?.toString()?.replace(/,/g, "")) > 0
    }),
  service_charge: yup
    .string()
    .required("This a required field")
    .test("must be greater than 0", "Must be greater than 0", (value) => {
      return parseFloat(value?.toString()?.replace(/,/g, "")) > 0
    }),
  type: yup.string().oneOf(["Replacement", "Fix"], 'Must be "Replacement" or "Fixing"').required("Type is required"),
})

export const ChangePasswordSchema = yup.object({
  password: yup.string().required("New password is required"),
  new_password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[\W_]/, "Password must contain at least one special character")
    // .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
})

export const UserSchema = yup.object({
  first_name: yup
    .string()
    .matches(/^[A-Za-z]+$/, "First name must contain only letters")
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),

  last_name: yup
    .string()
    .matches(/^[A-Za-z]+$/, "Last name must contain only letters")
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),

  phone_number: yup
    .string()
    .matches(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number")
    .required("Phone number is required"),

  email: yup.string().email("Invalid email address").required("Email is required"),
})

export const AddBankSchema = yup.object().shape({
  account_number: yup
    .string()
    .matches(/^\d+$/, "Account number must be numeric")
    .min(10, "Account number must be at least 10 digits")
    .max(10, "Account number must be at most 10 digits")
    .required("Enter account number"),
  bank_code: yup.string().required("Bank code is required"),
  bank_name: yup.string().required("Select bank"),
  amount: yup
    .string()
    .required("This a required field")
    .test("must be greater than 0", "Must be greater than 0", (value) => {
      return parseFloat(value?.toString()?.replace(/,/g, "")) > 0
    }),
  password: yup.string().required("Enter your password"),
  isDefault: yup.boolean().required("isDefault is required").default(true),
})

export const LoginSchema = toTypedSchema(LoginYupSchema)
export type LoginPayload = yup.InferType<typeof LoginYupSchema>
export type ForgotPasswordPayload = yup.InferType<typeof ForgotPasswordSchema>
export type ProvideEstimateSchemaContext = yup.InferType<typeof ProvideEstimateSchema>
export type ChangePasswordContext = yup.InferType<typeof ChangePasswordSchema>
export type UserSchemaContext = yup.InferType<typeof UserSchema>
export type AddBankContext = yup.InferType<typeof AddBankSchema>
