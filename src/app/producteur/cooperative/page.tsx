'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Users, Wallet, TrendingUp, ShieldCheck, Pencil, Trash2, X, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Member {
  id: string;
  name: string;
  village: string;
  farmSize: number;
  contribution: number;
}

export default function CooperativePage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Mamadou Diallo', village: 'Fass', farmSize: 1.5, contribution: 450 },
    { id: '2', name: 'Aïssatou Sow', village: 'Mbour', farmSize: 0.8, contribution: 200 },
    { id: '3', name: 'Oumar Fall', village: 'Fass', farmSize: 2.2, contribution: 850 },
  ]);

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState({ name: '', village: '', farmSize: '', contribution: '' });
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const totalContribution = members.reduce((sum, m) => sum + m.contribution, 0);
  const totalRevenue = totalContribution * 500;

  const openAddModal = () => {
    setEditingMember(null);
    setMemberForm({ name: '', village: '', farmSize: '', contribution: '' });
    setShowMemberModal(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setMemberForm({ name: member.name, village: member.village, farmSize: member.farmSize.toString(), contribution: member.contribution.toString() });
    setShowMemberModal(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: memberForm.name, village: memberForm.village, farmSize: parseFloat(memberForm.farmSize), contribution: parseInt(memberForm.contribution) };
    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...data } : m));
      showToast(`✅ ${data.name} a été mis à jour`);
    } else {
      setMembers(prev => [...prev, { id: Date.now().toString(), ...data }]);
      showToast(`✅ ${data.name} a été ajouté au GIE`);
    }
    setShowMemberModal(false);
  };

  const handleDelete = (id: string) => {
    const member = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    setConfirmDelete(null);
    showToast(`${member?.name} a été retiré du GIE`);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button className="page-header-back" onClick={() => router.back()}><ChevronLeft size={24} /></button>
        <h1>Ma Coopérative (GIE)</h1>
        <button onClick={openAddModal} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div style={{ padding: 20 }}>
        {/* Résumé GIE */}
        <div style={{ background: 'linear-gradient(135deg, #0B6B32 0%, #16A34A 100%)', borderRadius: 16, padding: 24, color: '#fff', marginBottom: 24, boxShadow: '0 4px 12px rgba(11, 107, 50, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={24} color="#fff" /></div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800 }}>GIE Bokk Jom</p>
              <p style={{ fontSize: 13, opacity: 0.9 }}>{members.length} membres actifs</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 16 }}>
            <div>
              <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Volume Groupé</p>
              <p style={{ fontSize: 20, fontWeight: 800 }}>{totalContribution} Kg</p>
            </div>
            <div>
              <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Revenus Estimés</p>
              <p style={{ fontSize: 20, fontWeight: 800 }}>{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Répartition PayDunya */}
        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Wallet size={20} color="var(--primary)" />
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Répartition automatique PayDunya</h2>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
            Lors d&apos;une vente groupée, PayDunya redistribue automatiquement les fonds sur le compte Wave/Orange Money de chaque membre selon sa contribution.
          </p>
          <div style={{ background: '#F3F4F6', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
            <ShieldCheck size={16} color="#059669" /> Répartition sécurisée et transparente
          </div>
        </div>

        {/* Liste des membres */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Membres du GIE</h2>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'var(--surface)', padding: '4px 8px', borderRadius: 12 }}>Total : {members.length}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {members.map(member => {
            const memberRevenue = member.contribution * 500;
            const percentage = Math.round((member.contribution / totalContribution) * 100);
            return (
              <div key={member.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{member.name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>📍 {member.village} • {member.farmSize} ha</p>
                  </div>
                  <span style={{ background: '#EFF6FF', color: '#3B82F6', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{percentage}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 2 }}>Apport</p>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{member.contribution} Kg</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 2 }}>Part des revenus</p>
                    <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(memberRevenue)}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 10 }}>
                  <button onClick={() => openEditModal(member)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: 8, background: '#EFF6FF', color: '#1D4ED8', fontSize: 12, fontWeight: 700, border: 'none' }}>
                    <Pencil size={13} /> Modifier
                  </button>
                  <button onClick={() => setConfirmDelete(member.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: 8, background: '#FEF2F2', color: '#DC2626', fontSize: 12, fontWeight: 700, border: 'none' }}>
                    <Trash2 size={13} /> Retirer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODALE AJOUT/MODIFICATION MEMBRE */}
      {showMemberModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowMemberModal(false)}>
          <div style={{ background: 'var(--surface)', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{editingMember ? 'Modifier le membre' : 'Ajouter un membre'}</h2>
              <button onClick={() => setShowMemberModal(false)} style={{ background: 'var(--bg)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveMember} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Nom complet</label>
                <input required value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} placeholder="Ex: Moussa Diallo" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Village</label>
                <input required value={memberForm.village} onChange={e => setMemberForm({...memberForm, village: e.target.value})} placeholder="Ex: Fass" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Superficie (ha)</label>
                  <input required type="number" step="0.1" value={memberForm.farmSize} onChange={e => setMemberForm({...memberForm, farmSize: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Contribution (Kg)</label>
                  <input required type="number" value={memberForm.contribution} onChange={e => setMemberForm({...memberForm, contribution: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)' }} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">{editingMember ? 'Enregistrer' : 'Ajouter au GIE'}</button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION SUPPRESSION */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setConfirmDelete(null)}>
          <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, maxWidth: 340, width: '100%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>⚠️</p>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Confirmer le retrait</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Voulez-vous vraiment retirer {members.find(m => m.id === confirmDelete)?.name} du GIE ?</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setConfirmDelete(null)} className="btn btn-outline" style={{ flex: 1 }}>Annuler</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, padding: 12, borderRadius: 12, background: '#EF4444', color: '#fff', fontWeight: 700, border: 'none' }}>Retirer</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 100, left: 20, right: 20, background: '#18181B', color: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{toast}</div>
      )}
    </div>
  );
}
