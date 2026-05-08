'use client';

import { usePathname } from 'next/navigation';
import BottomNav, { buyerNavItems } from '@/components/ui/BottomNav';

export default function AcheteurLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Masquer le bottom nav sur les pages à action plein écran
  const hideNav = pathname.startsWith('/acheteur/produit/') || pathname.startsWith('/acheteur/checkout') || pathname.match(/\/acheteur\/commandes\/.+/);

  return (
    <>
      <main className={hideNav ? '' : 'page'}>{children}</main>
      {!hideNav && <BottomNav items={buyerNavItems} />}
    </>
  );
}
