import { useState } from "react";
import { ChevronRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { Link } from "react-router";
import { showToast } from "../components/ui/showToast";
import useCart from "../context/cart/useCart";
import { variant } from "../types/api";

export default function CartPage() {
  const { cart, add, remove } = useCart();
  console.log("cart: ", cart);

  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const updateQuantity = async (variantId: string, newQuantity: number, maxQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxQuantity) return;
    try {
      await add({ id: variantId } as variant, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const removeItem = async (variantId: string) => {
    try {
      await remove(variantId);
      showToast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const applyPromoCode = () => {
    if (!promoCode) return;

    setIsApplyingPromo(true);
    // Simulate API call
    setTimeout(() => {
      showToast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired.",
        type: "error",
      });
      setIsApplyingPromo(false);
    }, 1000);
  };

  const subtotal = cart?.items.reduce(
    (sum, item) =>
      sum +
      (parseFloat(item.variant?.product?.salePrice)
        ? parseFloat(item.variant?.product?.salePrice)
        : parseFloat(item.variant?.product?.price)) *
        item.quantity,
    0
  );
  const shipping = subtotal ? (subtotal > 100 ? 0 : 10) : 0;
  const total = subtotal ? subtotal + shipping : 0;

  return (
    <main className="container py-8">
      <div className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Shopping Cart</span>
      </div>

      <h1 className="mb-8 text-3xl font-bold">Your Shopping Cart</h1>

      {cart?.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
          <p className="mb-6 text-muted-foreground">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Cart Items ({cart?.items.length})
                </h2>
                <div className="space-y-6">
                  {cart?.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={
                            item.variant?.product?.imageUrl ||
                            "/placeholder.svg"
                          }
                          alt={item.variant?.product?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <Link
                            to={`/products/${item.variant?.product?.id}`}
                            className="font-medium hover:underline"
                          >
                            {item.variant?.product?.name}
                          </Link>
                          <span className="font-medium">
                            $
                            {(parseFloat(item.variant?.product?.salePrice)
                              ? parseFloat(item.variant?.product?.salePrice)
                              : parseFloat(item.variant?.product?.price) *
                                item.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          <span>Size: {item?.variant?.size}</span> •{" "}
                          <span>Color: {item?.variant?.color?.name}</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              disabled={item.quantity === 1}
                              onClick={() =>
                                updateQuantity(item.variant?.id, item.quantity - 1, item?.variant?.quantity)
                              }
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              disabled={item.quantity === item?.variant?.quantity}
                              onClick={() =>
                                updateQuantity(item?.variant?.id, item.quantity + 1, item?.variant?.quantity)
                              }
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={() => removeItem(item?.variant?.id)}
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
                    <span>${subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
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
                      <Button
                        variant="outline"
                        onClick={applyPromoCode}
                        disabled={isApplyingPromo || !promoCode}
                      >
                        {isApplyingPromo ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                    <Link to="/checkout">
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
                  <img
                    src="/placeholder.svg?height=30&width=40"
                    alt="Visa"
                    className="h-6"
                  />
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <img
                    src="/placeholder.svg?height=30&width=40"
                    alt="Mastercard"
                    className="h-6"
                  />
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <img
                    src="/placeholder.svg?height=30&width=40"
                    alt="PayPal"
                    className="h-6"
                  />
                </div>
                <div className="rounded-md border bg-muted/20 p-2">
                  <img
                    src="/placeholder.svg?height=30&width=40"
                    alt="Apple Pay"
                    className="h-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
