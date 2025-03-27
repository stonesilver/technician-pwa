import type { VehicleDetails } from "~/types"

const objectFields = ["vehicle_category", "vehicle_color", "vehicle_make", "vehicle_model", "year_of_manufacture"]
const variantOne = ["vehicle_type", "vehicle_color", "vehicle_make", "vehicle_model", "vehicle_year_manufactured"]

const products: Record<string, string[]> = {
  "aiico-comprehensive": objectFields,
  "sanlam-comprehensive": objectFields,
  "coronation-comprehensive": objectFields,
  "mcg-mini-comprehensive": variantOne,
  "sti-monthly-comprehensive": variantOne,
  "sti-micro-comprehensive": variantOne,
  "leadway-comprehensive": variantOne,
  "leadway-auto-base": variantOne,
}

export const unifyVehicleDetails = (payload: Record<string, string>, routeName: string) => {
  const vehicleDetails: Record<string, string> = {}

  const array = products[routeName] ?? products["sti-monthly-comprehensive"]
  for (let index = 0; index < array.length; index++) {
    vehicleDetails[objectFields[index]] = payload[array[index]]
  }

  return vehicleDetails as VehicleDetails
}
