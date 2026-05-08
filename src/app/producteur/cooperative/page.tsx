'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Users, Wallet, TrendingUp, ShieldCheck, Pencil, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Member {
  id: string;
  name: string;
  village: string;
  farmSize: number;
  contribution: number; // in Kg
}

export default function CooperativePage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Mamadou Diallo', village: 'Fass', farmSize: 1.5, contribution: 450 },
    { id: '2', name: 'Aïssatou Sow', village: 'Mbour', farmSize: 0.8, contribution: 200 },
    { id: '3', name: 'Oumar Fall', village: 'Fass', farmSize: 2.2, contribution: 850 },
  ]);

  const totalContribution = members.reduce((sum, m) => sum + m.contribution, 0);
  const totalRevenue = totalContribution * 500; // Assuming 500F/Kg for calculation

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button className="page-header-back" onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
        <h1>Ma Coopérative (GIE)</h1>
        <button style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div style={{ padding: 20 }}>
        {/* Résumé GIE */}
        <div style={{ background: 'linear-gradient(135deg, #0B6B32 0%, #16A34A 100%)', borderRadius: 16, padding: 24, color: '#fff', marginBottom: 24, boxShadow: '0 4px 12px rgba(11, 107, 50, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} color="#fff" />
            </div>
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
            Lors d'une vente groupée, PayDunya redistribue automatiquement les fonds sur le compte Wave/Orange Money de chaque membre selon sa contribution.
          </p>
          <div style={{ background: '#F3F4F6', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
            <ShieldCheck size={16} color="#059669" /> Répartition sécurisée et transparente
          </div>
        </div>

        {/* Liste des membres */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Membres du GIE</h2>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', background: 'var(--surface)', padding: '4px 8px', borderRadius: 12 }}>
            Total : {members.length}
          </span>
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
                  <span style={{ background: '#EFF6FF', color: '#3B82F6', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                    {percentage}%
                  </span>
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
                  <button
                    onClick={() => alert(`Modifier les informations de ${member.name}`)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: 8, background: '#EFF6FF', color: '#1D4ED8', fontSize: 12, fontWeight: 700, border: 'none' }}
                  >
                    <Pencil size={13} /> Modifier
                  </button>
                  <button
                    onClick={() => { if (confirm(`Retirer ${member.name} du GIE ?`)) setMembers(prev => prev.filter(m => m.id !== member.id)); }}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', borderRadius: 8, background: '#FEF2F2', color: '#DC2626', fontSize: 12, fontWeight: 700, border: 'none' }}
                  >
                    <Trash2 size={13} /> Retirer
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
