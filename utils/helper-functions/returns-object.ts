import type { VehicleDetails } from "~/types"

const objectOrder = ["vehicle_category", "vehicle_color", "vehicle_make", "vehicle_model", "year_of_manufacture"]

const products: Record<string, string[]> = {
  "aiico-comprehensive": objectOrder,
  "mcg-mini-comprehensive": ["vehicle_type", "vehicle_color", "vehicle_make", "vehicle_model", "vehicle_year_manufactured"],
  "sti-monthly-comprehensive": ["vehicle_type", "vehicle_color", "vehicle_make", "vehicle_model", "vehicle_year_manufactured"],
}

export const unifyVehicleDetails = (payload: Record<string, string>, routeName: string) => {
  const vehicleDetails: Record<string, string> = {}

  const array = products[routeName] ?? products["sti-monthly-comprehensive"]
  for (let index = 0; index < array.length; index++) {
    vehicleDetails[objectOrder[index]] = payload[array[index]]
  }

  return vehicleDetails as VehicleDetails
}
