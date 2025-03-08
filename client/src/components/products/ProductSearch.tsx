import { useState, type FormEvent } from "react"
import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useLocation, useNavigate, useSearchParams } from "react-router"

interface ProductsSearchProps {
  initialQuery?: string
}

export default function ProductsSearch({ initialQuery = "" }: ProductsSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()

    // Create a new URLSearchParams object based on the current search params
    const params = new URLSearchParams(searchParams.toString())

    // Update or remove the search parameter
    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }

    // Reset to page 1 when searching
    params.set("page", "1")

    // Navigate to the same page but with updated search params
    navigate(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="mt-4 flex w-full max-w-sm items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  )
}

