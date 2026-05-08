'use client';

import { formatPrice } from '@/lib/utils';
import { DollarSign, ArrowDownCircle, Clock, CheckCircle } from 'lucide-react';

const payments = [
  { id: 1, order: '#CMD-1258', buyer: 'Fatou Diop', amount: 12000, method: 'Wave', status: 'complete', date: '18 mai 2024' },
  { id: 2, order: '#CMD-1257', buyer: 'Alpha Trading', amount: 25500, method: 'Orange Money', status: 'complete', date: '17 mai 2024' },
  { id: 3, order: '#CMD-1256', buyer: 'Moustafa Fall', amount: 7500, method: 'Wave', status: 'en_attente', date: '16 mai 2024' },
  { id: 4, order: '#CMD-1255', buyer: 'Aissatou Kane', amount: 16000, method: 'Carte bancaire', status: 'complete', date: '14 mai 2024' },
];

const withdrawals = [
  { id: 1, producer: 'Amadou Ba', amount: 150000, method: 'Wave', status: 'traite', date: '15 mai 2024' },
  { id: 2, producer: 'Alpha Ndiaye', amount: 85000, method: 'Orange Money', status: 'en_attente', date: '17 mai 2024' },
];

export default function AdminPaiementsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Paiements</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Revenus plateforme', value: formatPrice(24580000), icon: <DollarSign size={20} />, bg: '#EAF7EF', color: '#0B6B32' },
          { label: 'Commissions', value: formatPrice(1845000), icon: <DollarSign size={20} />, bg: '#FEF3C7', color: '#D97706' },
          { label: 'Retraits producteurs', value: formatPrice(235000), icon: <ArrowDownCircle size={20} />, bg: '#FFF7ED', color: '#F97316' },
          { label: 'En attente', value: formatPrice(85000), icon: <Clock size={20} />, bg: '#FEF2F2', color: '#EF4444' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <p className="stat-label">{s.label}</p>
            <p className="stat-value" style={{ fontSize: 18 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Paiements récents</h3>
      <div className="card" style={{ marginBottom: 28 }}>
        <table className="data-table">
          <thead><tr><th>Commande</th><th>Acheteur</th><th>Montant</th><th>Méthode</th><th>Statut</th><th>Date</th></tr></thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.order}</td>
                <td>{p.buyer}</td>
                <td style={{ fontWeight: 600 }}>{formatPrice(p.amount)}</td>
                <td>{p.method}</td>
                <td><span className="badge" style={{ background: p.status === 'complete' ? '#F0FDF4' : '#FFF7ED', color: p.status === 'complete' ? '#22C55E' : '#F97316' }}>{p.status === 'complete' ? 'Complété' : 'En attente'}</span></td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Demandes de retrait</h3>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Producteur</th><th>Montant</th><th>Méthode</th><th>Statut</th><th>Date</th></tr></thead>
          <tbody>
            {withdrawals.map(w => (
              <tr key={w.id}>
                <td style={{ fontWeight: 600 }}>{w.producer}</td>
                <td style={{ fontWeight: 600 }}>{formatPrice(w.amount)}</td>
                <td>{w.method}</td>
                <td><span className="badge" style={{ background: w.status === 'traite' ? '#F0FDF4' : '#FFF7ED', color: w.status === 'traite' ? '#22C55E' : '#F97316' }}>{w.status === 'traite' ? 'Traité' : 'En attente'}</span></td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{w.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
