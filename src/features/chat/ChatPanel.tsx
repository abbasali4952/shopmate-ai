import { FormEvent, useState } from 'react'
import type { ChatMessage, ChatResponder } from '../../types/chat'
import { ChatResult } from './ChatResult'
import { createMessage, createInitialChatState } from './chatState'

interface ChatPanelProps {
  onClose: () => void
  responder?: ChatResponder
  onAddToCart?: (productId: string) => void
}

export function ChatPanel({ onClose, responder, onAddToCart }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => createInitialChatState().messages)
  const [isPending, setIsPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const messageText = draft.trim()
    if (!messageText || isPending) return

    const customerMessage = createMessage('customer', messageText)
    const nextMessages = [...messages, customerMessage]
    setMessages(nextMessages)
    setDraft('')
    setErrorMessage(null)
    setIsPending(true)

    try {
      const reply = await (responder ?? (async () => 'The shopping assistant is getting ready.'))(
        messageText,
        nextMessages,
      )
      const assistantMessage = typeof reply === 'string' ? createMessage('assistant', reply) : { ...createMessage('assistant', reply.text), reply }
      setMessages((currentMessages) => [...currentMessages, assistantMessage])
    } catch {
      setErrorMessage('The assistant is unavailable right now. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <section className="chat-panel" aria-label="Shopmate AI shopping assistant">
      <header className="chat-panel__header">
        <div>
          <p className="eyebrow">Shopmate AI</p>
          <h2>Shopping assistant</h2>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close shopping assistant">
          <span aria-hidden="true">×</span>
        </button>
      </header>

      <div className="chat-panel__messages" aria-live="polite">
        {messages.map((message) => (
          <article className={`chat-message chat-message--${message.speaker}`} key={message.id}>
            <span className="chat-message__speaker">{message.speaker === 'assistant' ? 'Assistant' : 'You'}</span>
            <p>{message.text}</p>
            {message.reply?.products?.length ? <ChatResult products={message.reply.products} onAddToCart={onAddToCart} /> : null}
            {message.reply?.knowledgeBaseSections?.map((section) => <p className="chat-source" key={section.id}><strong>{section.heading}</strong>{section.body}</p>)}
          </article>
        ))}
        {isPending && <p className="chat-panel__status">Assistant is thinking...</p>}
        {errorMessage && <p className="chat-panel__error" role="alert">{errorMessage}</p>}
      </div>

      <form className="chat-panel__form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="chat-message">Message the shopping assistant</label>
        <input
          id="chat-message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about a style..."
          autoComplete="off"
          disabled={isPending}
        />
        <button type="submit" disabled={isPending || !draft.trim()}>
          Send
        </button>
      </form>
    </section>
  )
}
