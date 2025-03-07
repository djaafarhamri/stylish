import ProductGrid from "../components/products/ProductGrid";
import ProductsFilter from "../components/products/ProductsFilter";
import ProductsSearch from "../components/products/ProductSearch";
import type { ProductFilters } from "../types/api";
import { useSearchParams } from "react-router";

const data = {
  total: 10,
  products: [
    {
      id: 1,
      name: "Classic White T-Shirt",
      price: 29.99,
      description:
        "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear and easy to style with any outfit.",
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Gray", value: "gray", hex: "#808080" },
      ],
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
      isSale: false,
    },
    {
      id: 2,
      name: "Classic White T-Shirt",
      price: 29.99,
      description:
        "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear and easy to style with any outfit.",
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Gray", value: "gray", hex: "#808080" },
      ],
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
      isSale: false,
    },
    {
      id: 3,
      name: "Classic White T-Shirt",
      price: 29.99,
      description:
        "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear and easy to style with any outfit.",
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Gray", value: "gray", hex: "#808080" },
      ],
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
      isSale: false,
    },
    {
      id: 4,
      name: "Classic White T-Shirt",
      price: 29.99,
      description:
        "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear and easy to style with any outfit.",
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Gray", value: "gray", hex: "#808080" },
      ],
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
      isSale: false,
    },
    {
      id: 5,
      name: "Classic White T-Shirt",
      price: 29.99,
      description:
        "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear and easy to style with any outfit.",
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Gray", value: "gray", hex: "#808080" },
      ],
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
      isSale: false,
    },
    {
      id: 6,
      name: "Classic White T-Shirt",
      price: 29.99,
      description:
        "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear and easy to style with any outfit.",
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Gray", value: "gray", hex: "#808080" },
      ],
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
      isSale: false,
    },
    {
      id: 7,
      name: "Classic White T-Shirt",
      price: 29.99,
      description:
        "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear and easy to style with any outfit.",
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Gray", value: "gray", hex: "#808080" },
      ],
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
      isSale: false,
    },
    {
      id: 8,
      name: "Classic White T-Shirt",
      price: 29.99,
      description:
        "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear and easy to style with any outfit.",
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Gray", value: "gray", hex: "#808080" },
      ],
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
      isSale: false,
    },
    {
      id: 9,
      name: "Classic White T-Shirt",
      price: 29.99,
      description:
        "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear and easy to style with any outfit.",
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Gray", value: "gray", hex: "#808080" },
      ],
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
      isSale: false,
    },
    {
      id: 10,
      name: "Classic White T-Shirt",
      price: 29.99,
      description:
        "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for everyday wear and easy to style with any outfit.",
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { name: "White", value: "white", hex: "#FFFFFF" },
        { name: "Black", value: "black", hex: "#000000" },
        { name: "Gray", value: "gray", hex: "#808080" },
      ],
      rating: 4.5,
      reviewCount: 128,
      isNew: true,
      isSale: false,
    },
  ],
};

export default function ProductsPage() {
  // Parse search params into filters
  const [searchParams, setSearchParams] = useSearchParams()
  const filters: ProductFilters = {
    category: searchParams.get("category") || undefined,
    search: searchParams.get("search") || undefined,
    sortBy:
      (searchParams.get("sortBy") as "price" | "createdAt" | "popular") || "createdAt",
    page: searchParams.get("page")
      ? Number.parseInt(searchParams.get("page") || "24", 10)
      : 1,
    limit: 24,
  };

  if (searchParams.get("minPrice")) {
    filters.minPrice = Number.parseInt(searchParams.get("minPrice") as string, 10);
  }

  if (searchParams.get("maxPrice")) {
    filters.maxPrice = Number.parseInt(searchParams.get("maxPrice") as string, 10);
  }

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

      <ProductsSearch initialQuery={filters.search} />

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        <ProductsFilter initialFilters={filters} />

        <div className="md:col-span-3">
          {data && <ProductGrid products={data.products} total={data.total} />}
        </div>
      </div>
    </main>
  );
}
