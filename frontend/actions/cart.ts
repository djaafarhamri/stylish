"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import apiClient from "@/lib/api-client"

export async function addToCart(formData: FormData) {
  try {
    const productId = formData.get("productId") as string
    const quantity = Number.parseInt(formData.get("quantity") as string, 10) || 1

    if (!productId) {
      return { error: "Product ID is required" }
    }

    await apiClient.post("/cart/items", { productId, quantity })

    // Revalidate cart page to show updated items
    revalidatePath("/cart")

    return { success: true }
  } catch (error: any) {
    console.error("Error adding to cart:", error)
    return {
      error: error.response?.data?.message || "Failed to add item to cart",
    }
  }
}

export async function updateCartItem(formData: FormData) {
  try {
    const itemId = formData.get("itemId") as string
    const quantity = Number.parseInt(formData.get("quantity") as string, 10)

    if (!itemId) {
      return { error: "Item ID is required" }
    }

    await apiClient.put(`/cart/items/${itemId}`, { quantity })

    revalidatePath("/cart")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating cart item:", error)
    return {
      error: error.response?.data?.message || "Failed to update cart item",
    }
  }
}

export async function removeFromCart(formData: FormData) {
  try {
    const itemId = formData.get("itemId") as string

    if (!itemId) {
      return { error: "Item ID is required" }
    }

    await apiClient.delete(`/cart/items/${itemId}`)

    revalidatePath("/cart")

    return { success: true }
  } catch (error: any) {
    console.error("Error removing from cart:", error)
    return {
      error: error.response?.data?.message || "Failed to remove item from cart",
    }
  }
}

