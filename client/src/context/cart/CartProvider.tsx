import { ReactNode, useEffect, useState } from "react";
import { CartService } from "../../services/cart-service";
import { Cart, variant } from "../../types/api";
import { CartContext } from "./CartContext";
import useAuth from "../auth/useAuth";

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | undefined>(undefined);

  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (user) {
          // If user is logged in, fetch cart from service
          const data = await CartService.getCart();
          if (data.status === true) {
            setCart(data.cart);
          }
          localStorage.setItem("guestCart", JSON.stringify(data?.cart?.items));
          
        } else {
          // If no user, get cart from localStorage
          const guestCart = JSON.parse(
            localStorage.getItem("guestCart") || "[]"
          );
          setCart({
            id: "guest-cart",
            userId: "guest",
            items: guestCart,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.log("Error fetching cart:", e);
      }
    };

    fetchCart();
  }, [user]); // Re-run effect when user changes

  const putItemToStorage = (item: variant, quantity: number) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    const existingItemIndex = guestCart.findIndex((i: any) => i.id === item.id);

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      guestCart[existingItemIndex].quantity = quantity;
    } else {
      // Add new item
      guestCart.push({
        ...item,
        variant: { ...item, product: item.product },
        quantity,
      });
    }

    localStorage.setItem("guestCart", JSON.stringify(guestCart));

    // Update state
    const updatedCart = {
      id: "guest-cart",
      userId: "guest",
      items: guestCart,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCart(updatedCart);
  };

  const add = async (item: variant, quantity: number = 1) => {
    try {
      if (user) {
        // If logged in, use API
        const updatedCart = await CartService.addItemToCart(item.id, quantity);
        if (updatedCart.status) {
          setCart(updatedCart.cart);
        }
        localStorage.setItem("guestCart", JSON.stringify(updatedCart?.cart?.items));
      } else {
        // Guest user logic
        putItemToStorage(item, quantity);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeItemFromStorage = (variantId: string) => {
    // Guest user logic
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    const updatedCart = guestCart.filter((i: any) => i.id !== variantId);
    localStorage.setItem("guestCart", JSON.stringify(updatedCart));

    setCart({
      id: "guest-cart",
      userId: "guest",
      items: updatedCart,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const remove = async (variantId: string) => {
    try {
      if (user) {
        // If logged in, use API
        const updatedCart = await CartService.removeItemFromCart(variantId);
        if (updatedCart.status) {
          setCart(updatedCart.cart);
        }
        
        localStorage.setItem("guestCart", JSON.stringify(updatedCart?.cart?.items));

      } else {
        removeItemFromStorage(variantId);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, add, remove }}>
      {children}
    </CartContext.Provider>
  );
};
