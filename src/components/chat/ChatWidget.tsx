import { useState } from 'react'
import type { ChatResponder } from '../../types/chat'
import { ChatPanel } from '../../features/chat/ChatPanel'

interface ChatWidgetProps {
  responder?: ChatResponder
  onAddToCart?: (productId: string) => void
}

export function ChatWidget({ responder, onAddToCart }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside className="chat-widget">
      {isOpen ? (
        <ChatPanel onClose={() => setIsOpen(false)} responder={responder} onAddToCart={onAddToCart} />
      ) : (
        <button className="chat-launcher" type="button" onClick={() => setIsOpen(true)}>
          <span className="chat-launcher__dot" aria-hidden="true" />
          <span>
            <strong>Ask Shopmate</strong>
            <small>Find your next look</small>
          </span>
          <span className="chat-launcher__arrow" aria-hidden="true">↗</span>
        </button>
      )}
    </aside>
  )
}
