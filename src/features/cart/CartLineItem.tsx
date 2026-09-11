import { formatMoney } from '../../lib/invoice'
import type { CartLine } from '../../types/cart'

interface CartLineItemProps {
  item: CartLine
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartLineItem({ item, onQuantityChange, onRemove }: CartLineItemProps) {
  return (
    <article className="cart-line">
      <img src={item.product.imageUrl} alt={item.product.name} />
      <div className="cart-line__body">
        <p className="eyebrow">{item.product.category}</p>
        <h3>{item.product.name}</h3>
        <p>{formatMoney(item.unitPriceCents)} each</p>
        <div className="cart-line__controls">
          <label htmlFor={`quantity-${item.productId}`}>Quantity</label>
          <input id={`quantity-${item.productId}`} type="number" min="1" value={item.quantity} onChange={(event) => onQuantityChange(Number(event.target.value))} />
          <button type="button" className="text-button" onClick={onRemove}>Remove</button>
        </div>
      </div>
      <strong className="cart-line__total">{formatMoney(item.unitPriceCents * item.quantity)}</strong>
    </article>
  )
}
