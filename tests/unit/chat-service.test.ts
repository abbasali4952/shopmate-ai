import { describe, expect, it } from 'vitest'
import { products } from '../../src/data/products'
import { knowledgeBase } from '../../src/data/knowledgeBase'
import { createChatResponder } from '../../src/features/chat/chatController'
import { FakeChatService } from '../../src/services/chat/FakeChatService'
import { parseReply } from '../../src/services/chat/GeminiChatService'

describe('ChatService behavior', () => {
  const service = new FakeChatService()

  it('asks for missing selection information, then returns catalogue products', async () => {
    const first = await service.sendMessage({ message: 'I want to buy jeans', history: [], catalogue: products, knowledgeBase })
    expect(first.kind).toBe('clarification')
    expect(first.requestedCriteria).toContain('gender')

    const responder = createChatResponder({ service, catalogue: products, knowledgeBase })
    const reply = await responder('Women M Denim', [{ id: 'one', speaker: 'customer', text: 'I want to buy jeans', timestamp: 1 }])
    expect(typeof reply).toBe('object')
    if (typeof reply === 'object') {
      expect(reply.kind).toBe('product-results')
      expect(reply.products?.every((product) => product.category === 'Jeans')).toBe(true)
      expect(reply.products?.[0].imageUrl).toMatch(/^https:\/\//)
    }
  })

  it('grounds covered store queries and refuses unknown store facts', async () => {
    const responder = createChatResponder({ service, catalogue: products, knowledgeBase })
    const covered = await responder('Is there any discount available?', [])
    const uncovered = await responder('Do you accept Bitcoin?', [])
    expect(typeof covered).toBe('object')
    expect(typeof uncovered).toBe('object')
    if (typeof covered === 'object') expect(covered.knowledgeBaseSections?.[0].id).toBe('discounts')
    if (typeof uncovered === 'object') expect(uncovered.kind).toBe('unavailable')
  })

  it('parses final text while ignoring LangChain thinking parts', () => {
    expect(parseReply([
      { type: 'thinking', thinking: 'internal reasoning' },
      { type: 'text', text: '{"kind":"clarification","text":"What size do you need?"}' },
    ])).toEqual({ kind: 'clarification', text: 'What size do you need?' })
  })
})
