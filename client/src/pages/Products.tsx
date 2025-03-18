import ProductGrid from "../components/products/ProductGrid";
import ProductsFilter from "../components/products/ProductsFilter";
import type { ProductFilters, ProductsResponse } from "../types/api";
import { useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { ProductService } from "../services/product-service";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Filter } from "lucide-react";
import { cn } from "../lib/utils";
import ProductsSearch from "../components/products/ProductSearch";

export default function ProductsPage() {
  // Parse search params into filters
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<ProductsResponse>();
  const [isOpen, setIsOpen] = useState(false);

  const filters: ProductFilters = useMemo(
    () => ({
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      sizes: searchParams.get("sizes") || undefined,
      colors: searchParams.get("colors") || undefined,
      sortBy:
        (searchParams.get("sortBy") as "price" | "createdAt" | "popular") ||
        "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "desc" | "asc") || "desc",
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page") || "10", 10)
        : 1,
      limit: 10,
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
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className={cn(
                  "fixed bottom-4 right-4 z-50 shadow-lg md:hidden transition-opacity duration-300 rounded-full w-12 h-12 p-0",
                  "opacity-100"
                )}
              >
                <Filter className="h-5 w-5" />
                <span className="sr-only">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Narrow down your product search with filters
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
                <ProductsFilter
                  initialFilters={filters}
                  hidden={false}
                  closeFilters={() => {
                    setIsOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
          <ProductsSearch initialQuery={filters.search} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        <ProductsFilter
          initialFilters={filters}
          hidden={true}
          closeFilters={() => {}}
        />

        <div className="md:col-span-3">
          {data && <ProductGrid products={data.products} total={data.total} />}
        </div>
      </div>
    </main>
  );
}
