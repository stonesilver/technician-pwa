export type ClaimEstimateRequestContext = {
  id: string
  damages: {
    far_range: string
    close_range: string
    damage_area: string
    damage_part: string
  }[]
  policy: {
    meta: {
      mca_payload: Record<string, any>
    }
  }
  product: { route_name: string }
}
export type EstimateRequestContext = {
  is_window_closed: boolean
  i_can_submit: boolean
  claim: ClaimEstimateRequestContext
}

export type DamageEstimateContext = {
  far_range: string
  close_range: string
  damage_area: string
  damage_part: string
  damage_part_cost: string
  service_charge: string
  type: "Replacement" | "Fix" | ""
  index: number
}

export type OpenEstimateContext = {
  claim_id: string
  vehicle_details: Record<string, string>
  submission_limit: number
  estimate_provided: number
  product_route_name: string
}

export type PendingEstimateListContext = { id: string; description: string; limit: number; provided: number }

export type SubmittedEstimateContext = {
  total_results: 1
  estimates: {
    id: string
    is_technician_paid: boolean
    amount_paid_to_technician: string
    created_at: string
    total_damaged_parts: number
    claim: { id: string; policy: { meta: { mca_payload: Record<string, string> } }; product: { route_name: string } }
  }[]
}

export type OneSubmittedEstimateContext = {
  id: string
  is_technician_paid: boolean
  amount_paid_to_technician: string
  total_estimate_cost: string
  created_at: string
  total_damaged_parts: number
  damage_estimates: {
    type: "Replacement" | "Fix"
    far_range: string
    close_range: string
    damage_area: string
    damage_part: string
    service_charge: number
    damage_part_cost: number
  }[]
  claim: { id: string; policy: { meta: { mca_payload: Record<string, string> } }; product: { route_name: string } }
}

export type EstimatesStats = {
  total_number_submitted: number
  total_number_paid: number
  total_number_pending: number
  total_amount_paid: number
  total_expected_earning: number
  total_balance_owed: number
}
