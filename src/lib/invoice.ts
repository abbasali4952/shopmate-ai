import type { CartLine, CartTotals } from '../types/cart'

export const getCartTotals = (items: CartLine[]): CartTotals => {
  const subtotalCents = items.reduce((total, item) => total + item.quantity * item.unitPriceCents, 0)
  return { subtotalCents, totalCents: subtotalCents }
}

export const formatMoney = (cents: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
