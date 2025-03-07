import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import type { ProductFilters } from "../../types/api"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router"

interface ProductsFilterProps {
  initialFilters: ProductFilters
}

export default function ProductsFilter({ initialFilters }: ProductsFilterProps) {
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() || "")
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() || "")
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const applyFilters = () => {
    // Create a new URLSearchParams object based on the current search params
    const params = new URLSearchParams(searchParams.toString())

    // Update or remove price filters
    if (minPrice) {
      params.set("minPrice", minPrice)
    } else {
      params.delete("minPrice")
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice)
    } else {
      params.delete("maxPrice")
    }

    // Reset to page 1 when filtering
    params.set("page", "1")

    // Navigate to the same page but with updated search params
    navigate(`${pathname}?${params.toString()}`)
  }

  const setCategory = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    params.set("page", "1")
    navigate(`${pathname}?${params.toString()}`)
  }

  const isActiveCategory = (category: string | null) => {
    return initialFilters.category === category
  }

  return (
    <div className="hidden md:block space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <div className="space-y-2">
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault()
              setCategory(null)
            }}
            className={`block ${isActiveCategory(null) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            All Products
          </Link>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault()
              setCategory("men")
            }}
            className={`block ${isActiveCategory("men") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Men
          </Link>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault()
              setCategory("women")
            }}
            className={`block ${isActiveCategory("women") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Women
          </Link>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault()
              setCategory("accessories")
            }}
            className={`block ${isActiveCategory("accessories") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Accessories
          </Link>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <Button className="mt-4 w-full" onClick={applyFilters}>
          Apply
        </Button>
      </div>

      {/* Other filter sections remain the same */}
    </div>
  )
}

