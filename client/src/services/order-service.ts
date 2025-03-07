import apiClient from "../lib/apiClient"
import type { Order } from "../types/api"

export const OrderService = {
  // Get user orders
  async getUserOrders(): Promise<Order[]> {
    const { data } = await apiClient.get("/orders")
    return data
  },

  // Get order by ID
  async getOrderById(id: string): Promise<Order> {
    const { data } = await apiClient.get(`/orders/${id}`)
    return data
  },

  // Create new order
  async createOrder(orderData: Omit<Order, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Order> {
    const { data } = await apiClient.post("/orders", orderData)
    return data
  },
}

