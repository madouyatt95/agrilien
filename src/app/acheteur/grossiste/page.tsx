'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Package, Send, Check, ShoppingBag } from 'lucide-react';
import { products } from '@/data/mock-products';
import { formatPrice } from '@/lib/utils';

export default function GrossistePage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const priceTiers = [
    { min: 10, discount: 5 },
    { min: 50, discount: 10 },
    { min: 100, discount: 15 },
    { min: 500, discount: 20 },
  ];

  const handleSubmit = () => {
    if (!selectedProduct || !quantity || !phone) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Check size={40} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Demande envoyée !</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 24 }}>Notre équipe vous contactera sous 24h pour finaliser votre devis.</p>
        <button className="btn btn-primary btn-block" style={{ maxWidth: 340 }} onClick={() => router.push('/acheteur')}>Retour à l&apos;accueil</button>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button onClick={() => router.back()}><ChevronLeft size={24} /></button>
        <h1>Achat en gros</h1>
        <div style={{ width: 24 }} />
      </div>

      {/* Banner */}
      <div style={{ margin: '16px 20px', padding: 20, background: 'var(--primary)', borderRadius: 16, color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <Package size={24} />
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Prix dégressifs</h2>
        </div>
        <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5 }}>Restaurants, hôtels, commerces — commandez en volume et bénéficiez de réductions allant jusqu&apos;à -20%</p>
      </div>

      {/* Grille tarifs */}
      <div style={{ padding: '0 20px 16px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Grille de prix</h3>
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Quantité min.</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Réduction</th>
              </tr>
            </thead>
            <tbody>
              {priceTiers.map((tier, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>À partir de {tier.min} unités</td>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: 'var(--primary)', textAlign: 'right' }}>-{tier.discount}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulaire devis */}
      <div style={{ padding: '0 20px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Demander un devis</h3>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Produit</label>
            <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)' }}>
              <option value="">Sélectionner un produit</option>
              {products.filter(p => p.isAvailable).map(p => (
                <option key={p.id} value={p.id}>{p.name} — {formatPrice(p.price)}/{p.unit}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Quantité souhaitée</label>
            <input value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Ex: 100 kg"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Entreprise / Restaurant</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Nom de votre structure"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Téléphone *</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+221 77 XXX XX XX"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Notes supplémentaires</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Fréquence de livraison, conditionnement..." rows={3}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14, resize: 'none' }} />
          </div>
          <button className="btn btn-primary btn-block" onClick={handleSubmit}
            disabled={!selectedProduct || !quantity || !phone}
            style={{ opacity: !selectedProduct || !quantity || !phone ? 0.5 : 1 }}>
            <Send size={16} /> Envoyer la demande
          </button>
        </div>
      </div>
    </div>
  );
}
