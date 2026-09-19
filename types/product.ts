export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export type TechCategory =
  | "all"
  | "smartphones"
  | "laptops"
  | "audio"
  | "accessories";

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product extends FakeStoreProduct {
  techCategory: TechCategory;
  brand: string;
  badge?: "Flagship" | "New" | "Hot" | "Best Seller" | "Limited";
  specs: ProductSpecification[];
  stock: number;
  originalPrice?: number;
  colors?: string[];
  features?: string[];
  gallery?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus =
  | "Order Placed"
  | "Processing"
  | "Dispatched"
  | "In Transit"
  | "Delivered";

export interface OrderItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  fakeStoreOrderId?: number;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: "credit-card" | "apple-pay" | "crypto" | "cod";
  trackingNumber: string;
  estimatedDelivery: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    completed: boolean;
    description: string;
  }[];
}
