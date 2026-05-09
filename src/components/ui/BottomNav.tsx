'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  badge?: number;
}

export default function BottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const { cartItemCount } = useAuth();

  return (
    <>
      <nav className="bottom-nav-v2">
        <div className="bottom-nav-inner">
          {items.map(item => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const badge = item.label === 'Panier' ? cartItemCount : item.badge;
            return (
              <Link key={item.href} href={item.href} className={`nav-v2-item ${isActive ? 'active' : ''}`}>
                <div className="nav-v2-icon-wrap">
                  {isActive ? item.activeIcon : item.icon}
                </div>
                {badge && badge > 0 && <span className="nav-v2-badge">{badge}</span>}
                <span className="nav-v2-label">{item.label}</span>
                {isActive && <div className="nav-v2-dot" />}
              </Link>
            );
          })}
        </div>
      </nav>
      <style dangerouslySetInnerHTML={{__html: `
        .bottom-nav-v2 {
          position: fixed; bottom: 0; left: 0; right: 0;
          padding: 0 12px 10px;
          padding-bottom: max(10px, env(safe-area-inset-bottom));
          z-index: 100;
          pointer-events: none;
        }
        .bottom-nav-inner {
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          padding: 8px 6px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), 0 0 0 0.5px rgba(255,255,255,0.05) inset;
          pointer-events: all;
        }
        .nav-v2-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 4px 10px;
          color: #64748B;
          text-decoration: none;
          position: relative;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-v2-item:active { transform: scale(0.85); }
        .nav-v2-item.active { color: #fff; }
        .nav-v2-icon-wrap {
          width: 36px; height: 36px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-v2-item.active .nav-v2-icon-wrap {
          background: #16A34A;
          box-shadow: 0 4px 15px rgba(22, 163, 74, 0.45);
          transform: translateY(-2px);
        }
        .nav-v2-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: opacity 0.2s;
        }
        .nav-v2-item.active .nav-v2-label {
          font-weight: 700;
          color: #16A34A;
        }
        .nav-v2-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #16A34A;
          box-shadow: 0 0 6px rgba(22, 163, 74, 0.6);
          margin-top: -1px;
        }
        .nav-v2-badge {
          position: absolute;
          top: 0; right: 2px;
          background: #EF4444;
          color: #fff;
          font-size: 9px;
          font-weight: 800;
          min-width: 16px; height: 16px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 4px;
          border: 2px solid #0F172A;
          animation: badgePop 0.3s ease;
        }
      `}} />
    </>
  );
}

// ── BUYER ICONS (Filled for active, outline for inactive) ──
const IconHomeOutline = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconHomeFilled = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12.707 2.293a1 1 0 00-1.414 0l-9 9A1 1 0 003 13h1v7a2 2 0 002 2h4v-6h4v6h4a2 2 0 002-2v-7h1a1 1 0 00.707-1.707l-9-9z"/>
  </svg>
);
const IconSearchOutline = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="7.5"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
);
const IconSearchFilled = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M10.5 2a8.5 8.5 0 105.262 15.176l4.53 4.531a1 1 0 001.415-1.414l-4.531-4.531A8.5 8.5 0 0010.5 2zm0 2a6.5 6.5 0 110 13 6.5 6.5 0 010-13z"/>
  </svg>
);
const IconMapOutline = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-5.75-7-11a7 7 0 1114 0c0 5.25-7 11-7 11z"/>
    <circle cx="12" cy="10" r="2.5"/>
  </svg>
);
const IconMapFilled = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2C7.589 2 4 5.589 4 10c0 6.075 7.27 11.662 7.575 11.883a.75.75 0 00.85 0C12.73 21.662 20 16.075 20 10c0-4.411-3.589-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"/>
  </svg>
);
const IconCartOutline = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const IconCartFilled = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.54 5.23A1 1 0 0020 5H6.28l-.24-1.2A2 2 0 004.07 2H3a1 1 0 000 2h1.07l2.23 11.15A3 3 0 009.26 18h7.49a3 3 0 002.95-2.46l1.27-7.1a1 1 0 00-.43-1.21zM9.5 20a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm7 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
  </svg>
);
const IconUserOutline = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21a8 8 0 00-16 0"/>
  </svg>
);
const IconUserFilled = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <circle cx="12" cy="8" r="5"/>
    <path d="M20 21a8 8 0 00-16 0h16z"/>
  </svg>
);

// ── PRODUCER ICONS ──
const IconCropOutline = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L6 7v5l6 5 6-5V7l-6-5z"/>
    <path d="M12 12v10"/>
  </svg>
);
const IconCropFilled = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 1.5a.75.75 0 01.45.15l6 4.5A.75.75 0 0119 7v5a.75.75 0 01-.3.6L12.45 17.35a.75.75 0 01-.9 0L5.3 12.6A.75.75 0 015 12V7a.75.75 0 01.3-.6l6-4.5A.75.75 0 0112 1.5zM11.25 13.5v8.25a.75.75 0 001.5 0V13.5h-1.5z"/>
  </svg>
);
const IconBoxOutline = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconBoxFilled = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 1L3.316 5.84a1 1 0 00-.016.011L12 10.87l8.7-5.019a1 1 0 00-.016-.011L12 1zM2 7.58v9.003a2 2 0 001.029 1.749l7.471 4.142V12.58L2 7.58zm18 0l-8.5 5v9.894l7.471-4.142A2 2 0 0020 16.583V7.58z"/>
  </svg>
);
const IconChartOutline = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IconChartFilled = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="4" y="14" width="4" height="7" rx="1"/>
    <rect x="10" y="4" width="4" height="17" rx="1"/>
    <rect x="16" y="9" width="4" height="12" rx="1"/>
  </svg>
);

export const buyerNavItems: NavItem[] = [
  { href: '/acheteur', label: 'Accueil', icon: <IconHomeOutline />, activeIcon: <IconHomeFilled /> },
  { href: '/acheteur/recherche', label: 'Rechercher', icon: <IconSearchOutline />, activeIcon: <IconSearchFilled /> },
  { href: '/acheteur/carte', label: 'Carte', icon: <IconMapOutline />, activeIcon: <IconMapFilled /> },
  { href: '/acheteur/panier', label: 'Panier', icon: <IconCartOutline />, activeIcon: <IconCartFilled /> },
  { href: '/acheteur/profil', label: 'Profil', icon: <IconUserOutline />, activeIcon: <IconUserFilled /> },
];

export const producerNavItems: NavItem[] = [
  { href: '/producteur', label: 'Accueil', icon: <IconHomeOutline />, activeIcon: <IconHomeFilled /> },
  { href: '/producteur/produits', label: 'Produits', icon: <IconCropOutline />, activeIcon: <IconCropFilled /> },
  { href: '/producteur/commandes', label: 'Commandes', icon: <IconBoxOutline />, activeIcon: <IconBoxFilled />, badge: 2 },
  { href: '/producteur/statistiques', label: 'Stats', icon: <IconChartOutline />, activeIcon: <IconChartFilled /> },
  { href: '/producteur/profil', label: 'Profil', icon: <IconUserOutline />, activeIcon: <IconUserFilled /> },
];
