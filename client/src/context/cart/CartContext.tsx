
import { Cart, variant } from "../../types/api";
import { createContext } from "react";


interface CartContextType {
  cart: Cart | undefined;
  add: (item: variant, quantity: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

// Create the context
export const CartContext = createContext<CartContextType | undefined>(undefined);

