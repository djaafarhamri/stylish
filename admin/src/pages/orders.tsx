import { useState, useEffect, useMemo } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Search,
  MoreHorizontal,
  Eye,
  Download,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
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
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || "all",
      sortBy:
        (searchParams.get("sortBy") as
          | "items"
          | "createdAt"
          | "total"
          | "id"
          | "firstName"
          | "status") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "desc" | "asc") || "desc",
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page") || "1", 10)
        : 1,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit") || "10", 10)
        : 10,
      customerId: searchParams.get("customer") || undefined,
    }),
    [searchParams]
  );

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await OrderService.getOrders(filters);
        setOrders(data.orders);
        setTotal(data.total);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [filters]);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const totalPages = Math.ceil(total / filters.limit);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    navigate(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (sortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.sortBy === sortBy) {
      if (filters.sortOrder === "asc") {
        params.set("sortOrder", "desc");
      } else {
        params.set("sortOrder", "asc");
      }
    } else {
      params.set("sortBy", sortBy);
      params.set("sortOrder", "asc");
    }
    navigate(`${pathname}?${params.toString()}`);
  };

  const handleLimitChange = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", limit.toString());
    params.set("page", "1");
    navigate(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    params.set("page", "1");
    navigate(`${pathname}?${params.toString()}`);
  };
  const handleSearchChange = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", searchQuery);
    params.set("page", "1");
    navigate(`${pathname}?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, current and surrounding pages, and last page
      const leftBoundary = Math.max(1, filters.page - 1);
      const rightBoundary = Math.min(totalPages, filters.page + 1);

      if (leftBoundary > 1) {
        pageNumbers.push(1);
        if (leftBoundary > 2) {
          pageNumbers.push("ellipsis");
        }
      }

      for (let i = leftBoundary; i <= rightBoundary; i++) {
        pageNumbers.push(i);
      }

      if (rightBoundary < totalPages) {
        if (rightBoundary < totalPages - 1) {
          pageNumbers.push("ellipsis");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          {filters.customerId && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => navigate("/orders")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-3xl font-bold tracking-tight">
            {filters.customerId &&
              (orders[0]?.isGuest
                ? orders[0]?.guestFirstName
                : orders[0]?.user?.firstName) + "'s "}
            Orders
          </h1>
        </div>
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
        <Button onClick={handleSearchChange}>Search</Button>
        <div className="flex gap-2">
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.limit.toString()}
            onValueChange={(value) => {
              handleLimitChange(parseInt(value));
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th
                  className="text-left py-3 px-4 font-medium"
                  onClick={() => handleSortChange("id")}
                >
                  <div className="flex justify-between">
                    Order ID{" "}
                    {filters.sortBy === "id" &&
                      (filters.sortOrder === "desc" ? (
                        <ArrowUp width={20} />
                      ) : (
                        <ArrowDown width={20} />
                      ))}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  onClick={() => handleSortChange("firstName")}
                >
                  <div className="flex justify-between">
                    Customer{" "}
                    {filters.sortBy === "firstName" &&
                      (filters.sortOrder === "desc" ? (
                        <ArrowUp width={20} />
                      ) : (
                        <ArrowDown width={20} />
                      ))}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  onClick={() => handleSortChange("createdAt")}
                >
                  <div className="flex justify-between">
                    Date{" "}
                    {filters.sortBy === "createdAt" &&
                      (filters.sortOrder === "desc" ? (
                        <ArrowUp width={20} />
                      ) : (
                        <ArrowDown width={20} />
                      ))}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  onClick={() => handleSortChange("status")}
                >
                  <div className="flex justify-between">
                    Status{" "}
                    {filters.sortBy === "status" &&
                      (filters.sortOrder === "desc" ? (
                        <ArrowUp width={20} />
                      ) : (
                        <ArrowDown width={20} />
                      ))}
                  </div>
                </th>
                <th
                  className="text-right py-3 px-4 font-medium"
                  onClick={() => handleSortChange("items")}
                >
                  <div className="flex justify-between">
                    Items{" "}
                    {filters.sortBy === "items" &&
                      (filters.sortOrder === "desc" ? (
                        <ArrowUp width={20} />
                      ) : (
                        <ArrowDown width={20} />
                      ))}
                  </div>
                </th>
                <th
                  className="text-right py-3 px-4 font-medium"
                  onClick={() => handleSortChange("total")}
                >
                  <div className="flex justify-between">
                    Total{" "}
                    {filters.sortBy === "total" &&
                      (filters.sortOrder === "desc" ? (
                        <ArrowUp width={20} />
                      ) : (
                        <ArrowDown width={20} />
                      ))}
                  </div>
                </th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders?.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="py-3 px-4 font-medium">
                      {"ORD-" + String(order.id).padStart(5, "0")}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">
                          {order.isGuest
                            ? order.guestFirstName + " " + order.guestLastName
                            : order.user?.firstName +
                              " " +
                              order.user?.lastName}
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
      {/* Pagination */}
      {orders?.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {orders?.length} of {total} orders
          </div>
          <div className="flex items-center space-x-2">
            {/* Pagination controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              {/* Page numbers */}
              <div className="flex items-center">
                {getPageNumbers().map((page, index) =>
                  page === "ellipsis" ? (
                    <div key={`ellipsis-${index}`} className="px-2">
                      ...
                    </div>
                  ) : (
                    <Button
                      key={`page-${page}`}
                      variant={filters.page === page ? "default" : "outline"}
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handlePageChange(Number(page))}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
