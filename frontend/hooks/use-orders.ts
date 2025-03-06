import useSWR from "swr"
import { OrderService } from "@/services/order-service"

export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR("user-orders", () => OrderService.getUserOrders())

  return {
    orders: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useOrder(id: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(id ? `order-${id}` : null, () =>
    id ? OrderService.getOrderById(id) : null,
  )

  return {
    order: data,
    isLoading,
    isError: error,
    mutate,
  }
}

