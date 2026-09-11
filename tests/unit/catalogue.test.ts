import { describe, expect, it } from 'vitest'
import { products } from '../../src/data/products'
import { catalogueValidationErrors, validateCatalogue } from '../../src/lib/catalogueValidation'
import { PRODUCT_CATEGORIES } from '../../src/types/product'

describe('product catalogue', () => {
  it('contains exactly five categories with five products each and at least 25 total', () => {
    expect(products).toHaveLength(25)
    expect(new Set(products.map((product) => product.category))).toEqual(new Set(PRODUCT_CATEGORIES))
    for (const category of PRODUCT_CATEGORIES) expect(products.filter((product) => product.category === category)).toHaveLength(5)
  })

  it('validates every product field and public image URL', () => {
    expect(catalogueValidationErrors(products)).toEqual([])
    expect(validateCatalogue(products)).toHaveLength(25)
    for (const product of products) {
      expect(product.name).not.toBe('')
      expect(product.description).not.toBe('')
      expect(product.imageUrl).toMatch(/^https:\/\//)
    }
  })
})
