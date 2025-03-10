import { CheckCircle, Package, Truck, Home, CircleAlert } from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { OrderService } from "../services/order-service";
import { Order } from "../types/api";
import useAuth from "../context/auth/useAuth";

export default function ConfirmationPage() {
  // In a real app, you would fetch the order details from your database

  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("orderId");

  const [order, setOrder] = useState<Order>({} as Order);
  const {user} = useAuth()

  useEffect(() => {
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

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase. Your order has been received.
          </p>
          <p className="font-medium">
            Order Number: <span className="font-bold">{orderNumber}</span>
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Order Date</h3>
                <p className="text-muted-foreground">
                  {new Date(order.createdAt || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Payment Method</h3>
                <p className="text-muted-foreground">
                  {order.paymentMethod}{" "}
                  {order.paymentMethod === "CREDIT" &&
                    `(ending in ${order.cardNumber?.slice(-4)})`}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-1">Shipping Address</h3>
              <p className="text-muted-foreground">
                {order?.isGuest
                  ? `${order?.guestFirstName} ${order?.guestLastName}`
                  : `${order?.user?.firstName} ${order?.user?.lastName}`}
                <br />
                {order.shippingAddress?.street}
                <br />
                {order.shippingAddress?.city} {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.postalCode}
                <br />
                {order.shippingAddress?.country}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex items-center mb-8">
                <div
                  className={`z-10 flex items-center justify-center w-10 h-10 ${
                    order.status === "PENDING"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  } rounded-full`}
                >
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Order Confirmed</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt || Date.now()).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>

              {order.status === "PENDING" && (
                <div className="absolute top-5 left-5 h-full w-0.5 bg-border" />
              )}

              <div className="flex items-center mb-8">
                <div
                  className={`z-10 flex items-center justify-center w-10 h-10 ${
                    order.status === "PROCESSING"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  } rounded-full`}
                >
                  <Package className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Processing Order</h3>
                  <p className="text-sm text-muted-foreground">
                    Estimated: 1-2 business days
                  </p>
                </div>
              </div>

              {order.status === "PROCESSING" && (
                <div className="absolute top-5 left-5 h-full w-0.5 bg-border" />
              )}

              <div className="flex items-center mb-8">
                <div
                  className={`z-10 flex items-center justify-center w-10 h-10 ${
                    order.status === "SHIPPED"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  } rounded-full`}
                >
                  <Truck className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Shipped</h3>
                  <p className="text-sm text-muted-foreground">
                    Estimated: 3-5 business days
                  </p>
                </div>
              </div>

              {order.status === "SHIPPED" && (
                <div className="absolute top-5 left-5 h-full w-0.5 bg-border" />
              )}

              <div className="flex items-center">
                <div
                  className={`z-10 flex items-center justify-center w-10 h-10 ${
                    order.status === "DELIVERED"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  } rounded-full`}
                >
                  <Home className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Delivered</h3>
                  <p className="text-sm text-muted-foreground">
                    Estimated arrival: 5-7 business days
                  </p>
                </div>
              </div>

              {order.status === "DELIVERED" && (
                <div className="absolute top-5 left-5 h-full w-0.5 bg-border" />
              )}

              {order.status === "CANCELLED" && (
                <div className="flex items-center">
                  <div
                    className={`z-10 flex items-center justify-center w-10 h-10 ${
                      order.status === "CANCELLED"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    } rounded-full`}
                  >
                    <CircleAlert className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Cancelled</h3>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user && (<Button asChild>
            <Link to="/account?tab=orders">View Order History</Link>
          </Button>)}
          <Button variant="outline" asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
