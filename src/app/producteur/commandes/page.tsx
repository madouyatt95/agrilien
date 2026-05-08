'use client';

import { orders } from '@/data/mock-orders';
import { ChevronLeft, HelpCircle, FileText, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice, getStatusLabel, getStatusColor, getStatusBgColor, formatRelativeTime } from '@/lib/utils';
import { useState } from 'react';

export default function ProducteurCommandesPage() {
  const router = useRouter();
  const [tab, setTab] = useState('toutes');
  const tabs = [
    { id: 'toutes', label: `Toutes (${orders.length})` },
    { id: 'en_attente', label: `En attente (${orders.filter(o => o.status === 'en_attente').length})` },
    { id: 'confirmee', label: `Confirmées (${orders.filter(o => o.status === 'confirmee').length})` },
    { id: 'livree', label: 'Livrées' },
  ];
  const filtered = tab === 'toutes' ? orders : orders.filter(o => o.status === tab);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button onClick={() => router.back()}><ChevronLeft size={24} /></button>
        <h1>Mes commandes</h1>
        <div style={{ width: 24 }} />
      </div>
      <div className="filter-pills" style={{ padding: '12px 20px' }}>
        {tabs.map(t => <button key={t.id} className={`filter-pill ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>
      <div style={{ padding: '0 20px' }}>
        {filtered.map(order => (
          <div key={order.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{order.orderNumber}</span>
              <span className="badge" style={{ background: getStatusBgColor(order.status), color: getStatusColor(order.status) }}>{getStatusLabel(order.status)}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto' }}>
              {order.items.map(item => (
                <img key={item.productId} src={item.productImage} alt={item.productName} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }} />
              ))}
            </div>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{order.buyerName}</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 2 }}>{order.items.length} produit{order.items.length > 1 ? 's' : ''} · {formatPrice(order.total)}</p>
            <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 10 }}>{formatRelativeTime(order.createdAt)}</p>
            
            {/* Actions Premium */}
            <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
              <button
                onClick={(e) => { e.stopPropagation(); router.push(`/producteur/contrat/${order.id}`); }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: 8, background: '#EFF6FF', color: '#1D4ED8', fontSize: 12, fontWeight: 700, border: 'none' }}
              >
                <FileText size={14} /> Contrat
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); router.push(`/trace/${order.items[0]?.productId}`); }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: 8, background: '#F0FDF4', color: '#166534', fontSize: 12, fontWeight: 700, border: 'none' }}
              >
                <QrCode size={14} /> QR Traçabilité
              </button>
            </div>
          </div>
        ))}

        <div className="card" style={{ padding: 20, marginTop: 12, textAlign: 'center', background: 'var(--primary-light)', border: '1px solid #C6E7D4' }}>
          <HelpCircle size={24} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Besoin d&apos;aide ?</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>Notre équipe est là pour vous accompagner.</p>
          <button className="btn btn-outline btn-sm">Contacter le support</button>
        </div>
      </div>
    </div>
  );
}
