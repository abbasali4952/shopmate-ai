import type { Gender, Product, ProductCategory, Size } from '../types/product'

export interface CatalogueFilters {
  category?: ProductCategory
  gender?: Gender
  size?: Size
  material?: string
}

export const filterProducts = (catalogue: Product[], filters: CatalogueFilters): Product[] => catalogue.filter((product) => {
  const matchesCategory = !filters.category || product.category === filters.category
  const matchesGender = !filters.gender || product.gender === filters.gender
  const matchesSize = !filters.size || product.availableSizes.includes(filters.size)
  const matchesMaterial = !filters.material || product.material === filters.material
  return matchesCategory && matchesGender && matchesSize && matchesMaterial
})

export const uniqueMaterials = (catalogue: Product[]): string[] => Array.from(new Set(catalogue.map((product) => product.material))).sort()
