'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, Plus, Minus, Trash2, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function PanierPage() {
  const router = useRouter();
  const { cart, updateCartQuantity, removeFromCart, cartTotal } = useAuth();
  const deliveryFee = cartTotal >= 5000 ? 0 : 1000;
  const total = cartTotal + deliveryFee;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button className="page-header-back" onClick={() => router.back()}><ChevronLeft size={24} /></button>
        <h1>Mon panier</h1>
        <button style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>Modifier</button>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🛒</p>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Votre panier est vide</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>Découvrez nos produits frais</p>
          <button className="btn btn-primary" onClick={() => router.push('/acheteur')}>Continuer mes achats</button>
        </div>
      ) : (
        <div style={{ padding: 20 }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>{cart.length} article{cart.length > 1 ? 's' : ''}</p>

          {cart.map(item => (
            <div key={item.product.id} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <img src={item.product.images[0]} alt={item.product.name}
                style={{ width: 70, height: 70, borderRadius: 10, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.product.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.product.city}, Sénégal</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginTop: 4 }}>{formatPrice(item.product.price)} / {item.product.unit}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{formatPrice(item.product.price * item.quantity)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg)', borderRadius: 8, padding: '4px 8px' }}>
                  <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}>
                    <Minus size={16} color="var(--text-secondary)" />
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity} {item.product.unit}</span>
                  <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}>
                    <Plus size={16} color="var(--primary)" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24, padding: '16px 0', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Sous-total</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{formatPrice(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Livraison</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{formatPrice(deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--primary)' }}>{formatPrice(total)}</span>
            </div>
          </div>

          <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 12, borderRadius: 12 }} onClick={() => router.push('/acheteur/checkout')}>
            Valider la commande — {formatPrice(total)}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, color: 'var(--text-secondary)', fontSize: 12 }}>
            <ShieldCheck size={16} />
            <div>
              <p style={{ fontWeight: 600 }}>Paiement sécurisé</p>
              <p>Vos informations sont protégées</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
