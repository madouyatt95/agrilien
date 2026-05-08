'use client';
import { Bell, Shield, Globe, Palette, Database } from 'lucide-react';

export default function AdminParametresPage() {
  const sections = [
    { title: 'Général', icon: <Globe size={20} />, desc: 'Nom de la plateforme, logo, langue, devise', bg: '#EAF7EF', color: '#0B6B32' },
    { title: 'Notifications', icon: <Bell size={20} />, desc: 'Configurer les notifications email et push', bg: '#EFF6FF', color: '#3B82F6' },
    { title: 'Sécurité', icon: <Shield size={20} />, desc: 'Authentification, mots de passe, sessions', bg: '#FEF2F2', color: '#EF4444' },
    { title: 'Apparence', icon: <Palette size={20} />, desc: 'Thème, couleurs, typographie', bg: '#FEF3C7', color: '#D97706' },
    { title: 'Base de données', icon: <Database size={20} />, desc: 'Connexion Supabase, migrations, sauvegardes', bg: '#F0FDF4', color: '#22C55E' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Paramètres</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sections.map((s, i) => (
          <div key={i} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
