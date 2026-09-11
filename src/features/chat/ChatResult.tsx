import { formatMoney } from '../../lib/invoice'
import type { Product } from '../../types/product'

interface ChatResultProps {
  products: Product[]
  onAddToCart?: (productId: string) => void
}

export function ChatResult({ products, onAddToCart }: ChatResultProps) {
  return (
    <div className="chat-results">
      {products.map((product) => (
        <article className="chat-result" key={product.id}>
          <img src={product.imageUrl} alt={product.name} />
          <div>
            <strong>{product.name}</strong>
            <span>{formatMoney(product.priceCents)}</span>
            <button type="button" onClick={() => onAddToCart?.(product.id)}>Add to cart</button>
          </div>
        </article>
      ))}
    </div>
  )
}
