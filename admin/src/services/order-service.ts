import apiClient from "../lib/apiClient";
import type {
  ChartsResponse,
  CustomerResponse,
  CustomersResponse,
  Order,
  OrderResponse,
  OrdersResponse,
  StatsResponse,
} from "../types/api";

export const OrderService = {
  // Get user orders
  async getOrders(filters: {
    search?: string;
    status: string;
    sortBy: "createdAt" | "items" | "total" | "id" | "status" | "firstName";
    sortOrder: "desc" | "asc";
    page: number;
    limit: number;
    customerId?: string;
  }): Promise<OrdersResponse> {
    const { data } = await apiClient.get("/orders", {
      params: filters,
      withCredentials: true,
    });
    return data;
  },

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

  // Get order by ID
  async getCustomers(filters: {
    search?: string;
    sortBy: "orders" | "lastOrder" | "totalSpent" | "id" | "name" | "status";
    sortOrder: "desc" | "asc";
    page: number;
    limit: number;
  }): Promise<CustomersResponse> {
    const { data } = await apiClient.get(`/orders/customers`, {
      params: filters,
      withCredentials: true,
    });
    return data;
  },

  // Get order by ID
  async getCustomerById(id: string): Promise<CustomerResponse> {
    const { data } = await apiClient.get(`/orders/customers/${id}`, {
      withCredentials: true,
    });
    return data;
  },
 
  // Get stats
  async getStats(): Promise<StatsResponse> {
    const { data } = await apiClient.get(`/orders/stats`, {
      withCredentials: true,
    });
    return data;
  },
 
  // Get charts
  async getCharts(): Promise<ChartsResponse> {
    const { data } = await apiClient.get(`/orders/charts`, {
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
  // Create guest order
  async updateOrderStatus(status: string, id: string): Promise<OrderResponse> {
    const { data } = await apiClient.patch(
      `/orders/${id}/status`,
      { status },
      { withCredentials: true }
    );
    return data;
  },
};
