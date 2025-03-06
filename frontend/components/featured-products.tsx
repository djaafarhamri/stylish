"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// Mock product data
const products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: true,
    isSale: false,
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: false,
    isSale: true,
    salePrice: 49.99,
  },
  {
    id: 3,
    name: "Summer Floral Dress",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    isNew: true,
    isSale: false,
  },
  {
    id: 4,
    name: "Casual Hoodie",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "unisex",
    isNew: false,
    isSale: false,
  },
]

export default function FeaturedProducts() {
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const addToCart = (product: (typeof products)[0]) => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden group">
          <div className="relative aspect-square overflow-hidden">
            <Link href={`/products/${product.id}`}>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={() => toggleFavorite(product.id)}
            >
              <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
              <span className="sr-only">Add to favorites</span>
            </Button>
            {product.isNew && <Badge className="absolute top-2 left-2">New</Badge>}
            {product.isSale && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Sale
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <Link href={`/products/${product.id}`} className="hover:underline">
              <h3 className="font-medium">{product.name}</h3>
            </Link>
            <div className="mt-2 flex items-center">
              {product.isSale ? (
                <>
                  <span className="text-lg font-bold">${product.salePrice}</span>
                  <span className="ml-2 text-sm text-muted-foreground line-through">${product.price}</span>
                </>
              ) : (
                <span className="text-lg font-bold">${product.price}</span>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" onClick={() => addToCart(product)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

