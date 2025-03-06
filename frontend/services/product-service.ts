import apiClient from "@/lib/api-client"
import type { Product, ProductFilters, ProductResponse, ProductsResponse } from "@/types/api"

export const ProductService = {
  // Get products with filtering, pagination, and sorting
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const { data } = await apiClient.get("/products", { params: filters })
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

