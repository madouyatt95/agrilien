'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, ShoppingBag, Package, CreditCard, Truck, AlertCircle, Star, Tag, FileText, Settings, BarChart3, ChevronDown, ChevronRight, Menu, X, LogOut } from 'lucide-react';
import AgriLienLogo from '@/components/ui/Logo';

const menuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={18} />, href: '/admin' },
  { id: 'utilisateurs', label: 'Utilisateurs', icon: <Users size={18} />, href: '/admin/utilisateurs',
    children: [
      { label: 'Acheteurs', href: '/admin/utilisateurs?type=acheteurs' },
      { label: 'Producteurs', href: '/admin/utilisateurs?type=producteurs' },
      { label: 'Admins', href: '/admin/utilisateurs?type=admins' },
    ]
  },
  { id: 'produits', label: 'Produits', icon: <Package size={18} />, href: '/admin/produits' },
  { id: 'commandes', label: 'Commandes', icon: <ShoppingBag size={18} />, href: '/admin/commandes' },
  { id: 'paiements', label: 'Paiements', icon: <CreditCard size={18} />, href: '/admin/paiements' },
  { id: 'livraisons', label: 'Livraisons', icon: <Truck size={18} />, href: '/admin/livraisons' },
  { id: 'reclamations', label: 'Réclamations', icon: <AlertCircle size={18} />, href: '/admin/reclamations' },
  { id: 'avis', label: 'Avis & notes', icon: <Star size={18} />, href: '/admin/avis' },
  { id: 'promotions', label: 'Promotions', icon: <Tag size={18} />, href: '/admin/promotions' },
  { id: 'contenu', label: 'Contenu', icon: <FileText size={18} />, href: '/admin/contenu' },
  { id: 'parametres', label: 'Paramètres', icon: <Settings size={18} />, href: '/admin/parametres' },
  { id: 'rapports', label: 'Rapports', icon: <BarChart3 size={18} />, href: '/admin/rapports' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('utilisateurs');

  const handleLogout = () => { logout(); router.replace('/login'); };

  const sidebar = (
    <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="admin-sidebar-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AgriLienLogo size="md" />
        {mobileOpen && (
          <button onClick={() => setMobileOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="admin-sidebar-menu">
        {menuItems.map(item => (
          <div key={item.id}>
            <button
              className={`admin-menu-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => {
                if (item.children) {
                  setExpandedMenu(expandedMenu === item.id ? null : item.id);
                } else {
                  router.push(item.href);
                  setMobileOpen(false);
                }
              }}
            >
              {item.icon}
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.children && (expandedMenu === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>
            {item.children && expandedMenu === item.id && (
              <div className="admin-menu-sub">
                {item.children.map(child => (
                  <button key={child.label} className="admin-menu-item" onClick={() => { router.push(child.href); setMobileOpen(false); }}>
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="admin-sidebar-profile">
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>A</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 600 }}>Admin AgriLien</p>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Super administrateur</p>
        </div>
        <button onClick={handleLogout} style={{ color: 'var(--error)' }}><LogOut size={18} /></button>
      </div>
    </aside>
  );

  return (
    <div className="admin-layout">
      {sidebar}
      {mobileOpen && <div className="admin-mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="admin-content">
        <div className="admin-mobile-header">
          <button onClick={() => setMobileOpen(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text)' }}><Menu size={24} /></button>
          <div style={{ marginLeft: 16 }}>
            <AgriLienLogo size="sm" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
