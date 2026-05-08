'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Bot, Plus, Target, Clock, CheckCircle, AlertTriangle, Settings, RefreshCw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Mission {
  id: string;
  product: string;
  quantity: string;
  budget: string;
  frequency: string;
  status: 'searching' | 'negotiating' | 'completed' | 'paused';
  createdAt: string;
  matches: number;
}

const mockMissions: Mission[] = [
  { id: 'm1', product: 'Tomates fraîches', quantity: '100 Kg', budget: '600F/Kg', frequency: 'Hebdomadaire', status: 'searching', createdAt: '2024-05-08', matches: 3 },
  { id: 'm2', product: 'Mil Souna', quantity: '5 Tonnes', budget: '280F/Kg', frequency: 'Ponctuel', status: 'negotiating', createdAt: '2024-05-07', matches: 1 },
  { id: 'm3', product: 'Oignons roses', quantity: '500 Kg', budget: '400F/Kg', frequency: 'Mensuel', status: 'completed', createdAt: '2024-05-01', matches: 5 },
];

export default function AgentIAPage() {
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  const [showNewMission, setShowNewMission] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  
  const [newMission, setNewMission] = useState({
    product: '',
    quantity: '',
    budget: '',
    frequency: 'Ponctuel'
  });

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    
    // Simuler le déploiement de l'IA
    setTimeout(() => {
      setMissions([{
        id: `m${Date.now()}`,
        product: newMission.product,
        quantity: newMission.quantity,
        budget: newMission.budget,
        frequency: newMission.frequency,
        status: 'searching',
        createdAt: new Date().toISOString().split('T')[0],
        matches: 0
      }, ...missions]);
      setIsDeploying(false);
      setShowNewMission(false);
      setNewMission({ product: '', quantity: '', budget: '', frequency: 'Ponctuel' });
    }, 1500);
  };

  const getStatusColor = (status: Mission['status']) => {
    switch(status) {
      case 'searching': return '#3B82F6';
      case 'negotiating': return '#F59E0B';
      case 'completed': return '#10B981';
      case 'paused': return '#6B7280';
    }
  };

  const getStatusLabel = (status: Mission['status']) => {
    switch(status) {
      case 'searching': return 'Recherche en cours...';
      case 'negotiating': return 'Négociation (IA)';
      case 'completed': return 'Sécurisé';
      case 'paused': return 'En pause';
    }
  };

  const getStatusIcon = (status: Mission['status']) => {
    switch(status) {
      case 'searching': return <RefreshCw size={14} className="spin" color="#3B82F6" />;
      case 'negotiating': return <AlertTriangle size={14} color="#F59E0B" />;
      case 'completed': return <CheckCircle size={14} color="#10B981" />;
      case 'paused': return <Settings size={14} color="#6B7280" />;
    }
  };

  return (
    <div style={{ background: '#0F172A', minHeight: '100vh', color: '#F8FAFC', paddingBottom: 100 }}>
      {/* HEADER */}
      <div style={{ padding: '20px', background: 'linear-gradient(to bottom, #1E293B, #0F172A)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot size={22} color="#38BDF8" /> Agent IA <span style={{ fontSize: 10, background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '2px 6px', borderRadius: 10, textTransform: 'uppercase' }}>Premium</span>
            </h1>
          </div>
        </div>
        <p style={{ fontSize: 14, color: '#94A3B8' }}>Déléguez votre sourcing B2B à notre intelligence artificielle. L'agent cherche, négocie et sécurise pour vous, 24h/24.</p>
      </div>

      <div style={{ padding: '0 20px' }}>
        {showNewMission ? (
          <div style={{ background: '#1E293B', borderRadius: 16, padding: 20, border: '1px solid #334155', animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#fff' }}>Déployer une nouvelle mission</h2>
            <form onSubmit={handleDeploy}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Que cherchez-vous ?</label>
                <input required value={newMission.product} onChange={e => setNewMission({...newMission, product: e.target.value})} placeholder="Ex: Oignons Galmi, Mangues..." style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #475569', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Quantité</label>
                  <input required value={newMission.quantity} onChange={e => setNewMission({...newMission, quantity: e.target.value})} placeholder="Ex: 500 Kg" style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #475569', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Budget Max</label>
                  <input required value={newMission.budget} onChange={e => setNewMission({...newMission, budget: e.target.value})} placeholder="Ex: 400F/Kg" style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #475569', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }} />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>Fréquence</label>
                <select value={newMission.frequency} onChange={e => setNewMission({...newMission, frequency: e.target.value})} style={{ width: '100%', padding: '12px', background: '#0F172A', border: '1px solid #475569', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' }}>
                  <option value="Ponctuel">Achat Unique (Ponctuel)</option>
                  <option value="Hebdomadaire">Hebdomadaire</option>
                  <option value="Mensuel">Mensuel</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowNewMission(false)} style={{ flex: 1, padding: 14, background: 'transparent', border: '1px solid #475569', borderRadius: 12, color: '#F8FAFC', fontWeight: 600 }}>Annuler</button>
                <button type="submit" disabled={isDeploying} style={{ flex: 2, padding: 14, background: '#38BDF8', border: 'none', borderRadius: 12, color: '#0F172A', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                  {isDeploying ? <RefreshCw size={18} className="spin" /> : <><Bot size={18} /> Déployer l'Agent</>}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={() => setShowNewMission(true)} style={{ width: '100%', padding: 16, background: '#1E293B', border: '1px dashed #475569', borderRadius: 16, color: '#38BDF8', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <Plus size={20} /> Nouvelle mission de sourcing
          </button>
        )}

        {/* MISSIONS ACTIVES */}
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, marginTop: showNewMission ? 24 : 0 }}>Missions ({missions.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {missions.map(m => (
            <div key={m.id} style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{m.product}</h3>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#94A3B8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Target size={12} /> {m.quantity} à {m.budget}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {m.frequency}</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 8, fontSize: 11, color: '#94A3B8' }}>
                  {m.createdAt}
                </div>
              </div>
              
              <div style={{ background: '#0F172A', padding: '10px 12px', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: getStatusColor(m.status) }}>
                  {getStatusIcon(m.status)} {getStatusLabel(m.status)}
                </div>
                <span style={{ fontSize: 12, color: '#F8FAFC', fontWeight: 600, background: '#334155', padding: '2px 8px', borderRadius: 12 }}>
                  {m.matches} offres trouvées
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
