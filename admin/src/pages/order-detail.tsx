
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Download, Mail, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { useToast } from "../components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

interface OrderItem {
  id: string
  product: {
    id: string
    name: string
    image: string
  }
  price: number
  quantity: number
  total: number
}

interface Order {
  id: string
  customer: {
    id: string
    name: string
    email: string
    avatar: string
  }
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "paid" | "unpaid" | "refunded"
  paymentMethod: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  notes?: string
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch order details
    const fetchOrder = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // const response = await fetch(`http://localhost:3001/api/orders/${id}`);
        // const data = await response.json();

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          const mockOrder: Order = {
            id: id || "ORD-1001",
            customer: {
              id: "cust-1",
              name: "John Doe",
              email: "john.doe@example.com",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            date: "2023-05-15",
            status: "processing",
            paymentStatus: "paid",
            paymentMethod: "Credit Card",
            shippingAddress: {
              street: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "USA",
            },
            items: [
              {
                id: "item-1",
                product: {
                  id: "prod-1",
                  name: "Cotton T-Shirt",
                  image: "/placeholder.svg?height=80&width=80",
                },
                price: 29.99,
                quantity: 2,
                total: 59.98,
              },
              {
                id: "item-2",
                product: {
                  id: "prod-2",
                  name: "Slim Fit Jeans",
                  image: "/placeholder.svg?height=80&width=80",
                },
                price: 49.99,
                quantity: 1,
                total: 49.99,
              },
            ],
            subtotal: 109.97,
            shipping: 5.99,
            tax: 9.5,
            total: 125.46,
            notes: "Please leave the package at the front door.",
          }

          setOrder(mockOrder)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching order:", error)
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return

    setIsUpdating(true)

    try {
      // In a real app, you would make an API call to update the order status
      // await fetch(`http://localhost:3001/api/orders/${id}/status`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOrder({
        ...order,
        status: newStatus as any,
      })

      toast({
        title: "Order status updated",
        description: `Order status has been updated to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status. Please try again.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-5 w-5" />
      case "processing":
        return <Package className="h-5 w-5" />
      case "shipped":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      case "cancelled":
        return <XCircle className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "processing":
        return "default"
      case "shipped":
        return "primary"
      case "delivered":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "success"
      case "unpaid":
        return "destructive"
      case "refunded":
        return "secondary"
      default:
        return "default"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
        <Button asChild>
          <a href="/orders">Back to Orders</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/orders")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Order {order.id}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`/orders/${id}/invoice`}>
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`mailto:${order.customer.email}`}>
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
            <CardDescription>Placed on {order.date}</CardDescription>
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
                    <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">${item.total.toFixed(2)}</div>
                    </div>
                  ))}

                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>${order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Shipping Address</h4>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.street}
                      <br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      <br />
                      {order.shippingAddress.country}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Shipping Method</h4>
                    <p className="text-muted-foreground">Standard Shipping</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">Tracking Number</h4>
                    <p className="text-muted-foreground">
                      {order.status === "shipped" || order.status === "delivered"
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
                    <p className="text-muted-foreground">{order.notes || "No notes provided by the customer."}</p>
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
                  <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                  <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{order.customer.name}</h4>
                  <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href={`/customers/${order.customer.id}`}>View Customer</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(order.status) as any} className="flex gap-1 items-center">
                  {getStatusIcon(order.status)}
                  <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                </Badge>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <Select value={order.status} onValueChange={handleStatusChange} disabled={isUpdating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
                <span className="text-sm">Status</span>
                <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus) as any}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Method</span>
                <span>{order.paymentMethod}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Amount</span>
                <span className="font-medium">${order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

