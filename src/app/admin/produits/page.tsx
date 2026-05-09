'use client';

import { useState } from 'react';
import { products as initialProducts } from '@/data/mock-products';
import { formatPrice, getStatusLabel, getStatusColor, getStatusBgColor } from '@/lib/utils';
import { Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminProduitsPage() {
  const [productsList, setProductsList] = useState(initialProducts);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) {
      setProductsList(productsList.filter(p => p.id !== id));
      showToast(`Produit ${name} supprimé avec succès.`);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'en_vente' ? 'en_rupture' : 'en_vente';
    setProductsList(productsList.map(p => p.id === id ? { ...p, status: newStatus as any } : p));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Gestion des produits</h1>
        <div className="search-bar" style={{ maxWidth: 300 }}>
          <Search size={18} color="#9CA3AF" />
          <input placeholder="Rechercher un produit..." />
        </div>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th>Producteur</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            {productsList.map(p => (
              <tr key={p.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={p.images[0]} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                </td>
                <td>{p.category}</td>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatPrice(p.price)}/{p.unit}</td>
                <td>{p.stock} {p.unit}</td>
                <td>{p.producerName}</td>
                <td><span className="badge" style={{ background: getStatusBgColor(p.status), color: getStatusColor(p.status) }}>{getStatusLabel(p.status)}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => showToast(`✏️ Édition du produit: ${p.name}`)} style={{ color: '#3B82F6', background: '#EFF6FF', padding: 6, borderRadius: 6 }} title="Modifier">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleToggleStatus(p.id, p.status)} style={{ color: p.status === 'en_vente' ? '#F59E0B' : '#10B981', background: p.status === 'en_vente' ? '#FEF3C7' : '#D1FAE5', padding: 6, borderRadius: 6 }} title={p.status === 'en_vente' ? "Mettre en rupture" : "Rendre disponible"}>
                      {p.status === 'en_vente' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                    <button onClick={() => handleDelete(p.id, p.name)} style={{ color: '#EF4444', background: '#FEF2F2', padding: 6, borderRadius: 6 }} title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 30, right: 30, background: '#18181B', color: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{toast}</div>
      )}
    </div>
  );
}
