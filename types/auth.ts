export type UserContext = {
  id: string
  app_mode: "live" | "test"
  first_name: string
  last_name: string
  username: string
  email: string
  phone_number: string
  tx_pin: string
  user_type: "technician"
  business_id: string
  role: "admin"
  face_image: null
  active: boolean
}

export type TechnicianContext = {
  id: string
  category: string
  specialty: string
  first_name: string
  last_name: string
  phone_number: string
  email: string
  business_name: string
  country: string
  state: string
  address: null | string
  gender: "Male" | "Female"
  date_of_birth: string
  active: boolean
  has_changed_password: boolean
  logo_url: null | string
  total_estimates: string
  total_earnings: string
}
