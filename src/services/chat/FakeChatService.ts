import { filterProducts } from '../../lib/catalogueFilters'
import type { ChatService, ChatServiceReply, ChatServiceRequest, ProductCriteria } from './ChatService'

const includesAny = (value: string, choices: string[]) => choices.some((choice) => value.includes(choice.toLowerCase()))

const criteriaFromText = (message: string): ProductCriteria => {
  const normalized = message.toLowerCase()
  const criteria: ProductCriteria = {}
  if (includesAny(normalized, ['jean'])) criteria.category = 'Jeans'
  if (includesAny(normalized, ['shirt']) && !includesAny(normalized, ['t-shirt', 'tee'])) criteria.category = 'Shirts'
  if (includesAny(normalized, ['t-shirt', 'tee'])) criteria.category = 'T-Shirts'
  if (includesAny(normalized, ['trouser', 'pants'])) criteria.category = 'Trousers'
  if (includesAny(normalized, ['suit'])) criteria.category = 'Suits'
  if (/\b(women|woman|womens)\b/.test(normalized)) criteria.gender = 'Women'
  else if (/\b(men|man|mens)\b/.test(normalized)) criteria.gender = 'Men'
  if (normalized.includes('unisex')) criteria.gender = 'Unisex'
  for (const size of ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const) if (new RegExp(`\\b${size.toLowerCase()}\\b`).test(normalized)) criteria.size = size
  return criteria
}

export class FakeChatService implements ChatService {
  async sendMessage(request: ChatServiceRequest): Promise<ChatServiceReply> {
    const normalized = request.message.toLowerCase()
    const criteria = { ...criteriaFromText(request.message), ...request.currentCriteria }
    const historyText = request.history.map((message) => message.text).join(' ').toLowerCase()
    const isStoreQuestion = includesAny(normalized, ['discount', 'sale', 'return', 'shipping', 'delivery', 'account', 'pay', 'bitcoin', 'crypto', 'wholesale', 'policy', 'faq'])

    if (isStoreQuestion) {
      const sectionId = normalized.includes('discount') ? 'discounts'
        : normalized.includes('sale') ? 'end-of-season-sale'
          : normalized.includes('return') ? 'return-policy'
            : normalized.includes('shipping') || normalized.includes('delivery') ? 'shipping'
              : 'frequently-asked-questions'
      const section = request.knowledgeBase.find((entry) => entry.id === sectionId)
      if (!section || includesAny(normalized, ['bitcoin', 'crypto', 'wholesale'])) return { kind: 'unavailable', text: 'That information is not available in our store knowledge base.' }
      return { kind: 'store-answer', text: `Here is what our store guide says about ${section.heading.toLowerCase()}:`, knowledgeBaseSectionIds: [section.id] }
    }

    if (!criteria.category && !historyText.includes('jean') && !historyText.includes('shirt') && !historyText.includes('trouser') && !historyText.includes('suit')) {
      return { kind: 'clarification', text: 'What kind of piece are you looking for? I can help with jeans, shirts, T-shirts, trousers, or suits.', requestedCriteria: ['category'] }
    }

    if (!criteria.category) criteria.category = historyText.includes('jean') ? 'Jeans' : undefined
    for (const material of new Set(request.catalogue.map((product) => product.material))) {
      if (normalized.includes(material.toLowerCase())) criteria.material = material
    }
    const requestedCriteria = (['gender', 'size', 'material'] as const).filter((key) => !criteria[key])
    if (requestedCriteria.length > 0) return { kind: 'clarification', text: `To narrow that down, what ${requestedCriteria[0]} would you prefer?`, requestedCriteria, normalizedCriteria: criteria }

    const matches = filterProducts(request.catalogue, criteria)
    if (matches.length === 0) return { kind: 'unavailable', text: 'I could not find a catalogue piece matching all of those details.' }
    return { kind: 'product-results', text: `I found ${matches.length} ${criteria.category?.toLowerCase()} option${matches.length === 1 ? '' : 's'} that fit your details.`, normalizedCriteria: criteria, candidateProductIds: matches.slice(0, 4).map((product) => product.id) }
  }
}
