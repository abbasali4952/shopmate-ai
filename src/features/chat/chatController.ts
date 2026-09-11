import { filterProducts } from '../../lib/catalogueFilters'
import { sanitizeChatReply, validKnowledgeBaseSections } from '../../lib/chatValidation'
import type { ChatResponder } from '../../types/chat'
import type { KnowledgeBaseSection } from '../../types/knowledgeBase'
import type { Product } from '../../types/product'
import type { ChatService, ProductCriteria } from '../../services/chat/ChatService'

interface ChatControllerOptions {
  service: ChatService
  catalogue: Product[]
  knowledgeBase: KnowledgeBaseSection[]
}

export const createChatResponder = ({ service, catalogue, knowledgeBase }: ChatControllerOptions): ChatResponder => async (message, history) => {
  const reply = sanitizeChatReply(await service.sendMessage({ message, history, catalogue, knowledgeBase }), catalogue, knowledgeBase)
  const criteria = reply.normalizedCriteria as ProductCriteria | undefined
  const candidateProducts = catalogue.filter((product) => reply.candidateProductIds?.includes(product.id))
  const locallyMatchedProducts = criteria ? filterProducts(catalogue, criteria) : candidateProducts
  const products = reply.kind === 'product-results'
    ? (locallyMatchedProducts.length > 0 ? locallyMatchedProducts : candidateProducts).slice(0, 4)
    : []
  const sections = validKnowledgeBaseSections(reply.knowledgeBaseSectionIds, knowledgeBase)

  if (reply.kind === 'product-results' && products.length === 0) return { kind: 'unavailable', text: 'I could not find a matching piece in the catalogue.' }
  if (reply.kind === 'store-answer' && sections.length === 0) return { kind: 'unavailable', text: 'That information is not available in our store knowledge base.' }
  return { kind: reply.kind, text: reply.text, products, knowledgeBaseSections: sections }
}
