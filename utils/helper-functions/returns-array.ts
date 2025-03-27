import type { SubmittedEstimateContext } from "~/types/estimates"
import { numberToCurrency } from "./returns-string.ts"
import { unifyVehicleDetails } from "./returns-object.js"

export const formatSubmittedEstimate = (estimates: SubmittedEstimateContext["estimates"] | undefined) => {
  if (Array.isArray(estimates)) {
    return estimates.map((subEst) => {
      const vehicle = unifyVehicleDetails(subEst.claim.policy.meta.mca_payload, subEst.claim.product.route_name)
      return {
        columnOne: {
          label: `${vehicle.vehicle_make} ${vehicle.vehicle_model} ${vehicle.year_of_manufacture}`,
          value: `${subEst.total_damaged_parts} Damage parts`,
        },
        columnTwo: {
          label: numberToCurrency(subEst.amount_paid_to_technician),
          value: Dayjs(subEst.created_at).format("Do MMMM YYYY"),
          labelClass: subEst.is_technician_paid ? "text-mca" : "text-warning-500",
        },
        id: subEst.id,
        badge: {
          label: subEst.is_technician_paid ? "Paid" : "Pending",
          variant: subEst.is_technician_paid ? ("success" as const) : ("info" as const),
        },
      }
    })
  } else {
    return []
  }
}
