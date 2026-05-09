'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Gavel, MapPin, Calendar, Send, Clock, Star, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Tender } from '@/types';

export default function AppelsOffresProducteurPage() {
  const router = useRouter();
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [bidSent, setBidSent] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const [tenders] = useState<Tender[]>([
    {
      id: 'tender-1', buyerName: 'Chef', buyerCompany: 'Restaurant La Fourchette',
      product: 'Mangues Kent', quantity: 2000, unit: 'Kg', maxBudget: 900000,
      deadline: '2024-06-20', deliveryLocation: 'Almadies, Dakar',
      description: 'Mangues Kent mûres, calibre moyen à gros. Livraison en 3 lots échelonnés sur juin.',
      status: 'ouvert', bidsCount: 4, createdAt: '2024-05-15',
    },
    {
      id: 'tender-2', buyerName: 'Moussa', buyerCompany: 'Auchan Sénégal',
      product: 'Oignons Rosés', quantity: 10000, unit: 'Kg', maxBudget: 4500000,
      deadline: '2024-07-01', deliveryLocation: 'Entrepôt Diamnadio',
      description: 'Oignons rosés qualité export, calibre 60-80mm. Certificat de traçabilité AgriLien exigé.',
      status: 'ouvert', bidsCount: 7, createdAt: '2024-05-18',
    },
    {
      id: 'tender-3', buyerName: 'Ibrahima', buyerCompany: 'PAM (Programme Alimentaire Mondial)',
      product: 'Riz Local Étuvé', quantity: 50000, unit: 'Kg', maxBudget: 35000000,
      deadline: '2024-08-15', deliveryLocation: 'Entrepôt Ziguinchor',
      description: 'Riz local étuvé pour distribution humanitaire. Normes FAO requises. Contrat de 6 mois renouvelable.',
      status: 'ouvert', bidsCount: 12, createdAt: '2024-05-10',
    },
  ]);

  const handleBid = (tenderId: string) => {
    setBidSent(prev => [...prev, tenderId]);
    setSelectedTender(null);
    showToast('✅ Votre offre a été envoyée avec succès à l\'acheteur.');
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button className="page-header-back" onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
        <h1>Appels d&apos;Offres</h1>
        <div style={{ width: 24 }} />
      </div>

      <div style={{ padding: 20 }}>
        {/* Info */}
        <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: 16, padding: 20, color: '#fff', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Gavel size={22} />
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>Marchés Disponibles</h2>
            <span style={{ background: '#FBBF24', color: '#111', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800 }}>PREMIUM</span>
          </div>
          <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>
            Des acheteurs professionnels recherchent vos produits en gros volume. Soumettez votre meilleure offre pour décrocher le contrat.
          </p>
        </div>

        {/* Liste des appels d'offres */}
        {tenders.map(tender => (
          <div key={tender.id} className="card" style={{ padding: 16, marginBottom: 14, border: bidSent.includes(tender.id) ? '2px solid var(--success)' : '1px solid transparent' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>{tender.buyerCompany}</p>
                <h4 style={{ fontSize: 17, fontWeight: 800 }}>{tender.product}</h4>
              </div>
              {bidSent.includes(tender.id) ? (
                <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                  ✓ Offre envoyée
                </span>
              ) : (
                <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                  Ouvert
                </span>
              )}
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
              {tender.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
              <div style={{ background: 'var(--bg)', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: 'var(--text-light)' }}>Volume</p>
                <p style={{ fontSize: 14, fontWeight: 800 }}>{(tender.quantity / 1000).toFixed(0)}T</p>
              </div>
              <div style={{ background: 'var(--bg)', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: 'var(--text-light)' }}>Budget</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(tender.maxBudget)}</p>
              </div>
              <div style={{ background: 'var(--bg)', padding: 8, borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: 'var(--text-light)' }}>Offres</p>
                <p style={{ fontSize: 14, fontWeight: 800 }}>{tender.bidsCount}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {tender.deliveryLocation}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> Avant le {new Date(tender.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
            </div>

            {!bidSent.includes(tender.id) && (
              <button
                onClick={() => setSelectedTender(tender)}
                className="btn btn-primary btn-block"
                style={{ background: '#7C3AED', borderColor: '#7C3AED' }}
              >
                <Send size={16} style={{ marginRight: 6 }} /> Soumettre mon offre
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal Soumission */}
      {selectedTender && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: 'var(--bg)', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 24px 40px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Soumissionner</h2>
              <button onClick={() => setSelectedTender(null)} style={{ background: 'var(--surface)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 700 }}>{selectedTender.product}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selectedTender.buyerCompany}</p>
              </div>
              <p style={{ fontWeight: 800, color: 'var(--primary)' }}>{(selectedTender.quantity / 1000).toFixed(0)} Tonnes</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); handleBid(selectedTender.id); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Prix proposé (FCFA)</label>
                  <input required type="number" placeholder={`Max: ${Math.round(selectedTender.maxBudget / selectedTender.quantity)}`} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Quantité disponible</label>
                  <input required type="number" placeholder={`Max: ${selectedTender.quantity}`} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Délai de livraison</label>
                <input required placeholder="Ex: Livrable en 48h" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Commentaire libre</label>
                <textarea placeholder="Précisez la qualité, le transport..." rows={3} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', resize: 'none' }} />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ background: '#7C3AED', borderColor: '#7C3AED' }}>
                <Send size={18} style={{ marginRight: 6 }} /> Envoyer mon offre
              </button>
            </form>
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
