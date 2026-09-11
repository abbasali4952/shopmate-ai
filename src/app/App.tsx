import { BrowserRouter, Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ChatWidget } from '../components/chat/ChatWidget'
import { StoreRoutes } from './routes'
import { CartProvider, useCart } from '../features/cart/CartProvider'
import { products, productById } from '../data/products'
import { knowledgeBase } from '../data/knowledgeBase'
import { FakeChatService } from '../services/chat/FakeChatService'
import { GeminiChatService } from '../services/chat/GeminiChatService'
import { createChatResponder } from '../features/chat/chatController'
import type { ChatResponder } from '../types/chat'

function StoreLayout() {
  const { itemCount } = useCart()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [chatResponder] = useState<ChatResponder>(() => {
    const service = import.meta.env.VITE_GOOGLE_API_KEY ? new GeminiChatService() : new FakeChatService()
    return createChatResponder({ service, catalogue: products, knowledgeBase })
  })

  return (
    <div className="store-app">
      <header className="store-header">
        <Link className="brand" to="/"><span className="brand__mark">S</span><span>Shopmate <em>AI</em></span></Link>
        <nav aria-label="Main navigation"><NavLink to="/">Catalogue</NavLink><NavLink to="/cart">Cart <span className="cart-count">{itemCount}</span></NavLink></nav>
      </header>
      <StoreRoutes />
      <ChatWidget responder={chatResponder} onAddToCart={(productId) => { const product = productById.get(productId); if (product) { addItem(product); navigate('/cart') } }} />
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <CartProvider><StoreLayout /></CartProvider>
    </BrowserRouter>
  )
}
