import { CartItem, Discount, Transaction } from '../../types'

export const POS_STORAGE_KEY = 'pos-frontend-state-v1'

export interface PersistedPOSSnapshot {
  cart: CartItem[]
  appliedDiscount: Discount | null
  transactions: Transaction[]
  currentReceipt: Transaction | null
}

const toHydratedTransaction = (transaction: Transaction): Transaction => ({
  ...transaction,
  timestamp: new Date(transaction.timestamp),
})

export const loadPersistedSnapshot = (): PersistedPOSSnapshot | null => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  try {
    const raw = window.localStorage.getItem(POS_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<PersistedPOSSnapshot>

    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      appliedDiscount: parsed.appliedDiscount ?? null,
      transactions: Array.isArray(parsed.transactions)
        ? parsed.transactions.map((transaction) => toHydratedTransaction(transaction))
        : [],
      currentReceipt: parsed.currentReceipt ? toHydratedTransaction(parsed.currentReceipt) : null,
    }
  } catch {
    return null
  }
}

export const savePersistedSnapshot = (snapshot: PersistedPOSSnapshot) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return
  }

  try {
    window.localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // Ignore storage errors to keep checkout flows working.
  }
}
