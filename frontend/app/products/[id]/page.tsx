"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import FeaturedProducts from "@/components/featured-products"
import apiClient from "@/lib/api-client"
import ProductContent from "@/components/product-content"
import { ProductService } from "@/services/product-service"

// Mock product data
const product = {
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
}

// Server Component for fetching products
export default async function ProductPage({ params }: { params: {id: string} }) {
  // This runs on the server
  const productData = await ProductService.getProductById(params.id)

  return <ProductContent product={productData.product} />
}
