import { Link } from 'react-router-dom'
import { formatMoney } from '../../lib/invoice'
import { CartLineItem } from './CartLineItem'
import { useCart } from './CartProvider'

export function CartPage() {
  const { items, subtotalCents, totalCents, updateQuantity, removeItem } = useCart()

  return (
    <main className="page cart-page">
      <div className="page-heading">
        <div><p className="eyebrow">Your edit</p><h1>Cart & invoice</h1></div>
        <Link className="quiet-link" to="/">Continue shopping</Link>
      </div>
      {items.length === 0 ? (
        <section className="empty-state"><p className="eyebrow">Nothing here yet</p><h2>Your cart is waiting for a good find.</h2><Link className="button button--dark" to="/">Browse the catalogue</Link></section>
      ) : (
        <div className="cart-layout">
          <section className="cart-lines" aria-label="Selected products">
            {items.map((item) => <CartLineItem key={item.productId} item={item} onQuantityChange={(quantity) => updateQuantity(item.productId, quantity)} onRemove={() => removeItem(item.productId)} />)}
          </section>
          <aside className="invoice-panel" aria-label="Invoice summary">
            <p className="eyebrow">Invoice summary</p>
            <div className="invoice-row"><span>Selected products</span><strong>{items.reduce((count, item) => count + item.quantity, 0)}</strong></div>
            <div className="invoice-row"><span>Subtotal</span><strong>{formatMoney(subtotalCents)}</strong></div>
            <div className="invoice-row invoice-row--total"><span>Total</span><strong>{formatMoney(totalCents)}</strong></div>
            <p className="invoice-note">Payment is not part of this proof of concept.</p>
          </aside>
        </div>
      )}
    </main>
  )
}
