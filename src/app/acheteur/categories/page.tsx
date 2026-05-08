'use client';

import { useRouter } from 'next/navigation';
import { categories } from '@/data/mock-categories';
import { ChevronLeft, Search } from 'lucide-react';
import styles from './categories.module.css';

export default function CategoriesPage() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}><ChevronLeft size={24} /></button>
        <h1>Catégories</h1>
        <button className={styles.searchBtn}><Search size={22} /></button>
      </div>
      <div className={styles.grid}>
        {categories.map(cat => (
          <button key={cat.id} className={styles.card} onClick={() => router.push(`/acheteur/recherche?cat=${cat.id}`)}>
            <div className={styles.imageWrap}>
              <img src={cat.icon} alt={cat.name} className={styles.image} />
            </div>
            <p className={styles.name}>{cat.name}</p>
            <p className={styles.count}>{cat.productCount} produits</p>
          </button>
        ))}
      </div>
    </div>
  );
}
