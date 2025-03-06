"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=200",
    size: "M",
    color: "White",
    quantity: 1,
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 59.99,
    image: "/placeholder.svg?height=200&width=200",
    size: "32",
    color: "Blue",
    quantity: 1,
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    })
  }

  const applyPromoCode = () => {
    if (!promoCode) return

    setIsApplyingPromo(true)
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired.",
        variant: "destructive",
      })
      setIsApplyingPromo(false)
    }, 1000)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  return (
    <main className="container py-8">
      <div className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Shopping Cart</span>
      </div>

      <h1 className="mb-8 text-3xl font-bold">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Cart Items ({cartItems.length})</h2>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <Link href={`/products/${item.id}`} className="font-medium hover:underline">
                            {item.name}
                          </Link>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <span>Size: {item.size}</span> • <span>Color: {item.color}</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg border">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="pt-4">
                    <div className="mb-4 flex gap-2">
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={applyPromoCode} disabled={isApplyingPromo || !promoCode}>
                        {isApplyingPromo ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                    <Link href="/checkout">
                      <Button className="w-full">Proceed to Checkout</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border p-6">
              <h3 className="mb-4 font-medium">We Accept</h3>
              <div className="flex gap-2">
                <div className="rounded-md border bg-muted/20 p-2">
                  <img src="/placeholder.svg?height=30&width=40" alt="Visa" className="h-6" />
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <img src="/placeholder.svg?height=30&width=40" alt="Mastercard" className="h-6" />
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <img src="/placeholder.svg?height=30&width=40" alt="PayPal" className="h-6" />
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <img src="/placeholder.svg?height=30&width=40" alt="Apple Pay" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

