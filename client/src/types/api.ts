// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  salePrice: string;
  status: string;
  category?: category;
  categoryId?: string;
  images: Image[];
  mainImage: Image;
  createdAt?: string;
  updatedAt?: string;
  rating: number;
  reviewCount: number;
  inNew: boolean;
  isFeatured: boolean;
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
  product: Product;
  productId: string;
}

export interface Color {
  name: string;
  hex: string;
}

export interface ProductsResponse {
  products: Product[];
  status: string;
  message: string;
  total: number;
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
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sizes?: string;
  colors?: string;
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
export interface OrdersResponse {
  status: boolean;
  message: string;
  orders: Order[];
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
