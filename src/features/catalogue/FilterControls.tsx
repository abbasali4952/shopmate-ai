import { GENDERS, PRODUCT_CATEGORIES, SIZES, type Gender, type ProductCategory, type Size } from '../../types/product'
import type { CatalogueFilters } from '../../lib/catalogueFilters'

interface FilterControlsProps {
  filters: CatalogueFilters
  materials: string[]
  onChange: (filters: CatalogueFilters) => void
}

export function FilterControls({ filters, materials, onChange }: FilterControlsProps) {
  return (
    <div className="filter-bar" aria-label="Catalogue filters">
      <label>Category<select value={filters.category ?? ''} onChange={(event) => onChange({ ...filters, category: (event.target.value || undefined) as ProductCategory | undefined })}><option value="">All categories</option>{PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
      <label>Gender<select value={filters.gender ?? ''} onChange={(event) => onChange({ ...filters, gender: (event.target.value || undefined) as Gender | undefined })}><option value="">All genders</option>{GENDERS.map((gender) => <option key={gender} value={gender}>{gender}</option>)}</select></label>
      <label>Size<select value={filters.size ?? ''} onChange={(event) => onChange({ ...filters, size: (event.target.value || undefined) as Size | undefined })}><option value="">All sizes</option>{SIZES.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
      <label>Material<select value={filters.material ?? ''} onChange={(event) => onChange({ ...filters, material: event.target.value || undefined })}><option value="">All materials</option>{materials.map((material) => <option key={material} value={material}>{material}</option>)}</select></label>
      <button className="text-button filter-bar__clear" type="button" onClick={() => onChange({})}>Clear filters</button>
    </div>
  )
}
