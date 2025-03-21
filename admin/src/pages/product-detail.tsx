import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash,
  Save,
  X,
  Plus,
  ImageIcon,
  Pencil,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { ProductService } from "@/services/product-service";
import { Color, Image, ProductResponse } from "@/types/api";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import ImageGallery from "@/components/products/ImageGellery";

const productFormSchema = z.object({
  id: z.string().optional(), // Optional since it's usually generated by the database
  name: z.string().min(2, { message: "Product name is required" }),
  description: z.string().min(2, { message: "Description is required" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  salePrice: z.number().min(0).optional(),
  status: z.string().min(3, { message: "Status is required" }),
  category: z.string().min(3, { message: "Category is required" }),
  images: z
    .array(
      z.union([
        z.object({
          url: z.string(),
          public_id: z.string(),
        }),
        z.instanceof(File),
      ])
    )
    .min(1, { message: "At least one image is required" }),
  mainImage: z.union(
    [
      z.object({
        url: z.string(),
        public_id: z.string(),
      }),
      z.instanceof(File),
    ],
    { message: "Main image is required" }
  ),

  variants: z
    .array(
      z.object({
        id: z.string(),
        color: z.object({
          name: z.string().min(2, { message: "Color name is required" }),
          id: z.string(),
          hex: z.string().min(2, { message: "Color hex is required" }),
        }),
        size: z.string().min(1, { message: "Size is required" }),
        quantity: z.number().min(1, { message: "Quantity is required" }),
      })
    )
    .min(1, { message: "At least one variant is required" }),
});

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(id === "new");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      price: 0,
      salePrice: 0,
      status: "",
      category: "",
      images: [],
      variants: [],
    },
  });
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

  useEffect(() => {
    // Simulate API call to fetch product details
    const fetchProduct = async () => {
      try {
        const data = await ProductService.getProductById(id || "");
        if (data.status) {
          form.setValue("id", data.product.id);
          form.setValue("name", data.product.name);
          form.setValue("description", data.product.description);
          form.setValue("price", parseFloat(data.product.price));
          form.setValue(
            "salePrice",
            data.product.salePrice ? parseFloat(data.product.salePrice) : 0
          );
          form.setValue("status", data.product.status);
          form.setValue("category", data.product.category?.name || "");
          form.setValue("images", data.product.images);
          form.setValue("mainImage", data.product.mainImage);
          form.setValue("variants", data.product.variants);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    if (id !== "new") {
      fetchProduct();
    }
    setIsLoading(false);
  }, [id]);

  const handleSaveProduct = async (data: z.infer<typeof productFormSchema>) => {
    setIsSaving(true);

    try {
      let res: ProductResponse;
      if (id === "new") {
        res = await ProductService.createProduct(data);
      } else {
        res = await ProductService.updateProduct(data, id || "");
      }
      if (res.status) {
        toast({
          title: id === "new" ? "Product created" : "Product updated",
          description: `${data?.name} has been ${
            id === "new" ? "created" : "updated"
          } successfully.`,
        });

        navigate("/products");
        return;
      }
      setIsEditing(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${
          id === "new" ? "create" : "update"
        } the product. Please try again.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${
          id === "new" ? "create" : "update"
        } the product. Please try again.`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (id === "new") return;

    try {
      const data = await ProductService.deleteProduct(id || "");

      if (data.status) {
        toast({
          title: "Product deleted",
          description: "The product has been successfully deleted.",
        });
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
      navigate("/products");
      setIsDeleteDialogOpen(false);
    }
  };

  const addVariant = () => {
    const variants = form.getValues("variants");
    form.setValue("variants", [
      ...variants,
      {
        id: Date.now().toString(),
        color: { name: "", id: "", hex: "" },
        size: "",
        quantity: 1,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    const variants = form.getValues("variants");
    form.setValue(
      "variants",
      variants.filter((_, i) => i !== index)
    );
  };

  const [colors, setColors] = useState<Color[]>([]);

  useEffect(() => {
    const getColors = async () => {
      const data = await ProductService.getFilters();
      if (data.status) setColors(data.colors);
    };
    getColors();
  }, []);


  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const errors = form.formState.errors;

    if (
      errors.name ||
      errors.category ||
      errors.price ||
      errors.status ||
      errors.description
    ) {
      setActiveTab("details");
    } else if (errors.images) {
      setActiveTab("images");
    } else if (errors.variants) {
      setActiveTab("variants");
    }
  }, [form.formState.errors]); // Runs when errors change
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (id !== "new" && !form.watch("id")) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The product you're looking for doesn't exist.
        </p>
        <Button asChild>
          <a href="/products">Back to Products</a>
        </Button>
      </div>
    );
  }

  const submit = (data: z.infer<typeof productFormSchema>) => {
    if (id === "new") {
      handleSaveProduct(data);
    } else if (isEditing) {
      handleSaveProduct(data);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          onError={(errors) => {
            console.error("Validation errors:", errors); // Log validation errors
          }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => navigate("/products")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">
                {id === "new" ? "Add New Product" : form.watch("name")}
              </h1>
            </div>
            <div className="flex gap-2">
              {!isEditing && id !== "new" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      if (id === "new") {
                        navigate("/products");
                      } else {
                        setIsEditing(false);
                      }
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            placeholder="name"
                            disabled={!isEditing || field.disabled}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!isEditing || field.disabled}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            placeholder="price"
                            type="number"
                            disabled={!isEditing || field.disabled}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                            value={field.value}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={product.quantity}
                onChange={(e) =>
                  handleInputChange("quantity", Number.parseInt(e.target.value))
                }
                disabled={!isEditing}
              />
            </div> */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statu</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!isEditing || field.disabled}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Textarea
                          id="description"
                          {...field}
                          disabled={!isEditing || field.disabled}
                          rows={6}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="images" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="mainImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Image</FormLabel>
                      <FormControl>
                        {!form.watch("mainImage") ? (
                          <div className="relative border rounded-lg flex items-center justify-center h-64 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              multiple
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  field.onChange(e.target.files[0]); // Update form state with new file
                                }
                              }}
                            />
                            <div className="flex flex-col items-center text-muted-foreground">
                              <ImageIcon className="h-8 w-8 mb-2" />
                              <span>Add Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative border rounded-lg overflow-hidden cursor-move">
                            <img
                              src={
                                form.watch("mainImage") instanceof File
                                  ? URL.createObjectURL(
                                      form.watch("mainImage") as File
                                    )
                                  : (form.watch("mainImage") as Image).url ||
                                    "/placeholder.svg"
                              }
                              alt={`Product ${form.watch("name")}`}
                              className="w-full h-64 object-cover"
                            />
                            {isEditing && (
                              <div className="absolute top-2 right-2 flex gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      form.setValue(
                                        "mainImage",
                                        e.target.files[0]
                                      ); // Update form state with new file
                                    }
                                  }}
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="absolute top-2 right-2 cursor-pointer"
                                  asChild
                                >
                                  <label className="cursor-pointer">
                                    <Pencil className="h-4 w-4" />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                          form.setValue(
                                            "mainImage",
                                            e.target.files[0]
                                          ); // Update form state
                                        }
                                      }}
                                    />
                                  </label>
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                      <ImageGallery
                        images={field.value || []}
                        setImages={(newImages) => field.onChange(newImages)}
                        isEditing={isEditing}
                        removeImage={(index) => {
                          const updatedImages = field.value.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(updatedImages);
                        }}
                        handleFileUpload={(event) => {
                          const files = Array.from(event.target.files || []);
                          field.onChange([...field.value, ...files]);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="variants" className="pt-4">
              <div className="space-y-4">
                {form.watch("variants")?.length === 0 ? (
                  <div className="text-center py-8 border rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      No variants added yet.
                    </p>
                    {isEditing && (
                      <Button type="button" onClick={addVariant}>
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

                    {form.watch("variants")?.map((variant, index) => (
                      <div
                        key={variant.id || Date.now()}
                        className="grid grid-cols-12 gap-4 "
                      >
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name={`variants.${index}.color.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    onValueChange={(value) => {
                                      const selectedColor = colors.find(
                                        (c) => c.name === value
                                      );
                                      form.setValue(`variants.${index}.color`, {
                                        name: value,
                                        id: selectedColor?.id || "",
                                        hex: selectedColor?.hex || "",
                                      });
                                    }}
                                    disabled={!isEditing}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {colors.map((color) => (
                                        <SelectItem
                                          key={color?.id || Date.now()}
                                          value={color.name}
                                        >
                                          {color.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name={`variants.${index}.size`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name={`variants.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                    disabled={!isEditing}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-3">
                          {isEditing && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeVariant(index)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {isEditing && (
                      <Button type="button" onClick={addVariant}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variant
                      </Button>
                    )}
                  </>
                )}
              </div>
              {form.formState.errors.variants?.message && (
                <p className="text-red-500 text-sm mt-2">
                  {form.formState.errors.variants.message}
                </p>
              )}
            </TabsContent>
          </Tabs>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete "{form.watch("name")}"? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteProduct}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  );
}
