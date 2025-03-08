import { Badge } from "../components/ui/badge";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";

import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import FeaturedProducts from "../components/home/FeaturedProducts";
import { Link, useParams } from "react-router";
import { showToast } from "../components/ui/showToast";
import { ProductService } from "../services/product-service";
import { Product } from "../types/api";

export default function ProductContent() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product>();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to top when id changes
    const getProduct = async () => {
      try {
        const data = await ProductService.getProductById(id || "");
        if (data.status) {
          setProduct(data.product);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, [id]);

  // Get unique sizes and colors from variants
  const allSizes = Array.from(new Set(product?.variants?.map((v) => v.size)));
  const allColors = Array.from(
    new Set(
      product?.variants?.map((v) =>
        JSON.stringify({ color: v.color.name, hex: v.color.hex })
      )
    )
  ).map((c) => JSON.parse(c));

  // Get filtered sizes and colors based on selection
  const availableSizes = selectedColor
    ? Array.from(
        new Set(
          product?.variants
            .filter((v) => v.color.name === selectedColor)
            .map((v) => v.size)
        )
      )
    : allSizes;

  const availableColors = selectedSize
    ? Array.from(
        new Set(
          product?.variants
            .filter((v) => v.size === selectedSize)
            .map((v) =>
              JSON.stringify({ color: v.color.name, hex: v.color.hex })
            )
        )
      ).map((c) => JSON.parse(c))
    : allColors;

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
    setQuantity(1)
    if (
      selectedColor &&
      !product?.variants.some(
        (v) => v.size === size && v.color.name === selectedColor
      )
    ) {
      setSelectedColor(null); // Reset color if not available for selected size
    }
  };

  const handleColorClick = (color: string) => {
    setSelectedColor(color);
    setQuantity(1)
    if (
      selectedSize &&
      !product?.variants.some(
        (v) => v.color.name === color && v.size === selectedSize
      )
    ) {
      setSelectedSize(null); // Reset size if not available for selected color
    }
  };
  const getSelectedVariant = () => {
    return product?.variants.find(
      (variant) =>
        variant.size === selectedSize && variant.color.name === selectedColor
    );
  };

  const incrementQuantity = () => {
    const selectedVariant = getSelectedVariant();
    if (selectedVariant && quantity < selectedVariant.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    if (!selectedSize || !selectedColor) {
      showToast({
        title: "Please select a size and color",
        type: "error",
      });
      return;
    }
    console.log(getSelectedVariant()?.id);

    showToast({
      title: "Added to cart",
      description: `${product?.name} (${selectedSize}, ${selectedColor}) x ${quantity} has been added to your cart.`,
    });
  };

  return (
    <main className="container py-8">
      <div className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/products" className="hover:text-foreground">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product?.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg">
            <img
              src={product?.imageUrl || "/placeholder.svg"}
              alt={product?.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product?.images?.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg border">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product?.name} - View ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {product?.inNew && <Badge>New Arrival</Badge>}
          <h1 className="text-3xl font-bold">{product?.name}</h1>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product?.rating || 0)
                      ? "fill-primary text-primary"
                      : i < (product?.rating || 0)
                      ? "fill-primary/50 text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product?.reviewCount} reviews)
            </span>
          </div>

          <div className="text-2xl font-bold">${product?.price}</div>

          <p className="text-muted-foreground">{product?.description}</p>
          {/* Size Selection */}
          <div>
            <h3 className="mb-2 font-medium">Size</h3>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  className={`min-w-[60px] ${
                    availableSizes.includes(size)
                      ? ""
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    availableSizes.includes(size) && handleSizeClick(size)
                  }
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="mb-2 font-medium">Color</h3>
            <div className="flex flex-wrap gap-2">
              {allColors.map((color) => (
                <Button
                  key={color.color}
                  variant="outline"
                  className={`h-10 w-10 rounded-full p-0 ${
                    selectedColor === color.color
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  } ${
                    availableColors.some((c) => c.color === color.color)
                      ? ""
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() =>
                    availableColors.some((c) => c.color === color.color) &&
                    handleColorClick(color.color)
                  }
                >
                  <span className="sr-only">{color.color}</span>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1" onClick={addToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="sr-only">Add to favorites</span>
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share product</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details & Care</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-4">
            <div className="space-y-4">
              <p>
                This classic white t-shirt is a wardrobe essential. Made from
                100% organic cotton, it offers exceptional comfort and
                durability for everyday wear. The relaxed fit and soft fabric
                make it perfect for casual outings or lounging at home.
              </p>
              <p>
                The versatile design allows for easy styling with jeans, shorts,
                or under a jacket for a more polished look. Available in
                multiple sizes and colors to suit your personal style.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="details" className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Materials</h3>
                <p className="text-muted-foreground">100% Organic Cotton</p>
              </div>
              <div>
                <h3 className="font-medium">Care Instructions</h3>
                <ul className="list-inside list-disc text-muted-foreground">
                  <li>Machine wash cold with similar colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">Shipping & Returns</h3>
                <p className="text-muted-foreground">
                  Free shipping on orders over $50. Returns accepted within 30
                  days of delivery.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product?.rating || 0)
                              ? "fill-primary text-primary"
                              : i < (product?.rating || 0)
                              ? "fill-primary/50 text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span>Based on {product?.reviewCount} reviews</span>
                  </div>
                </div>
                <Button>Write a Review</Button>
              </div>

              <div className="space-y-4">
                {/* Sample reviews */}
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 5
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">Perfect fit!</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This t-shirt is exactly what I was looking for. The material
                    is soft and comfortable, and the fit is perfect.
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    John D. - 2 weeks ago
                  </div>
                </div>

                <div className="border-b pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">Great quality</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The quality of this shirt is excellent. It's held up well
                    after several washes and still looks brand new.
                  </p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Sarah M. - 1 month ago
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <FeaturedProducts />
      </div>
    </main>
  );
}
