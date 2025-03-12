
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Calendar, DollarSign } from "lucide-react"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

interface Order {
  id: string
  date: string
  total: number
  status: string
  items: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  status: "active" | "inactive"
  joinDate: string
  totalOrders: number
  totalSpent: number
  recentOrders: Order[]
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch customer details
    const fetchCustomer = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // const response = await fetch(`http://localhost:3001/api/customers/${id}`);
        // const data = await response.json();

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          const mockCustomer: Customer = {
            id: id || "cust-1",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            avatar: "/placeholder.svg?height=100&width=100",
            address: {
              street: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "USA",
            },
            status: "active",
            joinDate: "2022-03-15",
            totalOrders: 8,
            totalSpent: 567.89,
            recentOrders: [
              {
                id: "ORD-1001",
                date: "2023-05-15",
                total: 125.46,
                status: "delivered",
                items: 3,
              },
              {
                id: "ORD-1002",
                date: "2023-04-22",
                total: 89.99,
                status: "delivered",
                items: 1,
              },
              {
                id: "ORD-1003",
                date: "2023-03-10",
                total: 152.44,
                status: "delivered",
                items: 4,
              },
            ],
          }

          setCustomer(mockCustomer)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching customer:", error)
        setIsLoading(false)
      }
    }

    fetchCustomer()
  }, [id])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "secondary"
      default:
        return "default"
    }
  }

  const getOrderStatusBadgeVariant = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-2">Customer Not Found</h2>
        <p className="text-muted-foreground mb-4">The customer you're looking for doesn't exist.</p>
        <Button asChild>
          <a href="/customers">Back to Customers</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/customers")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Customer Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={customer.avatar} alt={customer.name} />
              <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{customer.name}</CardTitle>
              <CardDescription>
                <Badge variant={getStatusBadgeVariant(customer.status) as any}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </Badge>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {customer.address.city}, {customer.address.state}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined on {customer.joinDate}</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <h4 className="text-sm font-medium">Full Address</h4>
              <p className="text-sm text-muted-foreground">
                {customer.address.street}
                <br />
                {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                <br />
                {customer.address.country}
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1" asChild>
                <a href={`mailto:${customer.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </a>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href={`tel:${customer.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{customer.totalOrders}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">${customer.totalSpent.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">${(customer.totalSpent / customer.totalOrders).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="orders">
                <TabsList>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="activity">Activity Log</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Order ID</th>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">Status</th>
                          <th className="text-right py-3 px-4 font-medium">Items</th>
                          <th className="text-right py-3 px-4 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.recentOrders.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="py-3 px-4">
                              <a href={`/orders/${order.id}`} className="font-medium text-primary hover:underline">
                                {order.id}
                              </a>
                            </td>
                            <td className="py-3 px-4">{order.date}</td>
                            <td className="py-3 px-4">
                              <Badge variant={getOrderStatusBadgeVariant(order.status) as any}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="text-right py-3 px-4">{order.items}</td>
                            <td className="text-right py-3 px-4 font-medium">${order.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-center mt-4">
                    <Button variant="outline" asChild>
                      <a href={`/orders?customer=${customer.id}`}>View All Orders</a>
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="pt-4">
                  <div className="space-y-4">
                    <div className="border-l-2 border-muted pl-4 py-2">
                      <div className="text-sm font-medium">Placed an order</div>
                      <div className="text-sm text-muted-foreground">May 15, 2023 at 10:30 AM</div>
                      <div className="text-sm mt-1">Order #ORD-1001 for $125.46</div>
                    </div>

                    <div className="border-l-2 border-muted pl-4 py-2">
                      <div className="text-sm font-medium">Updated shipping address</div>
                      <div className="text-sm text-muted-foreground">April 28, 2023 at 2:15 PM</div>
                    </div>

                    <div className="border-l-2 border-muted pl-4 py-2">
                      <div className="text-sm font-medium">Placed an order</div>
                      <div className="text-sm text-muted-foreground">April 22, 2023 at 9:45 AM</div>
                      <div className="text-sm mt-1">Order #ORD-1002 for $89.99</div>
                    </div>

                    <div className="border-l-2 border-muted pl-4 py-2">
                      <div className="text-sm font-medium">Placed an order</div>
                      <div className="text-sm text-muted-foreground">March 10, 2023 at 11:20 AM</div>
                      <div className="text-sm mt-1">Order #ORD-1003 for $152.44</div>
                    </div>

                    <div className="border-l-2 border-muted pl-4 py-2">
                      <div className="text-sm font-medium">Account created</div>
                      <div className="text-sm text-muted-foreground">March 15, 2022 at 3:00 PM</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

