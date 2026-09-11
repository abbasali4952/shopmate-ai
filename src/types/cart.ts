import type { Product } from './product'

export interface CartLine {
  productId: string
  product: Product
  quantity: number
  unitPriceCents: number
}

export interface CartTotals {
  subtotalCents: number
  totalCents: number
}
