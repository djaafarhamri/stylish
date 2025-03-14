import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, MoreHorizontal, Eye, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Order } from "@/types/api";
import { OrderService } from "@/services/order-service";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Simulate API call to fetch orders
    const fetchOrders = async () => {
      try {
        // In a real app, you would fetch this data from your API
        const data = await OrderService.getOrders();
        setOrders(data.orders);
        // For demo purposes, we'll use mock data
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      "ORD-" +
        String(order.id)
          .padStart(5, "0")
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) || order.isGuest
        ? order.guestFirstName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        : order.user?.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) || order.isGuest
        ? order.guestEmail?.toLowerCase().includes(searchQuery.toLowerCase())
        : order.user?.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "PROCESSING":
        return "default";
      case "SHIPPED":
        return "primary";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "destructive";
      default:
        return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">Order ID</th>
                <th className="text-left py-3 px-4 font-medium">Customer</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Items</th>
                <th className="text-right py-3 px-4 font-medium">Total</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="py-3 px-4 font-medium">
                      {"ORD-" + String(order.id).padStart(5, "0")}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">
                          {order.isGuest
                            ? order.guestFirstName
                            : order.user?.firstName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.isGuest ? order.guestEmail : order.user?.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(
                        order.createdAt || Date.now()
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          getStatusBadgeVariant(order.status || "") as any
                        }
                      >
                        {order.status &&
                          order.status?.charAt(0).toUpperCase() +
                            order.status?.slice(1)}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4">
                      {order.items?.length}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/orders/${
                                "ORD-" + String(order.id).padStart(5, "0")
                              }`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/orders/${order.id}/invoice`}>
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
