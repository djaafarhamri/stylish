import { ChevronLeft, Package, Truck, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { formatDate } from "../lib/utils";
import OrderNotFound from "../components/order/NotFound";
import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Order } from "../types/api";
import { OrderService } from "../services/order-service";

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "";
  }
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderNumber = params.id;

  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    console.log(orderNumber?.split("-")[1])
    const getOrder = async () => {
      if (orderNumber?.split("-")[1]) {
        const data = await OrderService.getOrderById(
          orderNumber?.split("-")[1]
        );
        if (data.status) {
          setOrder(data.order);
        }
      }
    };
    getOrder();
  }, []);
  
  if (!order) {
    return OrderNotFound();
  }

  return (
    <div className="container py-10">
      <Link
        to="/account?tab=orders"
        className="inline-flex items-center text-sm mb-6 hover:underline"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-muted-foreground">
            Placed on {formatDate(new Date(order.createdAt || Date.now()))}
          </p>
        </div>
        <Badge className={`mt-2 md:mt-0 ${getStatusColor(order.status || "")}`}>
          {order.status
            ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
            : ""}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order?.items?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={
                          item.variant.product.imageUrl || "/placeholder.svg"
                        }
                        alt={item.variant.product.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        <Link
                          to={`/products/${item.variant.productId}`}
                          className="hover:underline"
                        >
                          {item.variant.product.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        $
                        {item.variant.product.salePrice
                          ? parseFloat(item.variant.product.salePrice).toFixed(
                              2
                            )
                          : parseFloat(item.variant.product.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        $
                        {item.variant.product.salePrice
                          ? (
                              parseFloat(item.variant.product.salePrice) *
                              item.quantity
                            ).toFixed(2)
                          : (
                              parseFloat(item.variant.product.price) *
                              item.quantity
                            ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.total ? parseFloat(order.total).toFixed(2) : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$10.00</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2">
                    <span>Total</span>
                    <span>${order.total ? parseFloat(order.total).toFixed(2) + 10 : 10}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.status === "SHIPPED" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipment Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Tracking Number</p>
                      <p className="text-muted-foreground">
                        {0}
                      </p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link
                        to={`https://example.com/track/${order.cardNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Track Package
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p>{formatDate(new Date(order.createdAt || Date.now()))}</p>
                  </div>
                  <div className="relative pt-6">
                    <div className="absolute left-0 top-0 h-full flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10">
                        <Package className="h-3 w-3" />
                      </div>
                      <div className="w-0.5 h-full bg-primary"></div>
                    </div>
                    <div className="ml-10 pb-8">
                      <p className="font-medium">Order Processed</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(order.createdAt || Date.now()))}
                      </p>
                    </div>
                    <div className="absolute left-0 top-1/3 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10">
                      <Truck className="h-3 w-3" />
                    </div>
                    <div className="ml-10 pb-8 pt-2">
                      <p className="font-medium">Order Shipped</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000))}
                      </p>
                    </div>
                    <div className="absolute left-0 bottom-0 h-6 w-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center z-10">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <div className="ml-10">
                      <p className="font-medium text-muted-foreground">
                        Delivered
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Estimated{" "}
                        {formatDate(new Date(order.createdAt || Date.now()))}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.paymentMethod}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                If you have any questions or issues with your order, our
                customer service team is here to help.
              </p>
              <Button className="w-full">Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
