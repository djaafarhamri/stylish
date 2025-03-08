import apiClient from "../lib/apiClient"
import type { FiltersResponse, ProductFilters, ProductResponse, ProductsResponse } from "../types/api"

export const ProductService = {
  // Get products with filtering, pagination, and sorting
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const { data } = await apiClient.get("/products", { params: filters })
    return data
  },

  async getFeaturedProducts(): Promise<ProductsResponse> {
    const { data } = await apiClient.get("/products/featured")
    return data
  },

  async getFilters(): Promise<FiltersResponse> {
    const { data } = await apiClient.get("/products/filters")
    return data
  },

  // Get a single product by ID
  async getProductById(id: string): Promise<ProductResponse> {
    const { data } = await apiClient.get(`/products/${id}`)
    return data
  },

  // Get products by category
  async getProductsByCategory(
    category: string,
    filters: Omit<ProductFilters, "category"> = {},
  ): Promise<ProductsResponse> {
    return this.getProducts({ ...filters, category })
  },

  // Search products
  async searchProducts(query: string, filters: Omit<ProductFilters, "search"> = {}): Promise<ProductsResponse> {
    return this.getProducts({ ...filters, search: query })
  },
}

