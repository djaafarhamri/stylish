import apiClient from "../lib/apiClient";
import type { Order, OrderResponse, OrdersResponse } from "../types/api";

export const OrderService = {
  // Get user orders
  async getUserOrders(): Promise<OrdersResponse> {
    const { data } = await apiClient.get("/orders", { withCredentials: true });
    return data;
  },

  // Get order by ID
  async getOrderById(id: string): Promise<OrderResponse> {
    const { data } = await apiClient.get(`/orders/${id}`, {
      withCredentials: true,
    });
    return data;
  },

  // Create new order
  async createOrder(
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
  ): Promise<OrderResponse> {
    const { data } = await apiClient.post("/orders", orderData, {
      withCredentials: true,
    });
    return data;
  },
  // Create guest order
  async createGuestOrder(
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
  ): Promise<OrderResponse> {
    const { data } = await apiClient.post("/orders/guest", orderData);
    return data;
  },
};
