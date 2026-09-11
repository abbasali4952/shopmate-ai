import { PRODUCT_CATEGORIES, SIZES, type Product } from '../types/product'

export const catalogueValidationErrors = (catalogue: Product[]): string[] => {
  const errors: string[] = []
  const categoryCounts = new Map(PRODUCT_CATEGORIES.map((category) => [category, 0]))
  const productIds = new Set<string>()

  for (const product of catalogue) {
    if (productIds.has(product.id)) errors.push(`Duplicate product id: ${product.id}`)
    productIds.add(product.id)
    categoryCounts.set(product.category, (categoryCounts.get(product.category) ?? 0) + 1)
    if (!product.name.trim()) errors.push(`Product ${product.id} has no name`)
    if (!Number.isInteger(product.priceCents) || product.priceCents <= 0) errors.push(`Product ${product.id} has an invalid price`)
    if (!product.description.trim()) errors.push(`Product ${product.id} has no description`)
    if (!product.material.trim()) errors.push(`Product ${product.id} has no material`)
    if (!/^https:\/\//.test(product.imageUrl)) errors.push(`Product ${product.id} has a non-public image URL`)
    if (product.availableSizes.length === 0 || product.availableSizes.some((size) => !SIZES.includes(size))) errors.push(`Product ${product.id} has invalid sizes`)
  }

  for (const category of PRODUCT_CATEGORIES) {
    const count = categoryCounts.get(category) ?? 0
    if (count < 5 || count > 10) errors.push(`${category} has ${count} products; expected 5-10`)
  }
  if (catalogue.length < 25) errors.push(`Catalogue has ${catalogue.length} products; expected at least 25`)
  return errors
}

export const validateCatalogue = (catalogue: Product[]): Product[] => {
  const errors = catalogueValidationErrors(catalogue)
  if (errors.length > 0) throw new Error(`Invalid product catalogue:\n${errors.join('\n')}`)
  return catalogue
}
