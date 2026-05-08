import { Order, AdminStats, SalesDataPoint, TopProduct, RegionSales, ActivityItem, AlertItem } from '@/types';

export const orders: Order[] = [
  {
    id: 'order-1',
    orderNumber: '#CMD-1258',
    buyerId: 'buyer-1',
    buyerName: 'Fatou Diop',
    items: [
      { productId: 'prod-4', productName: 'Tomates Roma', productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100', quantity: 5, unit: 'Kg', unitPrice: 450, total: 2250 },
      { productId: 'prod-1', productName: 'Mangues Kent', productImage: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100', quantity: 3, unit: 'Kg', unitPrice: 600, total: 1800 },
    ],
    subtotal: 11000,
    deliveryFee: 1000,
    total: 12000,
    status: 'en_attente',
    paymentMethod: 'wave',
    deliveryAddress: '12 Rue Carnot, Plateau, Dakar',
    createdAt: '2024-05-18T10:30:00',
    updatedAt: '2024-05-18T10:30:00',
  },
  {
    id: 'order-2',
    orderNumber: '#CMD-1257',
    buyerId: 'buyer-2',
    buyerName: 'Alpha Trading',
    items: [
      { productId: 'prod-5', productName: 'Maïs Séché', productImage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=100', quantity: 50, unit: 'Kg', unitPrice: 450, total: 22500 },
    ],
    subtotal: 25500,
    deliveryFee: 0,
    total: 25500,
    status: 'confirmee',
    paymentMethod: 'orange_money',
    deliveryAddress: 'Marché central, Thiès',
    createdAt: '2024-05-17T14:20:00',
    updatedAt: '2024-05-17T15:00:00',
  },
  {
    id: 'order-3',
    orderNumber: '#CMD-1256',
    buyerId: 'buyer-3',
    buyerName: 'Moustafa Fall',
    items: [
      { productId: 'prod-3', productName: 'Oignons Rosés', productImage: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=100', quantity: 10, unit: 'Kg', unitPrice: 500, total: 5000 },
      { productId: 'prod-11', productName: 'Chou Vert', productImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100', quantity: 5, unit: 'Kg', unitPrice: 300, total: 1500 },
    ],
    subtotal: 7500,
    deliveryFee: 0,
    total: 7500,
    status: 'en_preparation',
    paymentMethod: 'wave',
    deliveryAddress: 'Restaurant Le Saloum, Fatick',
    createdAt: '2024-05-16T09:45:00',
    updatedAt: '2024-05-17T08:00:00',
  },
  {
    id: 'order-4',
    orderNumber: '#CMD-1255',
    buyerId: 'buyer-4',
    buyerName: 'Aissatou Kane',
    items: [
      { productId: 'prod-8', productName: 'Miel Local', productImage: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=100', quantity: 2, unit: 'Kg', unitPrice: 3500, total: 7000 },
      { productId: 'prod-10', productName: 'Poulets Fermiers', productImage: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=100', quantity: 4, unit: 'unité', unitPrice: 3000, total: 12000 },
    ],
    subtotal: 16000,
    deliveryFee: 0,
    total: 16000,
    status: 'livree',
    paymentMethod: 'carte',
    deliveryAddress: 'Hôtel Kabrousse, Ziguinchor',
    createdAt: '2024-05-14T11:15:00',
    updatedAt: '2024-05-16T16:30:00',
  },
  {
    id: 'order-5',
    orderNumber: '#CMD-1254',
    buyerId: 'buyer-5',
    buyerName: 'Ba & Frères',
    items: [
      { productId: 'prod-2', productName: 'Riz Local Étuvé', productImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100', quantity: 100, unit: 'Kg', unitPrice: 700, total: 70000 },
    ],
    subtotal: 12500,
    deliveryFee: 0,
    total: 12500,
    status: 'livree',
    paymentMethod: 'orange_money',
    deliveryAddress: 'Entrepôt Ba, Kolda',
    createdAt: '2024-05-12T08:00:00',
    updatedAt: '2024-05-14T17:00:00',
  },
];

export const adminStats: AdminStats = {
  totalUsers: 12458,
  totalProducers: 2845,
  totalBuyers: 9613,
  totalOrders: 3674,
  totalSales: 24580000,
  totalCommissions: 1845000,
  conversionRate: 12.6,
  averageCart: 6690,
  deliveryOnTime: 95.3,
  satisfactionRate: 4.6,
};

export const salesData: SalesDataPoint[] = [
  { date: '1 mai', sales: 2800000, orders: 320 },
  { date: '6 mai', sales: 3200000, orders: 380 },
  { date: '11 mai', sales: 2900000, orders: 340 },
  { date: '16 mai', sales: 4850000, orders: 620 },
  { date: '21 mai', sales: 3800000, orders: 450 },
  { date: '26 mai', sales: 3500000, orders: 410 },
  { date: '31 mai', sales: 3900000, orders: 480 },
];

export const topProducts: TopProduct[] = [
  { id: 'prod-2', name: 'Riz Local Étuvé', image: '🌾', totalSales: 4580000, totalOrders: 654, quantity: '450 Kg' },
  { id: 'prod-1', name: 'Mangues Kent', image: '🥭', totalSales: 3820000, totalOrders: 512, quantity: '540 Kg' },
  { id: 'prod-3', name: 'Oignons Rosés', image: '🧅', totalSales: 2780000, totalOrders: 410, quantity: '350 Kg' },
  { id: 'prod-5', name: 'Maïs Séché', image: '🌽', totalSales: 2150000, totalOrders: 365, quantity: '200 Kg' },
  { id: 'prod-6', name: 'Arachides Décortiquées', image: '🥜', totalSales: 1980000, totalOrders: 298, quantity: '150 Kg' },
];

export const regionSales: RegionSales[] = [
  { region: 'Thiès', sales: 6850000, percentage: 27.9 },
  { region: 'Kaolack', sales: 4920000, percentage: 20.0 },
  { region: 'Saint-Louis', sales: 3850000, percentage: 15.7 },
  { region: 'Fatick', sales: 3120000, percentage: 12.7 },
  { region: 'Ziguinchor', sales: 2780000, percentage: 11.3 },
];

export const recentActivity: ActivityItem[] = [
  { id: 'act-1', message: 'Nouveau producteur inscrit : Ferme du Saloum', time: 'Il y a 5 min', type: 'user' },
  { id: 'act-2', message: 'Commande #CMD-1258 confirmée', time: 'Il y a 12 min', type: 'order' },
  { id: 'act-3', message: 'Paiement reçu : 250 000 FCFA', time: 'Il y a 18 min', type: 'payment' },
  { id: 'act-4', message: 'Nouveau produit ajouté : Tomates Roma', time: 'Il y a 25 min', type: 'product' },
  { id: 'act-5', message: 'Réclamation ouverte : Problème de livraison', time: 'Il y a 42 min', type: 'complaint' },
];

export const alerts: AlertItem[] = [
  { id: 'alert-1', label: 'Producteurs en attente de vérification', count: 24, type: 'warning' },
  { id: 'alert-2', label: 'Produits en rupture de stock', count: 17, type: 'danger' },
  { id: 'alert-3', label: 'Commandes en attente', count: 32, type: 'warning' },
  { id: 'alert-4', label: 'Réclamations non traitées', count: 8, type: 'danger' },
  { id: 'alert-5', label: 'Paiements en attente de retrait', count: 12, type: 'info' },
];

export const producerMonthlyStats = {
  totalSales: 1245000,
  totalOrders: 28,
  productsSold: '356 Kg',
  productViews: 3245,
  favorites: 124,
  clients: 42,
  salesGrowth: 18,
  ordersGrowth: 12,
  productsSoldGrowth: 15,
  viewsGrowth: 23,
  favoritesGrowth: 10,
  clientsGrowth: 8,
  netProfit: 235000,
  profitGrowth: 20,
};

export const producerSalesData: SalesDataPoint[] = [
  { date: '1 mai', sales: 150000, orders: 3 },
  { date: '6 mai', sales: 280000, orders: 5 },
  { date: '11 mai', sales: 200000, orders: 4 },
  { date: '16 mai', sales: 350000, orders: 7 },
  { date: '21 mai', sales: 420000, orders: 8 },
  { date: '26 mai', sales: 380000, orders: 6 },
  { date: '31 mai', sales: 1245000, orders: 28 },
];
