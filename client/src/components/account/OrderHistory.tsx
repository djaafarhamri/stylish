import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Eye } from "lucide-react";
import { Link } from "react-router";
import { Order } from "../../types/api";
import { OrderService } from "../../services/order-service";

export default function OrderHistory() {
  // In a real app, you would fetch this data from your backend
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const getOrders = async () => {
      const data = await OrderService.getUserOrders();
      if (data.status) {
        setOrders(data.orders);
      }
    };
    getOrders();
  }, []);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-gray-100 text-gray-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-yellow-100 text-yellow-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div>
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">
            You haven't placed any orders yet.
          </p>
          <Button asChild>
            <Link to="/products">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order?.id}>
                <TableCell className="font-medium">{"ORD-" + String(order.id).padStart(5, "0")}</TableCell>
                <TableCell>
                  {new Date(order.createdAt || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(order?.status)}
                  >
                    {order?.status
                      ? order?.status?.charAt(0)?.toUpperCase() +
                        order?.status?.slice(1)
                      : ""}
                  </Badge>
                </TableCell>
                <TableCell>${order?.total}</TableCell>
                <TableCell>{order?.items?.length}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/order/${"ORD-" + String(order.id).padStart(5, "0")}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
