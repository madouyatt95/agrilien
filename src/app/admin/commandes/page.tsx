'use client';

import { useState } from 'react';
import { orders as initialOrders } from '@/data/mock-orders';
import { formatPrice, getStatusLabel, getStatusColor, getStatusBgColor, formatRelativeTime } from '@/lib/utils';
import { Search, Eye, Download, Truck } from 'lucide-react';

export default function AdminCommandesPage() {
  const [ordersList, setOrdersList] = useState(initialOrders);

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    let nextStatus = currentStatus;
    if (currentStatus === 'en_attente') nextStatus = 'expediee';
    else if (currentStatus === 'expediee') nextStatus = 'livree';
    
    if (nextStatus !== currentStatus) {
      if (confirm(`Passer cette commande au statut "${getStatusLabel(nextStatus)}" ?`)) {
        setOrdersList(ordersList.map(o => o.id === id ? { ...o, status: nextStatus as any } : o));
      }
    } else {
      alert("La commande est déjà livrée.");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Gestion des commandes</h1>
        <div className="search-bar" style={{ maxWidth: 300 }}><Search size={18} color="#9CA3AF" /><input placeholder="Rechercher..." /></div>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>N° Commande</th><th>Acheteur</th><th>Produits</th><th>Total</th><th>Statut</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {ordersList.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700 }}>{o.orderNumber}</td>
                <td>{o.buyerName}</td>
                <td>{o.items.length} article{o.items.length > 1 ? 's' : ''}</td>
                <td style={{ fontWeight: 600 }}>{formatPrice(o.total)}</td>
                <td><span className="badge" style={{ background: getStatusBgColor(o.status), color: getStatusColor(o.status) }}>{getStatusLabel(o.status)}</span></td>
                <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatRelativeTime(o.createdAt)}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => alert(`Détails de la commande ${o.orderNumber}`)} style={{ color: '#6366F1', background: '#EEF2FF', padding: 6, borderRadius: 6 }} title="Voir">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => alert(`Téléchargement de la facture pour ${o.orderNumber}`)} style={{ color: '#10B981', background: '#D1FAE5', padding: 6, borderRadius: 6 }} title="Facture">
                      <Download size={16} />
                    </button>
                    {o.status !== 'livree' && (
                      <button onClick={() => handleUpdateStatus(o.id, o.status)} style={{ color: '#F59E0B', background: '#FEF3C7', padding: 6, borderRadius: 6 }} title="Mettre à jour le statut">
                        <Truck size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
