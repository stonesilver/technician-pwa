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
