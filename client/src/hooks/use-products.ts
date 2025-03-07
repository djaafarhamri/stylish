import useSWR from "swr"
import { ProductService } from "@/services/product-service"
import type { ProductFilters } from "@/types/api"

// Helper function to create a cache key from filters
const createProductsKey = (filters: ProductFilters = {}) => {
  return ["products", JSON.stringify(filters)]
}

export function useProducts(filters: ProductFilters = {}) {
  const { data, error, isLoading, mutate } = useSWR(createProductsKey(filters), () =>
    ProductService.getProducts(filters),
  )

  return {
    products: data?.products || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useProduct(id: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(id ? `product-${id}` : null, () =>
    id ? ProductService.getProductById(id) : null,
  )

  return {
    product: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useProductSearch(query: string, filters: Omit<ProductFilters, "search"> = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    query ? ["product-search", query, JSON.stringify(filters)] : null,
    () => (query ? ProductService.searchProducts(query, filters) : null),
  )

  return {
    products: data?.products || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  }
}

