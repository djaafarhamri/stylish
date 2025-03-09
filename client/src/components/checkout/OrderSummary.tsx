
import { useState } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { Input } from "../ui/input"

// Mock data - in a real app, this would come from your cart state
const initialCartItems = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    quantity: 2,
    size: "M",
    color: "White",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 59.99,
    quantity: 1,
    size: "32",
    color: "Blue",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export default function OrderSummary() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [promoError, setPromoError] = useState("")

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 4.99
  const tax = subtotal * 0.08 // 8% tax rate
  const total = subtotal + shipping + tax - discount

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const applyPromoCode = () => {
    setIsApplyingPromo(true)
    setPromoError("")

    // Simulate API call to validate promo code
    setTimeout(() => {
      if (promoCode.toUpperCase() === "SAVE10") {
        setDiscount(subtotal * 0.1) // 10% discount
      } else {
        setPromoError("Invalid promo code")
        setDiscount(0)
      }
      setIsApplyingPromo(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-start space-x-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {item.size} / {item.color}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
            {promoError && <p className="text-sm text-red-500 mt-1">{promoError}</p>}
          </div>
          <Button variant="outline" onClick={applyPromoCode} disabled={!promoCode || isApplyingPromo}>
            {isApplyingPromo ? "Applying..." : "Apply"}
          </Button>
        </div>

        <Separator />

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-4">
        <div className="text-sm text-muted-foreground">
          <p>Shipping times are typically 3-5 business days.</p>
          <p>Free returns within 30 days.</p>
        </div>
      </CardFooter>
    </Card>
  )
}

