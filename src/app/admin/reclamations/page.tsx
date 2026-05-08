'use client';
import { AlertCircle } from 'lucide-react';

const complaints = [
  { id: 1, user: 'Fatou Diop', order: '#CMD-1258', subject: 'Produit endommagé à la livraison', priority: 'haute', status: 'ouvert', date: '18 mai 2024' },
  { id: 2, user: 'Moustafa Fall', order: '#CMD-1256', subject: 'Retard de livraison', priority: 'moyenne', status: 'en_cours', date: '16 mai 2024' },
  { id: 3, user: 'Ba & Frères', order: '#CMD-1254', subject: 'Quantité incorrecte', priority: 'basse', status: 'resolu', date: '12 mai 2024' },
];

const priorityColors: Record<string, { bg: string; color: string }> = {
  haute: { bg: '#FEF2F2', color: '#EF4444' },
  moyenne: { bg: '#FFF7ED', color: '#F97316' },
  basse: { bg: '#F0FDF4', color: '#22C55E' },
};
const statusLabels: Record<string, string> = { ouvert: 'Ouvert', en_cours: 'En cours', resolu: 'Résolu' };

export default function AdminReclamationsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Réclamations</h1>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Utilisateur</th><th>Commande</th><th>Sujet</th><th>Priorité</th><th>Statut</th><th>Date</th></tr></thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.user}</td>
                <td>{c.order}</td>
                <td>{c.subject}</td>
                <td><span className="badge" style={{ background: priorityColors[c.priority].bg, color: priorityColors[c.priority].color }}>{c.priority.charAt(0).toUpperCase() + c.priority.slice(1)}</span></td>
                <td><span className="badge" style={{ background: c.status === 'resolu' ? '#F0FDF4' : c.status === 'en_cours' ? '#EFF6FF' : '#FFF7ED', color: c.status === 'resolu' ? '#22C55E' : c.status === 'en_cours' ? '#3B82F6' : '#F97316' }}>{statusLabels[c.status]}</span></td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
