import Link from "next/link"

import { Card } from "@/components/ui/card"

const categories = [
  {
    id: "men",
    name: "Men's Collection",
    image: "/placeholder.svg?height=300&width=400",
    count: 42,
  },
  {
    id: "women",
    name: "Women's Collection",
    image: "/placeholder.svg?height=300&width=400",
    count: 56,
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/placeholder.svg?height=300&width=400",
    count: 24,
  },
]

export default function Categories() {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-6">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <Card className="overflow-hidden h-full transition-all hover:shadow-md">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <p className="text-sm">{category.count} products</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

