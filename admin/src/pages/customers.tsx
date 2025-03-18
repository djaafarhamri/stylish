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
  Mail,
  ChevronRight,
  ChevronLeft,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { OrderService } from "@/services/order-service";
import { Customer } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams] = useSearchParams();
  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || undefined,
      sortBy:
        (searchParams.get("sortBy") as
          | "orders"
          | "lastOrder"
          | "totalSpent"
          | "id"
          | "name"
          | "status") || "lastOrder",
      sortOrder: (searchParams.get("sortOrder") as "desc" | "asc") || "asc",
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page") || "1", 10)
        : 1,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit") || "10", 10)
        : 10,
    }),
    [searchParams]
  );

  useEffect(() => {
    // Simulate API call to fetch customers
    const fetchCustomers = async () => {
      try {
        const data = await OrderService.getCustomers(filters);
        setCustomers(data.customers);
        setTotal(data.total);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setIsLoading(false);
      }
    };

    fetchCustomers();
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
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleSearchChange}>Search</Button>
        <div className="flex gap-2">
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

      {/* Customers Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th
                  className="text-left py-3 px-4 font-medium"
                  onClick={() => handleSortChange("name")}
                >
                  <div className="flex justify-between">
                    Customer{" "}
                    {filters.sortBy === "name" &&
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
                  onClick={() => handleSortChange("orders")}
                >
                  <div className="flex justify-between">
                    Orders{" "}
                    {filters.sortBy === "orders" &&
                      (filters.sortOrder === "desc" ? (
                        <ArrowUp width={20} />
                      ) : (
                        <ArrowDown width={20} />
                      ))}
                  </div>
                </th>
                <th
                  className="text-right py-3 px-4 font-medium"
                  onClick={() => handleSortChange("totalSpent")}
                >
                  <div className="flex justify-between">
                    Total Spent{" "}
                    {filters.sortBy === "totalSpent" &&
                      (filters.sortOrder === "desc" ? (
                        <ArrowUp width={20} />
                      ) : (
                        <ArrowDown width={20} />
                      ))}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  onClick={() => handleSortChange("lastOrder")}
                >
                  <div className="flex justify-between">
                    Last Order{" "}
                    {filters.sortBy === "lastOrder" &&
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
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-t">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {customer.firstName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={customer.isGuest ? "secondary" : "success"}
                      >
                        {customer.isGuest ? "Guest" : "User"}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4">{customer.orders}</td>
                    <td className="text-right py-3 px-4 font-medium">
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(
                        customer.lastOrderDate || Date.now()
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
                            <Link to={`/customers/${customer.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`mailto:${customer.email}`}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </a>
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
      {customers.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {customers.length} of {total} customers
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
