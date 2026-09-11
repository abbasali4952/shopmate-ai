import type { ChatServiceReply, ProductCriteria } from '../services/chat/ChatService'
import type { KnowledgeBaseSection } from '../types/knowledgeBase'
import type { Product } from '../types/product'

export const validCriteria = (criteria: ProductCriteria | undefined): ProductCriteria | undefined => {
  if (!criteria) return undefined
  return {
    category: criteria.category,
    gender: criteria.gender,
    size: criteria.size,
    material: criteria.material?.trim() || undefined,
  }
}

export const validProductIds = (ids: string[] | undefined, catalogue: Product[]): string[] => {
  const knownIds = new Set(catalogue.map((product) => product.id))
  return Array.from(new Set((ids ?? []).filter((id) => knownIds.has(id))))
}

export const validKnowledgeBaseSections = (ids: string[] | undefined, sections: KnowledgeBaseSection[]): KnowledgeBaseSection[] => {
  const sectionsById = new Map(sections.map((section) => [section.id, section]))
  return Array.from(new Set(ids ?? [])).map((id) => sectionsById.get(id)).filter((section): section is KnowledgeBaseSection => Boolean(section))
}

export const sanitizeChatReply = (reply: ChatServiceReply, catalogue: Product[], sections: KnowledgeBaseSection[]): ChatServiceReply => ({
  ...reply,
  text: reply.text.trim(),
  normalizedCriteria: validCriteria(reply.normalizedCriteria),
  candidateProductIds: validProductIds(reply.candidateProductIds, catalogue),
  knowledgeBaseSectionIds: validKnowledgeBaseSections(reply.knowledgeBaseSectionIds, sections).map((section) => section.id),
})
