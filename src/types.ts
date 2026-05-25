export interface FoodItem {
  id: string;
  name: string;
  subName: string;
  rating: number;
  reviewsCount: number;
  deliveryTime: string;
  price: number;
  image: string;
  ingredients: string;
  category: string;
  isAvailable?: boolean;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  sender: "customer" | "rider" | "restaurant" | "system";
  text: string;
  time: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  commissionFee: number;
  couponCode: string | null;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: "card" | "paypal" | "wallet" | "upi" | "cod";
  status: "placed" | "accepted" | "preparing" | "ready" | "out-for-delivery" | "delivered" | "cancelled";
  address: string;
  customerName: string;
  customerPhone: string;
  timestamp: string;
  riderAssigned: string | null;
  chatMessages: ChatMessage[];
  riderRouteProgress: number; // 0 to 100 for live animation
}

export interface PlatformConfig {
  commissionRate: number; // e.g. 15%
  baseDeliveryFee: number; // e.g. $2.00
  enableAiRecommender: boolean;
  platformName: string;
  darkMode: boolean;
}

export interface RiderState {
  isOnline: boolean;
  name: string;
  phone: string;
  vehicle: string;
  walletBalance: number;
  rating: number;
}
