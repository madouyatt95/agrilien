'use client';
import { Download, Calendar, FileText, BarChart3 } from 'lucide-react';

export default function AdminRapportsPage() {
  const reports = [
    { title: 'Rapport des ventes', desc: 'Ventes par période, par région, par catégorie', icon: <BarChart3 size={20} />, bg: '#EAF7EF', color: '#0B6B32' },
    { title: 'Rapport des utilisateurs', desc: 'Inscriptions, activité, rétention', icon: <FileText size={20} />, bg: '#EFF6FF', color: '#3B82F6' },
    { title: 'Rapport financier', desc: 'Revenus, commissions, retraits, impayés', icon: <FileText size={20} />, bg: '#FEF3C7', color: '#D97706' },
    { title: 'Rapport des produits', desc: 'Top produits, catégories, stocks', icon: <FileText size={20} />, bg: '#FFF7ED', color: '#F97316' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Rapports</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm"><Calendar size={16} /> Période</button>
          <button className="btn btn-primary btn-sm"><Download size={16} /> Exporter tout</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {reports.map((r, i) => (
          <div key={i} className="card card-padded" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div className="stat-icon" style={{ background: r.bg, color: r.color }}>{r.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{r.title}</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{r.desc}</p>
            <button className="btn btn-outline btn-sm"><Download size={14} /> Télécharger</button>
          </div>
        ))}
      </div>
    </div>
  );
}
