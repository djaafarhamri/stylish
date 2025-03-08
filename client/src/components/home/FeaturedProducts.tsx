import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import { Product } from "../../types/api";
import { ProductService } from "../../services/product-service";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await ProductService.getFeaturedProducts();
        if (data.status) {
          setProducts(data.products);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProducts()
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, i) => (
        <ProductCard key={i} product={product} />
      ))}
    </div>
  );
}
