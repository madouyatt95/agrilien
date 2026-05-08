'use client';
import { Tag, Plus } from 'lucide-react';

const promos = [
  { id: 1, name: 'Bienvenue -10%', type: 'Réduction', value: '10%', usage: 245, status: 'active', end: '30 juin 2024' },
  { id: 2, name: 'Livraison gratuite', type: 'Livraison', value: '0 FCFA', usage: 89, status: 'active', end: '15 juin 2024' },
  { id: 3, name: 'Promo Mangues', type: 'Produit', value: '15%', usage: 56, status: 'expire', end: '10 mai 2024' },
];

export default function AdminPromotionsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Promotions</h1>
        <button className="btn btn-primary btn-sm"><Plus size={16} /> Créer une promotion</button>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Nom</th><th>Type</th><th>Valeur</th><th>Utilisations</th><th>Statut</th><th>Fin</th></tr></thead>
          <tbody>
            {promos.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td><td>{p.type}</td><td style={{ fontWeight: 600 }}>{p.value}</td>
                <td>{p.usage}</td>
                <td><span className="badge" style={{ background: p.status === 'active' ? '#F0FDF4' : '#F3F4F6', color: p.status === 'active' ? '#22C55E' : '#6B7280' }}>{p.status === 'active' ? 'Active' : 'Expirée'}</span></td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
