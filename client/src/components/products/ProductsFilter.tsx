import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { Color, ProductFilters } from "../../types/api";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import ProductsSearch from "./ProductSearch";
import { ProductService } from "../../services/product-service";

interface ProductsFilterProps {
  initialFilters: ProductFilters;
}

export default function ProductsFilter({
  initialFilters,
}: ProductsFilterProps) {
  const [minPrice, setMinPrice] = useState(
    initialFilters.minPrice?.toString() || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    initialFilters.maxPrice?.toString() || ""
  );
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<Color[]>(
    initialFilters.colors
      ? initialFilters.colors.split(",").map((color) => {
          const [name, hex] = color.split("|"); // Assuming color format is "name|hex"
          return { name, hex };
        })
      : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialFilters.sizes?.split(",") || []
  );
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const getFilters = async () => {
      try {
        const data = await ProductService.getFilters();
        if (data.status) {
          setColors(data.colors);
          setSizes(data.sizes);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getFilters();
  }, []);

  // Toggle size selection
  const handleSizeClick = (size: string) => {
    setSelectedSizes(
      (prev) =>
        prev.includes(size)
          ? prev.filter((s) => s !== size) // Remove if already selected
          : [...prev, size] // Add if not selected
    );
  };

  const handleColorClick = (color: Color) => {
    setSelectedColors(
      (prev) =>
        prev.some((c) => c.name === color.name)
          ? prev.filter((c) => c.name !== color.name) // Remove if already selected
          : [...prev, color] // Add if not selected
    );
  };

  const applyFilters = () => {
    // Create a new URLSearchParams object based on the current search params
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove price filters
    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    // Add selected sizes
    if (selectedSizes.length > 0) {
      params.set("sizes", selectedSizes.join(",")); // Convert array to CSV format
    } else {
      params.delete("sizes");
    }

    // Add selected colors (store name & hex as "name|hex")
    if (selectedColors.length > 0) {
      params.set(
        "colors",
        selectedColors.map((c) => `${c.name}|${c.hex}`).join(",")
      );
    } else {
      params.delete("colors");
    }

    // Reset to page 1 when filtering
    params.set("page", "1");

    // Navigate to the same page but with updated search params
    navigate(`${pathname}?${params.toString()}`);
  };

  const setCategory = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    params.set("page", "1");
    navigate(`${pathname}?${params.toString()}`);
  };

  const isActiveCategory = (category: string | null) => {
    return initialFilters.category === category;
  };

  return (
    <div className="hidden md:block space-y-6">
      <ProductsSearch initialQuery={initialFilters.search} />

      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <div className="space-y-2">
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              setCategory(null);
            }}
            className={`block ${
              isActiveCategory(null)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Products
          </Link>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              setCategory("men");
            }}
            className={`block ${
              isActiveCategory("men")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Men
          </Link>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              setCategory("women");
            }}
            className={`block ${
              isActiveCategory("women")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Women
          </Link>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              setCategory("accessories");
            }}
            className={`block ${
              isActiveCategory("accessories")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Accessories
          </Link>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Other filter sections remain the same */}
      {/* Size Selection */}
      <div>
        <h3 className="mb-2 font-medium">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              className={`min-w-[60px]`}
              onClick={() => handleSizeClick(size)}
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
          {colors.map((color) => (
            <Button
              key={color.name}
              variant={
                selectedColors.some((c) => c.name === color.name)
                  ? "default"
                  : "outline"
              }
              className={`h-10 w-10 rounded-full p-0 ${
                selectedColors.some((c) => c.name === color.name)
                  ? "ring-2 ring-primary ring-offset-2"
                  : ""
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => handleColorClick(color)}
            >
              <span className="sr-only">{color.name}</span>
            </Button>
          ))}
        </div>
      </div>
      <Button className="mt-4 w-full" onClick={applyFilters}>
        Apply Filters
      </Button>
    </div>
  );
}
