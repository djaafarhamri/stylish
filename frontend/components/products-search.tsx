"use client"

import { useState, type FormEvent } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation" // For accessing current search params [^vercel_knowledge_base]

interface ProductsSearchProps {
  initialQuery?: string
}

export default function ProductsSearch({ initialQuery = "" }: ProductsSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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
    router.push(`${pathname}?${params.toString()}`)
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

