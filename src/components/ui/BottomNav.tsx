'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User, Package, BarChart3, Tractor, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const { cartItemCount } = useAuth();

  return (
    <nav className="bottom-nav">
      {items.map(item => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        const badge = item.label === 'Panier' ? cartItemCount : item.badge;
        return (
          <Link key={item.href} href={item.href} className={`bottom-nav-item ${isActive ? 'active' : ''}`}>
            {item.icon}
            {badge && badge > 0 && <span className="nav-badge">{badge}</span>}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export const buyerNavItems: NavItem[] = [
  { href: '/acheteur', label: 'Accueil', icon: <Home size={22} /> },
  { href: '/acheteur/recherche', label: 'Rechercher', icon: <Search size={22} /> },
  { href: '/acheteur/carte', label: 'Carte', icon: <MapPin size={22} /> },
  { href: '/acheteur/panier', label: 'Panier', icon: <ShoppingCart size={22} /> },
  { href: '/acheteur/profil', label: 'Profil', icon: <User size={22} /> },
];

export const producerNavItems: NavItem[] = [
  { href: '/producteur', label: 'Accueil', icon: <Home size={22} /> },
  { href: '/producteur/produits', label: 'Produits', icon: <Tractor size={22} /> },
  { href: '/producteur/commandes', label: 'Commandes', icon: <Package size={22} />, badge: 2 },
  { href: '/producteur/statistiques', label: 'Stats', icon: <BarChart3 size={22} /> },
  { href: '/producteur/profil', label: 'Profil', icon: <User size={22} /> },
];
