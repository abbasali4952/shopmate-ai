import { describe, expect, it } from 'vitest'
import { products } from '../../src/data/products'
import { filterProducts, uniqueMaterials } from '../../src/lib/catalogueFilters'

describe('catalogue filters', () => {
  it('filters by category', () => {
    const filtered = filterProducts(products, { category: 'Jeans' })
    expect(filtered).toHaveLength(5)
    expect(filtered.every((product) => product.category === 'Jeans')).toBe(true)
  })

  it('filters by gender, size, and material with AND semantics', () => {
    const filtered = filterProducts(products, { category: 'T-Shirts', gender: 'Women', size: 'M', material: 'Cotton jersey' })
    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe('tshirt-cobalt-boxy')
  })

  it('returns the full catalogue when filters are cleared', () => {
    expect(filterProducts(products, {})).toHaveLength(products.length)
    expect(uniqueMaterials(products)).toContain('Linen')
  })
})
