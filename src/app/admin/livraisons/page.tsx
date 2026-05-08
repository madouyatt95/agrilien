'use client';
import { Truck, Clock, CheckCircle, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const deliveries = [
  { id: 1, order: '#CMD-1258', buyer: 'Fatou Diop', zone: 'Dakar - Plateau', fee: 1000, status: 'en_cours', driver: 'Ibrahima Seck' },
  { id: 2, order: '#CMD-1257', buyer: 'Alpha Trading', zone: 'Thiès - Centre', fee: 0, status: 'retrait', driver: '-' },
  { id: 3, order: '#CMD-1255', buyer: 'Aissatou Kane', zone: 'Ziguinchor', fee: 2000, status: 'livree', driver: 'Moussa Diallo' },
];

export default function AdminLivraisonsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Livraisons</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        <div className="stat-card"><div className="stat-icon" style={{ background: '#FFF7ED', color: '#F97316' }}><Clock size={20} /></div><p className="stat-label">En cours</p><p className="stat-value">12</p></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: '#F0FDF4', color: '#22C55E' }}><CheckCircle size={20} /></div><p className="stat-label">Livrées ce mois</p><p className="stat-value">156</p></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: '#EFF6FF', color: '#3B82F6' }}><MapPin size={20} /></div><p className="stat-label">Zones couvertes</p><p className="stat-value">7</p></div>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Commande</th><th>Acheteur</th><th>Zone</th><th>Frais</th><th>Livreur</th><th>Statut</th></tr></thead>
          <tbody>
            {deliveries.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>{d.order}</td><td>{d.buyer}</td><td>{d.zone}</td>
                <td>{d.fee > 0 ? formatPrice(d.fee) : 'Retrait'}</td><td>{d.driver}</td>
                <td><span className="badge" style={{ background: d.status === 'livree' ? '#F0FDF4' : d.status === 'retrait' ? '#EFF6FF' : '#FFF7ED', color: d.status === 'livree' ? '#22C55E' : d.status === 'retrait' ? '#3B82F6' : '#F97316' }}>{d.status === 'livree' ? 'Livrée' : d.status === 'retrait' ? 'Retrait' : 'En cours'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
