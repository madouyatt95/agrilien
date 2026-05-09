'use client';

import { orders } from '@/data/mock-orders';
import { ChevronLeft, HelpCircle, FileText, QrCode, X, Check, Truck, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice, getStatusLabel, getStatusColor, getStatusBgColor, formatRelativeTime } from '@/lib/utils';
import { useState } from 'react';
import { Order } from '@/types';

export default function ProducteurCommandesPage() {
  const router = useRouter();
  const [tab, setTab] = useState('toutes');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [localOrders, setLocalOrders] = useState(orders);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const tabs = [
    { id: 'toutes', label: `Toutes (${localOrders.length})` },
    { id: 'en_attente', label: `En attente (${localOrders.filter(o => o.status === 'en_attente').length})` },
    { id: 'confirmee', label: `Confirmées (${localOrders.filter(o => o.status === 'confirmee').length})` },
    { id: 'livree', label: 'Livrées' },
  ];
  const filtered = tab === 'toutes' ? localOrders : localOrders.filter(o => o.status === tab);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setLocalOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    const labels: Record<string, string> = { confirmee: '✅ Commande confirmée', en_preparation: '📦 Commande en préparation', expediee: '🚛 Commande expédiée', livree: '✅ Commande livrée' };
    showToast(labels[newStatus] || '✅ Statut mis à jour');
  };

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
          <div key={order.id} className="card" style={{ padding: 16, marginBottom: 12, cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
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

      {/* MODALE DÉTAIL COMMANDE */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }} onClick={() => setSelectedOrder(null)}>
          <div style={{ background: 'var(--surface)', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 24px 40px', maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{selectedOrder.orderNumber}</h2>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatRelativeTime(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'var(--bg)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', fontSize: 16 }}>✕</button>
            </div>

            {/* Statut */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: getStatusBgColor(selectedOrder.status), borderRadius: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 20 }}>{selectedOrder.status === 'livree' ? '✅' : selectedOrder.status === 'confirmee' ? '📦' : selectedOrder.status === 'en_preparation' ? '🔧' : '⏳'}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: getStatusColor(selectedOrder.status) }}>{getStatusLabel(selectedOrder.status)}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Dernière mise à jour : {formatRelativeTime(selectedOrder.updatedAt)}</p>
              </div>
            </div>

            {/* Informations client */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: 'var(--text-secondary)' }}>👤 Client</h3>
              <div className="card" style={{ padding: 14 }}>
                <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{selectedOrder.buyerName}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>📍 {selectedOrder.deliveryAddress}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>💳 {selectedOrder.paymentMethod === 'wave' ? 'Wave' : selectedOrder.paymentMethod === 'orange_money' ? 'Orange Money' : 'Carte bancaire'}</p>
              </div>
            </div>

            {/* Produits commandés */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: 'var(--text-secondary)' }}>📦 Produits commandés</h3>
              {selectedOrder.items.map(item => (
                <div key={item.productId} className="card" style={{ display: 'flex', gap: 12, padding: 12, marginBottom: 8 }}>
                  <img src={item.productImage} alt={item.productName} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{item.productName}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.quantity} {item.unit} × {formatPrice(item.unitPrice)}</p>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary)', alignSelf: 'center' }}>{formatPrice(item.total)}</p>
                </div>
              ))}
            </div>

            {/* Montant total */}
            <div className="card" style={{ padding: 14, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Sous-total</span>
                <span style={{ fontSize: 13 }}>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Frais de livraison</span>
                <span style={{ fontSize: 13 }}>{selectedOrder.deliveryFee > 0 ? formatPrice(selectedOrder.deliveryFee) : 'Gratuit'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 16, fontWeight: 800 }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Actions selon le statut */}
            <div style={{ display: 'flex', gap: 10 }}>
              {selectedOrder.status === 'en_attente' && (
                <button onClick={() => handleStatusChange(selectedOrder.id, 'confirmee')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 12, background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none' }}>
                  <Check size={18} /> Confirmer
                </button>
              )}
              {selectedOrder.status === 'confirmee' && (
                <button onClick={() => handleStatusChange(selectedOrder.id, 'en_preparation')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 12, background: '#F59E0B', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none' }}>
                  <Package size={18} /> Préparer
                </button>
              )}
              {selectedOrder.status === 'en_preparation' && (
                <button onClick={() => handleStatusChange(selectedOrder.id, 'expediee')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 12, background: '#3B82F6', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none' }}>
                  <Truck size={18} /> Expédier
                </button>
              )}
              {(selectedOrder.status === 'expediee') && (
                <button onClick={() => handleStatusChange(selectedOrder.id, 'livree')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 12, background: '#22C55E', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none' }}>
                  <Check size={18} /> Marquer livrée
                </button>
              )}
              <button onClick={() => setSelectedOrder(null)} style={{ flex: selectedOrder.status === 'livree' ? 1 : 0.5, padding: 14, borderRadius: 12, border: '1px solid var(--border)', fontWeight: 600, fontSize: 14, background: 'var(--surface)' }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 100, left: 20, right: 20, background: '#18181B', color: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1100, fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{toast}</div>
      )}
    </div>
  );
}
