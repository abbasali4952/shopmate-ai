import { describe, expect, it } from 'vitest'
import { products } from '../../src/data/products'
import { addCartItem, removeCartItem, updateCartQuantity } from '../../src/lib/cart'
import { getCartTotals } from '../../src/lib/invoice'

describe('cart and invoice', () => {
  it('deduplicates a product and calculates the invoice from integer cents', () => {
    const first = products[0]
    const second = products[5]
    let items = addCartItem([], first)
    items = addCartItem(items, first, 2)
    items = addCartItem(items, second)
    expect(items).toHaveLength(2)
    expect(items[0].quantity).toBe(3)
    expect(getCartTotals(items)).toEqual({ subtotalCents: first.priceCents * 3 + second.priceCents, totalCents: first.priceCents * 3 + second.priceCents })
  })

  it('updates and removes lines safely', () => {
    const first = products[0]
    const items = addCartItem([], first)
    expect(updateCartQuantity(items, first.id, 4)[0].quantity).toBe(4)
    expect(removeCartItem(items, first.id)).toEqual([])
    expect(updateCartQuantity(items, first.id, 0)).toEqual([])
  })
})
