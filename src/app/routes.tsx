import { Route, Routes } from 'react-router-dom'
import { CataloguePage } from '../features/catalogue/CataloguePage'
import { ProductDetailPage } from '../features/catalogue/ProductDetailPage'
import { CartPage } from '../features/cart/CartPage'

export function StoreRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CataloguePage />} />
      <Route path="/product/:productId" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="*" element={<CataloguePage />} />
    </Routes>
  )
}
