import { describe, expect, it } from 'vitest'
import { knowledgeBase, parseKnowledgeBase } from '../../src/data/knowledgeBase'

describe('static knowledge base', () => {
  it('parses representative store sections from kb.md', () => {
    expect(knowledgeBase.map((section) => section.id)).toEqual([
      'discounts',
      'end-of-season-sale',
      'return-policy',
      'shipping',
      'frequently-asked-questions',
    ])
    expect(knowledgeBase.find((section) => section.id === 'discounts')?.body).toMatch(/No general discount/i)
  })

  it('does not create a section for a markdown file without ## headings', () => {
    expect(parseKnowledgeBase('# Title\n\nNo sections')).toEqual([])
  })
})
