import apiClient from "../lib/apiClient";
import type { CartResponse } from "../types/api";

export const CartService = {
  // Get user cart
  async getCart(): Promise<CartResponse> {
    const { data } = await apiClient.get("/cart", {withCredentials: true});
    return data;
  },

  // Add item to cart
  async addItemToCart(variantId: string, quantity: number): Promise<CartResponse> {
    console.log("add cart sddweijfweijfwem")
    const { data } = await apiClient.post(`/cart`, { variantId, quantity }, {withCredentials: true});
    return data;
  },

  // Remove item from cart
  async removeItemFromCart(variantId: string): Promise<CartResponse> {
    const { data } = await apiClient.delete(`/cart/items/${variantId}`, {withCredentials: true});
    return data;
  },
};
