'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'acheteur': router.replace('/acheteur'); break;
        case 'producteur': router.replace('/producteur'); break;
        case 'admin': router.replace('/admin'); break;
        default: router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, user, router]);

  return null;
}
