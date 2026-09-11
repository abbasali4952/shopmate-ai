import { describe, expect, it } from 'vitest'
import { sanitizeChatReply } from '../../src/lib/chatValidation'
import { products } from '../../src/data/products'
import { knowledgeBase } from '../../src/data/knowledgeBase'

describe('chat reply validation', () => {
  it('keeps only catalogue product IDs and known KB sections', () => {
    const reply = sanitizeChatReply({ kind: 'product-results', text: 'Matches', candidateProductIds: [products[0].id, products[0].id, 'invented-product'], knowledgeBaseSectionIds: ['discounts', 'made-up'] }, products, knowledgeBase)
    expect(reply.candidateProductIds).toEqual([products[0].id])
    expect(reply.knowledgeBaseSectionIds).toEqual(['discounts'])
  })
})
