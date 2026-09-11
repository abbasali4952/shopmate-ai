import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { products } from '../../src/data/products'
import { ProductDetailPage } from '../../src/features/catalogue/ProductDetailPage'
import { CartProvider } from '../../src/features/cart/CartProvider'

describe('product details', () => {
  it('renders product information and the canonical image', () => {
    const product = products[0]
    render(<MemoryRouter initialEntries={[`/product/${product.id}`]}><CartProvider><Routes><Route path="/product/:productId" element={<ProductDetailPage />} /></Routes></CartProvider></MemoryRouter>)
    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument()
    expect(screen.getByText(product.description)).toBeInTheDocument()
    expect(screen.getByText(product.material)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: product.name })).toHaveAttribute('src', product.imageUrl)
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument()
  })
})
