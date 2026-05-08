'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { orders } from '@/data/mock-orders';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice, getStatusLabel, getStatusColor, getStatusBgColor, formatRelativeTime } from '@/lib/utils';

const tabs = [
  { id: 'toutes', label: 'Toutes' },
  { id: 'en_attente', label: 'En attente' },
  { id: 'confirmee', label: 'Confirmées' },
  { id: 'livree', label: 'Livrées' },
  { id: 'annulee', label: 'Annulées' },
];

export default function CommandesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('toutes');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = activeTab === 'toutes' ? orders : orders.filter(o => o.status === activeTab);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button className="page-header-back" onClick={() => router.back()}><ChevronLeft size={24} /></button>
        <h1>Mes commandes</h1>
        <div style={{ width: 24 }} />
      </div>
      <div className="filter-pills" style={{ padding: '12px 20px' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`filter-pill ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ padding: '0 20px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
            <p style={{ fontWeight: 600 }}>Aucune commande dans cette catégorie</p>
          </div>
        ) : (
          filtered.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: 12, overflow: 'hidden' }}>
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                style={{ padding: 16, width: '100%', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{order.orderNumber}</span>
                  <span className="badge" style={{ background: getStatusBgColor(order.status), color: getStatusColor(order.status) }}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {order.items.length} produit{order.items.length > 1 ? 's' : ''}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(order.total)}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{formatRelativeTime(order.createdAt)}</span>
                </div>
              </button>
              {expandedOrder === order.id && (
                <div style={{ borderTop: '1px solid var(--border)', padding: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Détails de la commande :</p>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ fontSize: 13 }}>{item.productName} × {item.quantity}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{formatPrice(item.total)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 16 }}>{formatPrice(order.total)}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
