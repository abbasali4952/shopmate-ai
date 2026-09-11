import { createContext, useContext, useState, type PropsWithChildren } from 'react'
import type { CartLine } from '../../types/cart'
import type { Product } from '../../types/product'
import { addCartItem, removeCartItem, updateCartQuantity } from '../../lib/cart'
import { getCartTotals } from '../../lib/invoice'

interface CartContextValue {
  items: CartLine[]
  itemCount: number
  subtotalCents: number
  totalCents: number
  addItem: (product: Product, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartLine[]>([])
  const totals = getCartTotals(items)
  const value: CartContextValue = {
    items,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    subtotalCents: totals.subtotalCents,
    totalCents: totals.totalCents,
    addItem: (product, quantity = 1) => setItems((current) => addCartItem(current, product, quantity)),
    updateQuantity: (productId, quantity) => setItems((current) => updateCartQuantity(current, productId, quantity)),
    removeItem: (productId) => setItems((current) => removeCartItem(current, productId)),
    clear: () => setItems([]),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
