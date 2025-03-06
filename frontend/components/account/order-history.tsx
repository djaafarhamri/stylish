"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye } from "lucide-react"

type Order = {
  id: string
  date: string
  total: string
  status: "processing" | "shipped" | "delivered" | "cancelled"
  items: number
}

export default function OrderHistory() {
  // In a real app, you would fetch this data from your backend
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-12345",
      date: "Mar 14, 2023",
      total: "$129.99",
      status: "delivered",
      items: 3,
    },
    {
      id: "ORD-12346",
      date: "Apr 2, 2023",
      total: "$79.99",
      status: "shipped",
      items: 2,
    },
    {
      id: "ORD-12347",
      date: "May 18, 2023",
      total: "$249.99",
      status: "processing",
      items: 4,
    },
  ])

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return ""
    }
  }

  return (
    <div>
      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
          <Button asChild>
            <Link href="/products">Start shopping</Link>
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
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>
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
  )
}

