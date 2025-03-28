// Product types
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: string;
  status: string;
  salePrice: string;
  category: category;
  categoryId: string;
  mainImage: Image | File;
  mainImageId: string;
  images: (Image | File)[];
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  reviewCount?: number;
  inNew?: boolean;
  isFeatured?: boolean;
  variants: variant[];
}
export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  status: string;
  salePrice?: number;
  category: string;
  images: (Image | File)[];
  mainImage: Image | File;
  variants: variant[];
}

export interface Image {
  id?: string;
  url: string;
  public_id: string;
}

export interface category {
  id?: string;
  name?: string;
}

export interface variant {
  id: string;
  color: Color;
  size: string;
  quantity: number;
  product?: Product;
  productId?: string;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface ProductsResponse {
  products: Product[];
  status: string;
  message: string;
  total: number;
}

export interface TopProductsResponse {
  name: string;
  sales: number;
  revenue: number;
}

export interface FiltersResponse {
  colors: Color[];
  status: string;
  message: string;
  sizes: string[];
}

export interface ProductResponse {
  product: Product;
  status: string;
}

export interface ProductFilters {
  categoryName?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sizes?: string;
  colors?: string;
  sortBy?: "price" | "createdAt" | "categoryName" | "name" | "quantity" | "status";
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
  default?: string | null;
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
export interface OrderResponse {
  status: boolean;
  message: string;
  order: Order;
}
export interface CustomersResponse {
  status: boolean;
  message: string;
  customers: Customer[];
  total: number;
}
export interface CustomerResponse {
  status: boolean;
  message: string;
  customer: Customer;
}
export interface ChartsResponse {
  revenueData: { name: string; value: number }[];
  ordersData: { name: string; value: number }[];
}
export interface StatsResponse {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  trends: {
    totalRevenue: { trend: "up" | "down"; trendValue: number };
    totalOrders: { trend: "up" | "down"; trendValue: number };
    totalProducts: { trend: "up" | "down"; trendValue: number };
    totalCustomers: { trend: "up" | "down"; trendValue: number };
  };
}
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lastOrderDate: Date;
  isGuest: boolean;
  orders: number;
  totalSpent: number;
  address: Address;
  recentOrders: Order[];
  joinDate: string;
}

export interface OrdersResponse {
  status: boolean;
  message: string;
  orders: Order[];
  total: number;
}

export interface Address {
  id?: string;
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
  id?: string;
  userId?: string;
  user?: User;
  guestFirstName?: string;
  guestLastName?: string;
  guestPhone?: string;
  guestEmail?: string;
  items: OrderItem[];
  isGuest: boolean;
  total: string;
  paymentMethod: "CREDIT" | "PAYPAL" | "GOOGLEPAY" | "APPLEPAY" | "COD";
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  notes?: string;
  status?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress?: Address | undefined;
  addressId?: String;
  createdAt?: string;
  updatedAt?: string;
  quantity?: number;
}

export interface OrderItem {
  id: string;
  variantId: string;
  variant: variant;
  quantity: number;
}

// Cart types
export type CartResponse = {
  status: boolean;
  message?: string;
  cart?: Cart;
};

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  variantId: string;
  variant: variant;
  quantity: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
