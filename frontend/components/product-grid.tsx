"use client"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/types/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface ProductGridProps {
  products: Product[]
  total: number
}

export default function ProductGrid({ products, total }: ProductGridProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "24", 10)
  const sortBy = searchParams.get("sortBy") || "createdAt"

  const totalPages = Math.ceil(total / limit)

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {products.length} of {total} products
        </p>
        <Select defaultValue={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product?.id} className="group relative">
                <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                  <Link href={`/products/${product?.id}`}>
                    <Image
                      src={product?.imageUrl || "/placeholder.svg?height=500&width=500"}
                      alt={product?.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover object-center"
                    />
                  </Link>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      <Link href={`/products/${product?.id}`}>{product?.name}</Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product?.category}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${product?.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                className="mx-2"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className="mx-2"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                className="mx-2"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

