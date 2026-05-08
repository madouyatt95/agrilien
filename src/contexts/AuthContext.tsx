'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserRole, CartItem, Product, ProducerRequest } from '@/types';
import { buyerUser, buyerProUser, producerUser, adminUser, demoAccounts } from '@/data/mock-users';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAs: (role: UserRole) => void;
  switchRole: () => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  producerRequests: ProducerRequest[];
  submitProducerRequest: (data: Omit<ProducerRequest, 'id' | 'status' | 'createdAt'>) => void;
  approveProducerRequest: (requestId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [producerRequests, setProducerRequests] = useState<ProducerRequest[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('agrilien_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    const storedCart = localStorage.getItem('agrilien_cart');
    if (storedCart) {
      try { setCart(JSON.parse(storedCart)); } catch { /* ignore */ }
    }
    const storedFavs = localStorage.getItem('agrilien_favorites');
    if (storedFavs) {
      try { setFavorites(JSON.parse(storedFavs)); } catch { /* ignore */ }
    }
    const storedReqs = localStorage.getItem('agrilien_producer_reqs');
    if (storedReqs) {
      try { setProducerRequests(JSON.parse(storedReqs)); } catch { /* ignore */ }
    }

    // Register Service Worker for Offline-First PWA (Step 9)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => console.log('ServiceWorker registration successful with scope: ', registration.scope),
        (err) => console.log('ServiceWorker registration failed: ', err)
      );
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('agrilien_user', JSON.stringify(user));
    else localStorage.removeItem('agrilien_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('agrilien_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('agrilien_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('agrilien_producer_reqs', JSON.stringify(producerRequests));
  }, [producerRequests]);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    if (email === demoAccounts.acheteur.email) {
      setUser(buyerUser);
      setFavorites(buyerUser.favorites);
      return true;
    }
    if (email === demoAccounts.acheteur_pro.email) {
      setUser(buyerProUser);
      setFavorites(buyerProUser.favorites);
      return true;
    }
    if (email === demoAccounts.producteur.email) {
      setUser(producerUser);
      return true;
    }
    if (email === demoAccounts.admin.email) {
      setUser(adminUser);
      return true;
    }
    return false;
  }, []);

  const loginAs = useCallback((role: UserRole) => {
    switch (role) {
      case 'acheteur': setUser(buyerUser); setFavorites(buyerUser.favorites); break;
      case 'acheteur_pro': setUser(buyerProUser); setFavorites(buyerProUser.favorites); break;
      case 'producteur': setUser(producerUser); break;
      case 'admin': setUser(adminUser); break;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('agrilien_user');
    localStorage.removeItem('agrilien_cart');
  }, []);

  const switchRole = useCallback(() => {
    if (!user) return;
    if (user.role === 'producteur') {
      // Producteur → Acheteur : same person, buyer role
      setUser({ ...user, role: 'acheteur' } as any);
    }
  }, [user]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const submitProducerRequest = useCallback((data: Omit<ProducerRequest, 'id' | 'status' | 'createdAt'>) => {
    const newReq: ProducerRequest = {
      ...data,
      id: `req-${Date.now()}`,
      status: 'en_attente',
      createdAt: new Date().toISOString()
    };
    setProducerRequests(prev => [...prev, newReq]);
  }, []);

  const approveProducerRequest = useCallback((requestId: string) => {
    setProducerRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'approuve' } : req));
    // If the approved user is the one currently logged in, update their status
    const req = producerRequests.find(r => r.id === requestId);
    if (req && user && user.id === req.userId) {
      setUser({ ...user, id: `producer-${user.id}` }); // Upgrade id to simulate producer
    }
  }, [producerRequests, user]);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user,
      login, loginAs, switchRole, logout,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      cartTotal, cartItemCount,
      favorites, toggleFavorite,
      producerRequests, submitProducerRequest, approveProducerRequest
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
