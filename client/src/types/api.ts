// Product types
export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category?: string;
  imageUrl?: string;
  images?: string[];
  inventory?: number;
  sizes: string[];
  colors: { name: string; value: string; hex: string }[];
  createdAt?: string;
  updatedAt?: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isSale: boolean;
}

export interface ProductsResponse {
  products: Product[];
  status: string;
  total: number;
  page: number;
  pages: number;
}

export interface ProductResponse {
  product: Product;
  status: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price" | "createdAt" | "popular";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "user" | "admin";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  status: boolean;
  message: string;
}

export interface AddressResponse {
  status: boolean;
  message: string;
  address: Address;
  default?: string | null
}

export interface AddressesResponse {
  status: boolean;
  message: string;
  addresses: Address[];
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ProfileRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface PasswordRequest {
  currentPassword: string;
  newPassword: string;
}
export interface NormalResponse {
  status: boolean;
  message: string;
}

export interface Address {
  id: string;
  userId?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
