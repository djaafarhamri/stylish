import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Mail,
  Package,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useToast } from "../components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { OrderService } from "@/services/order-service";
import { Image, Order } from "@/types/api";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch order details
    const fetchOrder = async () => {
      try {
        // In a real app, you would fetch this data from your API
        const data = await OrderService.getOrderById(id?.split("-")[1] || "");
        setOrder(data.order);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    setIsUpdating(true);

    try {
      const data = await OrderService.updateOrderStatus(newStatus, id || "");
      if (data.status) {
        setOrder({
          ...order,
          status: newStatus as any,
        });

        toast({
          title: "Order status updated",
          description: `Order status has been updated to ${newStatus}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update order status. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Package className="h-5 w-5" />;
      case "PROCESSING":
        return <Package className="h-5 w-5" />;
      case "SHIPPED":
        return <Truck className="h-5 w-5" />;
      case "DELIVERED":
        return <CheckCircle className="h-5 w-5" />;
      case "CANCELLED":
        return <XCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

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

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The order you're looking for doesn't exist.
        </p>
        <Button asChild>
          <a href="/orders">Back to Orders</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Order {order.id}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`/orders/${id}/invoice`}>
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href={`mailto:${
                order.isGuest ? order.guestEmail : order.user?.email
              }`}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Customer
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              Placed on{" "}
              {new Date(order.createdAt || Date.now()).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="items">
              <TabsList>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="pt-4">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b pb-4"
                    >
                      <img
                        src={
                          (item.variant.product?.mainImage as Image).url ||
                          "/placeholder.svg"
                        }
                        alt={item.variant?.product?.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {item.variant?.product?.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          $
                          {parseFloat(
                            item.variant?.product?.price || ""
                          ).toFixed(2)}{" "}
                          x {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">
                        $
                        {(
                          parseFloat(item.variant?.product?.price || "") *
                          item.quantity
                        ).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>
                        $
                        {order.items
                          .reduce(
                            (s, item) =>
                              (s +=
                                parseFloat(item.variant?.product?.price || "") *
                                item.quantity),
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${10.0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${10.0}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>
                        $
                        {order.items
                          .reduce(
                            (s, item) =>
                              (s +=
                                parseFloat(item.variant?.product?.price || "") *
                                item.quantity),
                            20
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Shipping Address</h4>
                    <p className="text-muted-foreground">
                      {order.shippingAddress?.street}
                      <br />
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}{" "}
                      {order.shippingAddress?.postalCode}
                      <br />
                      {order.shippingAddress?.country}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Shipping Method</h4>
                    <p className="text-muted-foreground">Standard Shipping</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Tracking Number</h4>
                    <p className="text-muted-foreground">
                      {order.status === "SHIPPED" ||
                      order.status === "DELIVERED"
                        ? "TRK123456789"
                        : "Not available yet"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Customer Notes</h4>
                    <p className="text-muted-foreground">
                      {order.notes || "No notes provided by the customer."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Internal Notes</h4>
                    <p className="text-muted-foreground">No internal notes.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarFallback>
                    {order.isGuest
                      ? order.guestFirstName?.charAt(0)
                      : order.user?.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {order.isGuest
                      ? order.guestFirstName
                      : order.user?.firstName}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {order.isGuest ? order.guestEmail : order.user?.email}
                  </p>
                </div>
              </div>
              {!order.isGuest && (
                <Button variant="outline" className="w-full" asChild>
                  <a href={`/customers/${order.user?.id}`}>View Customer</a>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={getStatusBadgeVariant(order.status || "") as any}
                  className="flex gap-1 items-center"
                >
                  {getStatusIcon(order.status || "")}
                  <span>
                    {order.status &&
                      order.status?.charAt(0).toUpperCase() +
                        order.status?.slice(1)}
                  </span>
                </Badge>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <Select
                  value={order.status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Method</span>
                <span>{order.paymentMethod}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Amount</span>
                <span className="font-medium">
                  $
                  {order.items
                    .reduce(
                      (s, item) =>
                        (s +=
                          parseFloat(item.variant?.product?.price || "") *
                          item.quantity),
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
