
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Trash, Save, X, Plus, ImageIcon } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { useToast } from "../components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  status: "active" | "draft" | "archived"
  images: string[]
  variants: {
    id: string
    color: string
    size: string
    stock: number
  }[]
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(id === "new")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Mock categories
  const categories = ["T-Shirts", "Jeans", "Hoodies", "Jackets", "Shoes", "Accessories"]

  useEffect(() => {
    if (id === "new") {
      // Create a new product template
      setProduct({
        id: "new",
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
        status: "draft",
        images: ["/placeholder.svg?height=300&width=300"],
        variants: [],
      })
      setIsLoading(false)
      return
    }

    // Simulate API call to fetch product details
    const fetchProduct = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // const response = await fetch(`http://localhost:3001/api/products/${id}`);
        // const data = await response.json();

        // For demo purposes, we'll use mock data
        setTimeout(() => {
          const mockProduct: Product = {
            id: id || "prod-1",
            name: "Sample Product",
            description:
              "This is a sample product description. It provides details about the product features, materials, and care instructions.",
            price: 49.99,
            category: "T-Shirts",
            stock: 25,
            status: "active",
            images: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
            variants: [
              { id: "var-1", color: "Black", size: "S", stock: 5 },
              { id: "var-2", color: "Black", size: "M", stock: 10 },
              { id: "var-3", color: "White", size: "S", stock: 3 },
              { id: "var-4", color: "White", size: "M", stock: 7 },
            ],
          }

          setProduct(mockProduct)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching product:", error)
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleSaveProduct = async () => {
    if (!product) return

    setIsSaving(true)

    try {
      // In a real app, you would make an API call to save the product
      // const response = await fetch(`http://localhost:3001/api/products/${id === 'new' ? '' : id}`, {
      //   method: id === 'new' ? 'POST' : 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(product),
      // });
      // const data = await response.json();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: id === "new" ? "Product created" : "Product updated",
        description: `${product.name} has been ${id === "new" ? "created" : "updated"} successfully.`,
      })

      if (id === "new") {
        navigate("/products")
      } else {
        setIsEditing(false)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${id === "new" ? "create" : "update"} the product. Please try again.`,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!product) return

    try {
      // In a real app, you would make an API call to delete the product
      // await fetch(`http://localhost:3001/api/products/${id}`, {
      //   method: 'DELETE',
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Product deleted",
        description: `${product.name} has been deleted successfully.`,
      })

      navigate("/products")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the product. Please try again.",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const handleInputChange = (field: keyof Product, value: any) => {
    if (!product) return

    setProduct({
      ...product,
      [field]: value,
    })
  }

  const addVariant = () => {
    if (!product) return

    const newVariant = {
      id: `var-${Date.now()}`,
      color: "",
      size: "",
      stock: 0,
    }

    setProduct({
      ...product,
      variants: [...product.variants, newVariant],
    })
  }

  const updateVariant = (index: number, field: string, value: any) => {
    if (!product) return

    const updatedVariants = [...product.variants]
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    }

    setProduct({
      ...product,
      variants: updatedVariants,
    })
  }

  const removeVariant = (index: number) => {
    if (!product) return

    const updatedVariants = [...product.variants]
    updatedVariants.splice(index, 1)

    setProduct({
      ...product,
      variants: updatedVariants,
    })
  }

  const addImage = () => {
    if (!product) return

    setProduct({
      ...product,
      images: [...product.images, "/placeholder.svg?height=300&width=300"],
    })
  }

  const removeImage = (index: number) => {
    if (!product) return

    const updatedImages = [...product.images]
    updatedImages.splice(index, 1)

    setProduct({
      ...product,
      images: updatedImages,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <a href="/products">Back to Products</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{id === "new" ? "Add New Product" : product.name}</h1>
        </div>
        <div className="flex gap-2">
          {!isEditing && id !== "new" ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  if (id === "new") {
                    navigate("/products")
                  } else {
                    setIsEditing(false)
                  }
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveProduct} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={product.category}
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={product.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={product.stock}
                onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={product.status}
                onValueChange={(value: any) => handleInputChange("status", value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={product.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={!isEditing}
              rows={6}
            />
          </div>
        </TabsContent>

        <TabsContent value="images" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
                {isEditing && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeImage(index)}
                    disabled={product.images.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {isEditing && (
              <div
                className="border rounded-lg flex items-center justify-center h-64 cursor-pointer"
                onClick={addImage}
              >
                <div className="flex flex-col items-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <span>Add Image</span>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="variants" className="pt-4">
          <div className="space-y-4">
            {product.variants.length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-muted-foreground mb-4">No variants added yet.</p>
                {isEditing && (
                  <Button onClick={addVariant}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-4 font-medium">
                  <div className="col-span-3">Color</div>
                  <div className="col-span-3">Size</div>
                  <div className="col-span-3">Stock</div>
                  <div className="col-span-3">Actions</div>
                </div>

                {product.variants.map((variant, index) => (
                  <div key={variant.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <Input
                        value={variant.color}
                        onChange={(e) => updateVariant(index, "color", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        value={variant.size}
                        onChange={(e) => updateVariant(index, "size", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, "stock", Number.parseInt(e.target.value))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-span-3">
                      {isEditing && (
                        <Button variant="destructive" size="sm" onClick={() => removeVariant(index)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {isEditing && (
                  <Button onClick={addVariant}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

