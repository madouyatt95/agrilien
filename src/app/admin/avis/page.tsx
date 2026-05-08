'use client';
import { Star } from 'lucide-react';

const reviews = [
  { id: 1, user: 'Fatou Diop', product: 'Mangues Kent', rating: 5, comment: 'Excellente qualité, très sucrées !', date: '18 mai 2024' },
  { id: 2, user: 'Alpha Trading', product: 'Maïs Séché', rating: 4, comment: 'Bon produit, livraison rapide.', date: '15 mai 2024' },
  { id: 3, user: 'Aissatou Kane', product: 'Miel Local', rating: 5, comment: 'Miel pur et délicieux, je recommande.', date: '14 mai 2024' },
  { id: 4, user: 'Moustafa Fall', product: 'Oignons Rosés', rating: 3, comment: 'Qualité correcte mais quelques oignons abîmés.', date: '12 mai 2024' },
];

export default function AdminAvisPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Avis & notes</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <p className="stat-value">4.6<span style={{ fontSize: 14, color: 'var(--text-secondary)' }}> / 5</span></p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '8px 0' }}>{[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= 4 ? '#FBBF24' : 'none'} color="#FBBF24" />)}</div>
          <p className="stat-label">Note moyenne</p>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}><p className="stat-value">1 247</p><p className="stat-label">Avis totaux</p></div>
        <div className="stat-card" style={{ textAlign: 'center' }}><p className="stat-value">92%</p><p className="stat-label">Avis positifs</p></div>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Utilisateur</th><th>Produit</th><th>Note</th><th>Commentaire</th><th>Date</th></tr></thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600 }}>{r.user}</td>
                <td>{r.product}</td>
                <td><div style={{ display: 'flex', gap: 1 }}>{[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= r.rating ? '#FBBF24' : 'none'} color="#FBBF24" />)}</div></td>
                <td style={{ maxWidth: 300, fontSize: 13 }}>{r.comment}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
