import { Link, useNavigate } from 'react-router-dom'
import { formatMoney } from '../../lib/invoice'
import type { Product } from '../../types/product'
import { useCart } from '../cart/CartProvider'

interface ProductCardProps { product: Product }

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const addToCart = () => { addItem(product); navigate('/cart') }

  return (
    <article className="product-card">
      <Link className="product-card__image-link" to={`/product/${product.id}`}><img src={product.imageUrl} alt={product.name} /></Link>
      <div className="product-card__body">
        <div className="product-card__meta"><span>{product.category}</span><span>{formatMoney(product.priceCents)}</span></div>
        <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
        <p>{product.material} / {product.gender}</p>
        <button className="button button--small" type="button" onClick={addToCart}>Add to cart</button>
      </div>
    </article>
  )
}
