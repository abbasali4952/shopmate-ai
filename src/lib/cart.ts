import type { CartLine } from '../types/cart'
import type { Product } from '../types/product'

export const addCartItem = (items: CartLine[], product: Product, quantity = 1): CartLine[] => {
  const existing = items.find((item) => item.productId === product.id)
  if (existing) return items.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item)
  return [...items, { productId: product.id, product, quantity, unitPriceCents: product.priceCents }]
}

export const updateCartQuantity = (items: CartLine[], productId: string, quantity: number): CartLine[] => {
  if (quantity <= 0) return items.filter((item) => item.productId !== productId)
  return items.map((item) => item.productId === productId ? { ...item, quantity } : item)
}

export const removeCartItem = (items: CartLine[], productId: string): CartLine[] => items.filter((item) => item.productId !== productId)
