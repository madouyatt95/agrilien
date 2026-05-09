'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Gift, ShoppingCart, Users, Calendar, Star, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type Coffret = {
  id: string;
  name: string;
  description: string;
  occasion: string;
  products: { name: string; quantity: string }[];
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  orderCount: number;
};

const coffrets: Coffret[] = [
  {
    id: 'c1', name: 'Coffret Terroir Sénégalais', description: 'Le meilleur du terroir local : mangues, miel, noix de cajou et riz étuvé. Idéal pour les cadeaux clients.',
    occasion: 'Cadeaux clients', products: [{ name: 'Mangues Kent', quantity: '2 Kg' }, { name: 'Miel Local', quantity: '500g' }, { name: 'Noix de Cajou', quantity: '500g' }, { name: 'Riz Étuvé', quantity: '2 Kg' }],
    price: 12500, originalPrice: 15600, image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&auto=format&fit=crop', rating: 4.8, orderCount: 87
  },
  {
    id: 'c2', name: 'Coffret Bien-Être Naturel', description: 'Beurre de karité, miel de Casamance et infusions locales. Parfait pour les séminaires et événements.',
    occasion: 'Séminaires', products: [{ name: 'Beurre de Karité', quantity: '250g' }, { name: 'Miel de Casamance', quantity: '350g' }, { name: 'Tisane Kinkeliba', quantity: '100g' }, { name: 'Bissap Séché', quantity: '200g' }],
    price: 8900, originalPrice: 11200, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop', rating: 4.9, orderCount: 54
  },
  {
    id: 'c3', name: 'Coffret Gourmet Premium', description: 'Sélection premium de produits d\'exception : poulet fermier, épices rares et fruits de saison.',
    occasion: 'Événements', products: [{ name: 'Poulet Fermier', quantity: '1 pièce' }, { name: 'Gingembre Frais', quantity: '500g' }, { name: 'Bananes Plantain', quantity: '2 Kg' }, { name: 'Arachides', quantity: '1 Kg' }, { name: 'Oignons Rosés', quantity: '2 Kg' }],
    price: 18500, originalPrice: 22800, image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&auto=format&fit=crop', rating: 4.7, orderCount: 32
  },
  {
    id: 'c4', name: 'Coffret Découverte', description: 'L\'essentiel des produits locaux pour une première découverte. Compact et abordable.',
    occasion: 'Cadeaux clients', products: [{ name: 'Mangues Kent', quantity: '1 Kg' }, { name: 'Noix de Cajou', quantity: '250g' }, { name: 'Miel Local', quantity: '250g' }],
    price: 5900, originalPrice: 7400, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&auto=format&fit=crop', rating: 4.6, orderCount: 124
  },
];

const occasions = ['Tous', 'Cadeaux clients', 'Séminaires', 'Événements'];

export default function CoffretsPage() {
  const router = useRouter();
  const [selectedOccasion, setSelectedOccasion] = useState('Tous');
  const [selectedCoffret, setSelectedCoffret] = useState<Coffret | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = selectedOccasion === 'Tous' ? coffrets : coffrets.filter(c => c.occasion === selectedOccasion);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button onClick={() => router.back()}><ChevronLeft size={24} /></button>
        <h1>Coffrets Cadeaux</h1>
        <Gift size={22} color="var(--primary)" />
      </div>

      {/* Hero banner */}
      <div style={{ margin: '0 20px 20px', padding: 20, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary), #166534)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <Gift size={28} style={{ marginBottom: 8 }} />
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Offrez le meilleur du terroir</h2>
        <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>Coffrets composés de produits locaux frais. Personnalisables pour vos événements d'entreprise.</p>
      </div>

      {/* Filters */}
      <div className="filter-pills" style={{ padding: '0 20px 16px' }}>
        {occasions.map(o => (
          <button key={o} className={`filter-pill ${selectedOccasion === o ? 'active' : ''}`} onClick={() => setSelectedOccasion(o)}>{o}</button>
        ))}
      </div>

      {/* Coffrets list */}
      <div style={{ padding: '0 20px' }}>
        {filtered.map(coffret => (
          <div key={coffret.id} className="card" style={{ marginBottom: 16, overflow: 'hidden', cursor: 'pointer' }} onClick={() => { setSelectedCoffret(coffret); setQuantity(1); }}>
            <img src={coffret.image} alt={coffret.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{coffret.name}</h3>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 12, background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 600 }}>{coffret.occasion}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(coffret.price)}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-light)', textDecoration: 'line-through' }}>{formatPrice(coffret.originalPrice)}</p>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 10 }}>{coffret.description}</p>
              <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} fill="#FBBF24" color="#FBBF24" /> {coffret.rating}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ShoppingCart size={12} /> {coffret.orderCount} commandés</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Gift size={12} /> {coffret.products.length} produits</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selectedCoffret && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }} onClick={() => setSelectedCoffret(null)}>
          <div style={{ background: 'var(--surface)', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 24px 40px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{selectedCoffret.name}</h2>
              <button onClick={() => setSelectedCoffret(null)} style={{ background: 'var(--bg)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', fontSize: 16 }}>✕</button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>{selectedCoffret.description}</p>

            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📦 Contenu du coffret</h3>
            <div className="card" style={{ padding: 14, marginBottom: 20 }}>
              {selectedCoffret.products.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < selectedCoffret.products.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} color="var(--primary)" /> {p.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{p.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Quantité</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', fontSize: 18 }}>−</button>
                  <span style={{ fontWeight: 800, fontSize: 18, width: 30, textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', fontSize: 18 }}>+</button>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Total</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(selectedCoffret.price * quantity)}</p>
                <p style={{ fontSize: 12, color: 'var(--text-light)', textDecoration: 'line-through' }}>{formatPrice(selectedCoffret.originalPrice * quantity)}</p>
              </div>
            </div>

            <button onClick={() => { setSelectedCoffret(null); showToast(`🎁 ${quantity} coffret(s) "${selectedCoffret.name}" ajouté(s) au panier !`); }} className="btn btn-primary btn-block btn-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <ShoppingCart size={20} /> Commander {quantity > 1 ? `${quantity} coffrets` : 'ce coffret'}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 100, left: 20, right: 20, background: '#18181B', color: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1100, fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{toast}</div>
      )}
    </div>
  );
}
