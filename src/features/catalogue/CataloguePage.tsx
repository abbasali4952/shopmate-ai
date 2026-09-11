import { useState } from 'react'
import { PRODUCT_CATEGORIES } from '../../types/product'
import { products } from '../../data/products'
import { filterProducts, uniqueMaterials, type CatalogueFilters } from '../../lib/catalogueFilters'
import { FilterControls } from './FilterControls'
import { ProductCard } from './ProductCard'

export function CataloguePage() {
  const [filters, setFilters] = useState<CatalogueFilters>({})
  const filteredProducts = filterProducts(products, filters)

  return (
    <main className="page catalogue-page">
      <section className="catalogue-hero">
        <div><p className="eyebrow">The current edit / 25 pieces</p><h1>Clothes with a point of view.</h1><p>Five considered categories, easy filters, and a shopping assistant for the moment when you know the feeling but not the name.</p></div>
        <div className="category-stamp" aria-label="Five product categories"><strong>05</strong><span>curated<br />categories</span></div>
      </section>
      <FilterControls filters={filters} materials={uniqueMaterials(products)} onChange={setFilters} />
      <p className="result-count">Showing {filteredProducts.length} of {products.length} pieces</p>
      {filteredProducts.length === 0 ? (
        <section className="empty-state empty-state--catalogue"><h2>No pieces match that combination.</h2><button className="button button--dark" type="button" onClick={() => setFilters({})}>Reset filters</button></section>
      ) : (
        <div className="category-sections">
          {PRODUCT_CATEGORIES.map((category) => {
            const categoryProducts = filteredProducts.filter((product) => product.category === category)
            if (categoryProducts.length === 0) return null
            return <section className="category-section" key={category}><div className="section-heading"><h2>{category}</h2><span>{categoryProducts.length} pieces</span></div><div className="product-grid">{categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
          })}
        </div>
      )}
    </main>
  )
}
