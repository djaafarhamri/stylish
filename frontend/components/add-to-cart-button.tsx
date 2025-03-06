"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { addToCart } from "@/actions/cart"

interface AddToCartButtonProps {
  productId: string
  quantity?: number
}

export default function AddToCartButton({ productId, quantity = 1 }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async () => {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("productId", productId)
    formData.append("quantity", quantity.toString())

    try {
      const result = await addToCart(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Item added to cart",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={isLoading} className="flex-1">
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  )
}

