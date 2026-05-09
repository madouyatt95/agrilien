'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { allProducers, buyerUser } from '@/data/mock-users';
import { ShieldCheck, Search, Edit, Ban, Mail } from 'lucide-react';

function UtilisateursContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'producteurs';
  const initialUsers: any[] = type === 'producteurs' ? allProducers : [buyerUser];
  
  const [usersList, setUsersList] = useState(initialUsers);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleBan = (id: string, name: string) => {
    if (confirm(`Voulez-vous suspendre le compte de ${name} ?`)) {
      setUsersList(usersList.filter((u: any) => u.id !== id));
      showToast(`Le compte de ${name} a été suspendu.`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>
          {type === 'producteurs' ? 'Producteurs' : type === 'acheteurs' ? 'Acheteurs' : 'Administrateurs'}
        </h1>
        <div className="search-bar" style={{ maxWidth: 300 }}>
          <Search size={18} color="#9CA3AF" />
          <input placeholder="Rechercher un utilisateur..." />
        </div>
      </div>
      <div className="card">
        <table className="data-table">
          <thead><tr><th>Utilisateur</th><th>Email</th><th>Région</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {usersList.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={u.photo} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <p style={{ fontWeight: 600 }}>{u.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.phone}</p>
                    </div>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.region}</td>
                <td><span className="badge" style={{ background: '#F0FDF4', color: '#22C55E' }}><ShieldCheck size={12} /> Vérifié</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => showToast(`✉️ Envoi de message à ${u.name}`)} style={{ color: '#8B5CF6', background: '#F5F3FF', padding: 6, borderRadius: 6 }} title="Contacter">
                      <Mail size={16} />
                    </button>
                    <button onClick={() => showToast(`✏️ Édition du profil: ${u.name}`)} style={{ color: '#3B82F6', background: '#EFF6FF', padding: 6, borderRadius: 6 }} title="Modifier">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleBan(u.id, u.name)} style={{ color: '#EF4444', background: '#FEF2F2', padding: 6, borderRadius: 6 }} title="Suspendre le compte">
                      <Ban size={16} />
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

export default function UtilisateursPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Chargement...</div>}>
      <UtilisateursContent />
    </Suspense>
  );
}
