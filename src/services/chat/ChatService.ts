import type { ChatMessage } from '../../types/chat'
import type { KnowledgeBaseSection } from '../../types/knowledgeBase'
import type { Gender, Product, ProductCategory, Size } from '../../types/product'

export interface ProductCriteria {
  category?: ProductCategory
  gender?: Gender
  size?: Size
  material?: string
}

export interface ChatServiceRequest {
  message: string
  history: ChatMessage[]
  catalogue: Product[]
  knowledgeBase: KnowledgeBaseSection[]
  currentCriteria?: ProductCriteria
}

export type ChatReplyKind = 'clarification' | 'product-results' | 'store-answer' | 'unavailable' | 'error'

export interface ChatServiceReply {
  kind: ChatReplyKind
  text: string
  requestedCriteria?: (keyof ProductCriteria)[]
  normalizedCriteria?: ProductCriteria
  candidateProductIds?: string[]
  knowledgeBaseSectionIds?: string[]
  errorCode?: 'service-unavailable' | 'invalid-reply' | 'provider-error'
}

export interface ChatService {
  sendMessage(request: ChatServiceRequest): Promise<ChatServiceReply>
}
