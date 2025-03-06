import { Suspense } from "react"
import { ProductService } from "@/services/product-service"
import ProductGrid from "@/components/product-grid"
import ProductsFilter from "@/components/products-filter"
import ProductsSearch from "@/components/products-search"
import type { ProductFilters } from "@/types/api"

// Server Component for fetching products
async function ProductsList({ filters }: { filters: ProductFilters }) {
  // This runs on the server
  const productsData = await ProductService.getProducts(filters)

  return <ProductGrid products={productsData.products} total={productsData.total} />
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse search params into filters
  const filters: ProductFilters = {
    category: searchParams.category as string,
    search: searchParams.search as string,
    sortBy: (searchParams.sortBy as "price" | "createdAt" | "popular") || "createdAt",
    page: searchParams.page ? Number.parseInt(searchParams.page as string, 10) : 1,
    limit: 24,
  }

  if (searchParams.minPrice) {
    filters.minPrice = Number.parseInt(searchParams.minPrice as string, 10)
  }

  if (searchParams.maxPrice) {
    filters.maxPrice = Number.parseInt(searchParams.maxPrice as string, 10)
  }

  return (
    <main className="container py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground">Browse our collection of stylish clothing</p>
        </div>
      </div>

      <ProductsSearch initialQuery={filters.search} />

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        <ProductsFilter initialFilters={filters} />

        <div className="md:col-span-3">
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsList filters={filters} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

