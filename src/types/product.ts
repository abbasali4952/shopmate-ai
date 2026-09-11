export const PRODUCT_CATEGORIES = ['Jeans', 'Shirts', 'T-Shirts', 'Trousers', 'Suits'] as const
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const GENDERS = ['Men', 'Women', 'Unisex'] as const
export type Gender = (typeof GENDERS)[number]

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export type Size = (typeof SIZES)[number]

export interface Product {
  id: string
  category: ProductCategory
  name: string
  priceCents: number
  gender: Gender
  availableSizes: Size[]
  material: string
  description: string
  imageUrl: string
}
