import apiClient from "../lib/apiClient";
import type {
  CreateProduct,
  FiltersResponse,
  ProductFilters,
  ProductResponse,
  ProductsResponse,
} from "../types/api";

export const ProductService = {
  // Get products with filtering, pagination, and sorting
  async createProduct(product: CreateProduct): Promise<ProductResponse> {
    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        // Append each image separately
        value.forEach((file) => formData.append("images", file)); // "images" should match your multer field name
      } else if (key === "variants" && Array.isArray(value)) {
        // Convert variants array to JSON string
        formData.append("variants", JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const { data } = await apiClient.post("/products", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
  async updateProduct(
    product: CreateProduct,
    id: string
  ): Promise<ProductResponse> {
    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        // Append each image separately
        value.forEach((file) =>
          file instanceof File
            ? formData.append("newImages", file)
            : formData.append("oldImages", JSON.stringify(file))
        ); // "images" should match your multer field name
      } else if (key === "mainImage") {
        // Append each image separately
        value instanceof File && formData.append("mainImage", value);
        // "images" should match your multer field name
      } else if (key === "variants" && Array.isArray(value)) {
        // Convert variants array to JSON string
        formData.append("variants", JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const { data } = await apiClient.put(`/products/${id}`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const { data } = await apiClient.get("/products", { params: filters });
    return data;
  },

  async getFeaturedProducts(): Promise<ProductsResponse> {
    const { data } = await apiClient.get("/products/featured");
    return data;
  },

  async getFilters(): Promise<FiltersResponse> {
    const { data } = await apiClient.get("/products/filters");
    return data;
  },

  // Get a single product by ID
  async getProductById(id: string): Promise<ProductResponse> {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },

  // Get a single product by ID
  async deleteProduct(id: string): Promise<ProductResponse> {
    const { data } = await apiClient.delete(`/products/${id}`, {
      withCredentials: true,
    });
    return data;
  },

  // Get products by category
  async getProductsByCategory(
    category: string,
    filters: Omit<ProductFilters, "category"> = {}
  ): Promise<ProductsResponse> {
    return this.getProducts({ ...filters, category });
  },

  // Search products
  async searchProducts(
    query: string,
    filters: Omit<ProductFilters, "search"> = {}
  ): Promise<ProductsResponse> {
    return this.getProducts({ ...filters, search: query });
  },
};
