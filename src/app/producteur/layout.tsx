'use client';
import BottomNav, { producerNavItems } from '@/components/ui/BottomNav';

export default function ProducteurLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="page">{children}</main>
      <BottomNav items={producerNavItems} />
    </>
  );
}
