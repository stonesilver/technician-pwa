export type Transaction = {
  id: string
  reference_id: string
  account_withdrawn_to: null | { bank_name: string; account_name: string; account_number: string }
  type: "in" | "out"
  source: string
  status: "success" | "Failed"
  amount: string
  balance_before_transaction: string
  balance_after_transaction: string
  created_at: string
}

export type WalletTransactions = {
  total_count: number
  transactions: Transaction[]
}

export type BankAccountContext = {
  id: string
  account_name: string
  account_number: string
  account_type: "Personal"
  bank_code: string
  bank_name: string
  isDefault: boolean
}
