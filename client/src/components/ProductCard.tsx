import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { showToast } from "./ui/showToast";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router";
import { Product } from "../types/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog";

export default function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState<number>(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    setIsDialogOpen(true);
  };
  
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

  const confirmAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      showToast({
        title: "Selection Required",
        description: "Please choose a size and color before adding to cart.",
        type: "error",
      });
      return;
    }

    showToast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}, ${selectedColor}) has been added to your cart.`,
      type: "success",
    });

    setIsDialogOpen(false);
  };

  return (
    <Card key={product.id} className="overflow-hidden group">
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => toggleFavorite(product.id)}
        >
          <Heart
            className={`h-5 w-5 ${
              favorites.includes(product.id) ? "fill-red-500 text-red-500" : ""
            }`}
          />
          <span className="sr-only">Add to favorites</span>
        </Button>
        {product.inNew && <Badge className="absolute top-2 left-2">New</Badge>}
        {product.salePrice && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Sale
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <Link to={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-medium">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-center">
          {product.salePrice ? (
            <>
              <span className="text-lg font-bold">${product.salePrice}</span>
              <span className="ml-2 text-sm text-muted-foreground line-through">
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">${product.price}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>

      {/* Dialog for selecting size & color */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Size & Color</DialogTitle>
            <DialogDescription>Choose options before adding to the cart.</DialogDescription>
          </DialogHeader>

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

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={confirmAddToCart}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
