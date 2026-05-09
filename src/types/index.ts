// ============================================================
// AGRILIEN — Types TypeScript
// ============================================================

export type UserRole = 'acheteur' | 'acheteur_pro' | 'producteur' | 'admin';

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  phone: string;
  role: UserRole;
  photo: string;
  city: string;
  region: string;
  createdAt: string;
}

export interface BuyerProfile extends User {
  role: 'acheteur' | 'acheteur_pro';
  isPro: boolean;
  ninea?: string;
  addresses: Address[];
  favorites: string[];
}

export interface ProducerProfile extends User {
  role: 'producteur';
  farmName: string;
  farmSize: string;
  specialties: string[];
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  balance: number;
  memberSince: string;
  lat?: number;
  lng?: number;
}

export interface AdminProfile extends User {
  role: 'admin';
  isSuperAdmin: boolean;
}

export interface ProducerRequest {
  id: string;
  userId: string;
  userName: string;
  farmName: string;
  region: string;
  specialties: string;
  status: 'en_attente' | 'approuve' | 'rejete';
  createdAt: string;
}

export interface Tender {
  id: string;
  buyerName: string;
  buyerCompany: string;
  product: string;
  quantity: number;
  unit: string;
  maxBudget: number;
  deadline: string;
  deliveryLocation: string;
  description: string;
  status: 'ouvert' | 'attribue' | 'expire' | 'fermé';
  bidsCount: number;
  createdAt: string;
}

export interface TenderBid {
  id: string;
  tenderId: string;
  producerName: string;
  pricePerUnit: number;
  availableQuantity: number;
  message: string;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  region: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  promoEndDate?: string;
  unit: string;
  currency: string;
  stock: number;
  description: string;
  images: string[];
  producerId: string;
  producerName: string;
  farmName: string;
  region: string;
  city: string;
  status: 'en_vente' | 'en_rupture' | 'brouillon';
  isAvailable: boolean;
  isLowStock: boolean;
  isOrganic: boolean;
  delivery: boolean;
  freeDelivery: boolean;
  rating: number;
  reviewCount: number;
  views: number;
  createdAt: string;
  isPreorder?: boolean;
  harvestDate?: string;
  minProOrderQuantity?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'en_attente' | 'confirmee' | 'en_preparation' | 'expediee' | 'livree' | 'annulee';
  paymentMethod: string;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'wave' | 'orange_money' | 'carte' | 'livraison';
  status: 'en_attente' | 'complete' | 'echoue';
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  producerId: string;
  amount: number;
  method: string;
  status: 'en_attente' | 'traite' | 'refuse';
  createdAt: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  orderId: string;
  subject: string;
  message: string;
  status: 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
  priority: 'basse' | 'moyenne' | 'haute' | 'urgente';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'commande' | 'paiement' | 'stock' | 'message' | 'reclamation' | 'systeme';
  isRead: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalProducers: number;
  totalBuyers: number;
  totalOrders: number;
  totalSales: number;
  totalCommissions: number;
  conversionRate: number;
  averageCart: number;
  deliveryOnTime: number;
  satisfactionRate: number;
}

export interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  totalSales: number;
  totalOrders: number;
  quantity: string;
}

export interface RegionSales {
  region: string;
  sales: number;
  percentage: number;
}

export interface ActivityItem {
  id: string;
  message: string;
  time: string;
  type: 'user' | 'order' | 'payment' | 'product' | 'complaint';
}

export interface AlertItem {
  id: string;
  label: string;
  count: number;
  type: 'warning' | 'danger' | 'info';
}
