import ProductGrid from "../components/products/ProductGrid";
import ProductsFilter from "../components/products/ProductsFilter";
import type { ProductFilters, ProductsResponse } from "../types/api";
import { useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { ProductService } from "../services/product-service";

export default function ProductsPage() {
  // Parse search params into filters
  const [searchParams, ] = useSearchParams();
  const [data, setData] = useState<ProductsResponse>();

  const filters: ProductFilters = useMemo(
    () => ({
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      sizes: searchParams.get("sizes") || undefined,
      colors: searchParams.get("colors") || undefined,
      sortBy:
        (searchParams.get("sortBy") as "price" | "createdAt" | "popular") ||
        "createdAt",
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page") || "24", 10)
        : 1,
      limit: 24,
      minPrice: searchParams.get("minPrice")
        ? Number.parseInt(searchParams.get("minPrice") as string, 10)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number.parseInt(searchParams.get("maxPrice") as string, 10)
        : undefined,
    }),
    [searchParams]
  ); // Dependencies: change only when searchParams change

  useEffect(() => {
    const getProducts = async () => {
      const data = await ProductService.getProducts(filters);
      console.log(data);
      setData(data);
    };
    getProducts();
  }, [filters]); // Now `filters` updates only when `searchParams` change

  return (
    <main className="container py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground">
            Browse our collection of stylish clothing
          </p>
        </div>
      </div>


      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        <ProductsFilter initialFilters={filters} />

        <div className="md:col-span-3">
          {data && <ProductGrid products={data.products} total={data.total} />}
        </div>
      </div>
    </main>
  );
}
