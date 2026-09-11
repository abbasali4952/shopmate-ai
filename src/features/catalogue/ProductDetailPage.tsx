import { Link, useNavigate, useParams } from 'react-router-dom'
import { productById } from '../../data/products'
import { formatMoney } from '../../lib/invoice'
import { useCart } from '../cart/CartProvider'

export function ProductDetailPage() {
  const { productId } = useParams()
  const product = productId ? productById.get(productId) : undefined
  const { addItem } = useCart()
  const navigate = useNavigate()

  if (!product) return <main className="page empty-state"><h1>Piece not found</h1><Link className="button button--dark" to="/">Return to catalogue</Link></main>

  const addToCart = () => { addItem(product); navigate('/cart') }
  return (
    <main className="page product-detail">
      <Link className="quiet-link" to="/">← Back to catalogue</Link>
      <div className="product-detail__layout">
        <div className="product-detail__image"><img src={product.imageUrl} alt={product.name} /></div>
        <div className="product-detail__content"><p className="eyebrow">{product.category} / {product.gender}</p><h1>{product.name}</h1><p className="product-detail__price">{formatMoney(product.priceCents)}</p><p className="product-detail__description">{product.description}</p><dl className="product-specs"><div><dt>Material</dt><dd>{product.material}</dd></div><div><dt>Sizes</dt><dd>{product.availableSizes.join(', ')}</dd></div></dl><button className="button button--dark" type="button" onClick={addToCart}>Add to cart</button></div>
      </div>
    </main>
  )
}
