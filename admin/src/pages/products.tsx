import { useState, useEffect, useMemo } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useToast } from "../components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ProductService } from "@/services/product-service";
import { Product } from "@/types/api";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock categories
  const categories = [
    "Dresses",
    "Shirts",
    "Pants",
    "Jackets",
    "Accessories",
    "Shoes",
    "Sportswear",
    "Formal Wear",
  ];
  const [total, setTotal] = useState(0);

  const [searchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      category: searchParams.get("category") || "all",
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || "all",
      sizes: searchParams.get("sizes") || undefined,
      colors: searchParams.get("colors") || undefined,
      sortBy:
        (searchParams.get("sortBy") as "price" | "createdAt" | "popular") ||
        "createdAt",
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page") || "1", 10)
        : 1,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit") || "10", 10)
        : 10,
      minPrice: searchParams.get("minPrice")
        ? Number.parseInt(searchParams.get("minPrice") as string, 10)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number.parseInt(searchParams.get("maxPrice") as string, 10)
        : undefined,
    }),
    [searchParams]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getProducts(filters);
        if (data.status) {
          setProducts(data.products);
          setTotal(data.total);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const totalPages = Math.ceil(total / filters.limit);

  // const handleSortChange = (value: string) => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.set("sortBy", value);
  //   setSearchParams(params);
  //   navigate(`${pathname}?${params.toString()}`);
  // };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    navigate(`${pathname}?${params.toString()}`);
  };

  const handleLimitChange = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", limit.toString());
    params.set("page", "1");
    navigate(`${pathname}?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    params.set("page", "1");
    navigate(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    params.set("page", "1");
    navigate(`${pathname}?${params.toString()}`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      // In a real app, you would make an API call to delete the product
      const data = await ProductService.deleteProduct(productToDelete);

      // For demo purposes, we'll just update the state
      if (data.status) {
        toast({
          title: "Product deleted",
          description: "The product has been successfully deleted.",
        });
        setProducts(
          products.filter((product) => product.id !== productToDelete)
        );

        setProductToDelete(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the product. Please try again.",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the product. Please try again.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Pagination states
  // Generate page numbers array for pagination
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
      case "active":
        return "success";
      case "draft":
        return "secondary";
      case "archived":
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
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button asChild>
          <Link to="/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all"}>All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
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

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 font-medium">Product</th>
                <th className="text-left py-3 px-4 font-medium">Category</th>
                <th className="text-right py-3 px-4 font-medium">Price</th>
                <th className="text-right py-3 px-4 font-medium">Stock</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr key={product.id} className="border-t">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.mainImage instanceof File
                              ? URL.createObjectURL(product.mainImage) // If image is a File, create a temporary URL
                              : product.mainImage.url || "/placeholder.svg" // If image is a URL string, use it; otherwise, use the placeholder
                          }
                          alt={`Product ${index + 1}`}
                          className=" w-20 h-16 object-cover"
                        />
                        <span className="font-medium ">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{product.category?.name}</td>
                    <td className="text-right py-3 px-4">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="text-right py-3 px-4">
                      {product.variants.reduce(
                        (sum, variant) => sum + variant.quantity,
                        0
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={getStatusBadgeVariant(product.status) as any}
                      >
                        {product.status.charAt(0).toUpperCase() +
                          product.status.slice(1)}
                      </Badge>
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
                            <Link to={`/products/${product.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/products/${product.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteProduct(product.id || "")
                            }
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
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
      {products.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {products.length} of {total} products
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
