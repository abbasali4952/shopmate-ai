export type ChatSpeaker = 'customer' | 'assistant'

import type { Product } from './product'
import type { KnowledgeBaseSection } from './knowledgeBase'

export interface ChatMessage {
  id: string
  speaker: ChatSpeaker
  text: string
  timestamp: number
  reply?: ChatUiReply
}

export interface ChatState {
  messages: ChatMessage[]
  isPending: boolean
  errorMessage: string | null
}

export interface ChatUiReply {
  kind: 'text' | 'clarification' | 'product-results' | 'store-answer' | 'unavailable' | 'error'
  text: string
  products?: Product[]
  knowledgeBaseSections?: KnowledgeBaseSection[]
}

export type ChatResponder = (message: string, history: ChatMessage[]) => Promise<string | ChatUiReply>
