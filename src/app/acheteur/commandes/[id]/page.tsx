'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Phone, MessageCircle, Package, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { orders } from '@/data/mock-orders';
import { formatPrice } from '@/lib/utils';
import RatingModal from '@/components/ui/RatingModal';

const stepIcons = [Package, Clock, Truck, CheckCircle2];
const stepLabels = ['Commande confirmée', 'En préparation', 'En livraison', 'Livrée'];
const stepDescs = [
  'Votre commande a été acceptée par le producteur',
  'Le producteur prépare vos produits',
  'Le livreur est en route vers vous',
  'Commande livrée avec succès',
];
const stepTimes = ['10:30', '11:15', '13:45', '14:20'];

export default function CommandeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [showRating, setShowRating] = useState(false);

  const order = orders.find(o => o.id === orderId) || orders[0];

  const statusToStep: Record<string, number> = { 'confirmee': 1, 'en_preparation': 2, 'en_livraison': 3, 'livree': 4, 'annulee': 0 };
  const currentStep = statusToStep[order.status] || 2;

  const livreur = { name: 'Moussa Diop', phone: '+221 77 456 78 90', vehicle: 'Moto' };

  const estimatedTime = currentStep < 4 ? '~25 min' : 'Livrée';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div className="page-header">
        <button onClick={() => router.back()}><ChevronLeft size={24} /></button>
        <h1>Commande #{order.id.slice(-4)}</h1>
        <div style={{ width: 24 }} />
      </div>

      {/* Estimation */}
      {currentStep < 4 && (
        <div style={{ margin: '16px 20px', padding: 16, background: 'var(--primary)', borderRadius: 12, color: '#fff', textAlign: 'center' }}>
          <p style={{ fontSize: 13, opacity: 0.8 }}>Temps estimé</p>
          <p style={{ fontSize: 28, fontWeight: 800 }}>{estimatedTime}</p>
        </div>
      )}

      {/* Timeline */}
      <div style={{ padding: '20px 20px 0' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Suivi en direct</h3>
        <div style={{ position: 'relative', paddingLeft: 36 }}>
          {/* Ligne verticale */}
          <div style={{ position: 'absolute', left: 14, top: 6, bottom: 6, width: 2, background: 'var(--border)' }} />
          <div style={{ position: 'absolute', left: 14, top: 6, width: 2, height: `${Math.min(100, (currentStep / 4) * 100)}%`, background: 'var(--primary)', transition: 'height 0.5s ease' }} />

          {stepLabels.map((label, i) => {
            const Icon = stepIcons[i];
            const isCompleted = i < currentStep;
            const isCurrent = i === currentStep - 1;
            return (
              <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 32, position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: -36, top: 0,
                  width: 30, height: 30, borderRadius: '50%',
                  background: isCompleted || isCurrent ? 'var(--primary)' : 'var(--bg)',
                  border: isCompleted || isCurrent ? 'none' : '2px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}>
                  <Icon size={14} color={isCompleted || isCurrent ? '#fff' : '#9CA3AF'} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: isCurrent ? 700 : 500, color: isCompleted || isCurrent ? 'var(--text)' : 'var(--text-light)' }}>{label}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{stepDescs[i]}</p>
                  {(isCompleted || isCurrent) && <p style={{ fontSize: 11, color: 'var(--primary)', marginTop: 4, fontWeight: 600 }}>{stepTimes[i]}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Livreur */}
      {currentStep >= 3 && currentStep < 5 && (
        <div className="card" style={{ margin: '0 20px 16px', padding: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Votre livreur</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛵</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{livreur.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{livreur.vehicle}</p>
            </div>
            <a href={`tel:${livreur.phone}`} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={18} color="var(--primary)" />
            </a>
            <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={18} color="var(--accent)" />
            </button>
          </div>
        </div>
      )}

      {/* Articles */}
      <div className="card" style={{ margin: '0 20px 16px', padding: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Articles commandés</p>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <img src={item.productImage} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{item.productName}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.quantity} {item.unit} × {formatPrice(item.unitPrice)}</p>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(item.total)}</p>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span>Sous-total</span><span>{formatPrice(order.subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
            <span>Livraison</span><span>{order.deliveryFee === 0 ? 'Gratuite' : formatPrice(order.deliveryFee)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, marginTop: 8 }}>
            <span>Total</span><span style={{ color: 'var(--primary)' }}>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Adresse */}
      <div className="card" style={{ margin: '0 20px 16px', padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <MapPin size={18} color="var(--primary)" />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600 }}>Adresse de livraison</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Rue 12, Médina, Dakar, Sénégal</p>
          </div>
        </div>
      </div>

      {/* Bouton noter si livrée */}
      {currentStep >= 4 && (
        <div style={{ padding: '0 20px' }}>
          <button className="btn btn-primary btn-block" onClick={() => setShowRating(true)}>
            ⭐ Noter cette commande
          </button>
        </div>
      )}

      {showRating && (
        <RatingModal
          productName={order.items[0]?.productName || 'ce produit'}
          onSubmit={(rating, comment) => console.log('Rating:', rating, comment)}
          onClose={() => setShowRating(false)}
        />
      )}
    </div>
  );
}
