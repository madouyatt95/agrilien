'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, X, Gavel, Clock, Users, TrendingUp, Star, Check, MapPin, PenTool } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Tender } from '@/types';

export interface MockBid {
  id: string; producerName: string; farmName: string; region: string; pricePerUnit: number; quantity: number; rating: number; message: string; isNew?: boolean;
}

const initialMockBids: Record<string, MockBid[]> = {
  'tender-1': [
    { id: 'b1', producerName: 'Amadou Ba', farmName: 'Ferme Ba', region: 'Kolda', pricePerUnit: 420, quantity: 2000, rating: 4.8, message: 'Mangues Kent bio, récolte prévue mi-juin. Livraison en 3 lots possible.' },
    { id: 'b2', producerName: 'Ousmane Diallo', farmName: 'Ferme du Saloum', region: 'Fatick', pricePerUnit: 450, quantity: 1500, rating: 4.6, message: 'Qualité export garantie, calibre 400-600g.' },
    { id: 'b3', producerName: 'Ibrahima Seck', farmName: 'Verger Casamance', region: 'Ziguinchor', pricePerUnit: 380, quantity: 2000, rating: 4.3, message: 'Prix compétitif, transport inclus depuis Ziguinchor.' },
    { id: 'b4', producerName: 'Mariama Ndiaye', farmName: 'Exploitation Niayes', region: 'Thiès', pricePerUnit: 500, quantity: 800, rating: 4.9, message: 'Mangues premium sans pesticides, certifiées bio.' },
  ],
  'tender-2': [
    { id: 'b5', producerName: 'Alpha Ndiaye', farmName: 'Alpha Trading', region: 'Thiès', pricePerUnit: 400, quantity: 5000, rating: 4.5, message: 'Stock complet disponible, qualité export.' },
    { id: 'b6', producerName: 'Cheikh Diop', farmName: 'Diop & Fils', region: 'Thiès', pricePerUnit: 430, quantity: 3000, rating: 4.4, message: 'Oignons calibre 60-80mm, stockage frigorifique.' },
  ],
};

export default function AppelsOffresAcheteurPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  
  const [liveBids, setLiveBids] = useState(initialMockBids);
  const [signatureModal, setSignatureModal] = useState<{ open: boolean, tenderId: string | null, bid: MockBid | null }>({ open: false, tenderId: null, bid: null });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!selectedTender || selectedTender.status !== 'ouvert') return;
    const interval = setInterval(() => {
      const currentBids = liveBids[selectedTender.id] || [];
      if (currentBids.length > 5) return;
      const newBid: MockBid = {
        id: `b_live_${Date.now()}`,
        producerName: `Nouveau Producteur ${currentBids.length + 1}`,
        farmName: 'Ferme Locale',
        region: 'Dakar',
        pricePerUnit: (currentBids[0]?.pricePerUnit || 400) - 10,
        quantity: selectedTender.quantity,
        rating: 4.9,
        message: 'Offre compétitive en direct ! Prêt à livrer.',
        isNew: true
      };
      setLiveBids(prev => ({
        ...prev,
        [selectedTender.id]: [newBid, ...prev[selectedTender.id] || []]
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, [selectedTender, liveBids]);

  const [tenders, setTenders] = useState<Tender[]>([
    {
      id: 'tender-1', buyerName: 'Chef', buyerCompany: 'Restaurant La Fourchette',
      product: 'Mangues Kent', quantity: 2000, unit: 'Kg', maxBudget: 900000,
      deadline: '2024-06-20', deliveryLocation: 'Almadies, Dakar',
      description: 'Mangues Kent mûres, calibre moyen à gros. Livraison en 3 lots échelonnés.',
      status: 'ouvert', bidsCount: 4, createdAt: '2024-05-15',
    },
    {
      id: 'tender-2', buyerName: 'Chef', buyerCompany: 'Restaurant La Fourchette',
      product: 'Oignons Rosés', quantity: 5000, unit: 'Kg', maxBudget: 2250000,
      deadline: '2024-07-01', deliveryLocation: 'Almadies, Dakar',
      description: 'Oignons rosés de Thiès pour conservation longue durée. Qualité export exigée.',
      status: 'ouvert', bidsCount: 2, createdAt: '2024-05-18',
    },
  ]);

  const openSignature = (tenderId: string, bid: MockBid) => {
    setSelectedTender(null);
    setSignatureModal({ open: true, tenderId, bid });
  };

  const handleSignContract = () => {
    if (!signatureModal.tenderId) return;
    setTenders(prev => prev.map(t => t.id === signatureModal.tenderId ? { ...t, status: 'fermé' } : t));
    setSignatureModal({ open: false, tenderId: null, bid: null });
    alert('🎉 Contrat signé avec succès ! Le producteur a été notifié et le Smart Contract est enregistré.');
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button className="page-header-back" onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
        <h1>Mes Appels d&apos;Offres</h1>
        <button onClick={() => setShowModal(true)} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 13 }}>
          <Plus size={20} />
        </button>
      </div>

      <div style={{ padding: 20 }}>
        {/* Info Banner */}
        <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)', borderRadius: 16, padding: 20, color: '#fff', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Gavel size={24} />
            <h2 style={{ fontSize: 17, fontWeight: 800 }}>Marché de Gros B2B</h2>
          </div>
          <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5 }}>
            Publiez vos besoins en volume. Les producteurs certifiés AgriLien vous enverront leurs meilleures offres de prix.
          </p>
        </div>

        {/* Tenders List */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Appels en cours</h3>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tenders.length} actif{tenders.length > 1 ? 's' : ''}</span>
        </div>

        {tenders.map(tender => (
          <div key={tender.id} className="card" style={{ padding: 16, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{tender.product}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{tender.quantity.toLocaleString()} {tender.unit} demandés</p>
              </div>
              <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                Ouvert
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ background: 'var(--bg)', padding: 10, borderRadius: 8 }}>
                <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 2 }}>Budget max</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(tender.maxBudget)}</p>
              </div>
              <div style={{ background: 'var(--bg)', padding: 10, borderRadius: 8 }}>
                <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 2 }}>Date limite</p>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{new Date(tender.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                <Users size={14} /> {tender.bidsCount} offre{tender.bidsCount > 1 ? 's' : ''} reçue{tender.bidsCount > 1 ? 's' : ''}
              </div>
              <button onClick={() => setSelectedTender(tender)} style={{ fontSize: 13, color: '#fff', background: '#7C3AED', padding: '6px 14px', borderRadius: 8, fontWeight: 700 }}>Voir les offres</button>
            </div>
          </div>
        ))}

        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-block btn-lg" style={{ marginTop: 12, background: '#7C3AED', borderColor: '#7C3AED' }}>
          <Plus size={18} style={{ marginRight: 6 }} /> Publier un nouvel appel
        </button>
      </div>

      {/* Modal Nouvel Appel */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: 'var(--bg)', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 24px 40px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Nouvel Appel d&apos;Offres</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'var(--surface)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={e => { e.preventDefault(); setShowModal(false); alert('Appel d\'offres publié ! Les producteurs Premium seront notifiés.'); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Produit recherché</label>
                <input required placeholder="Ex: Mangues Kent, Oignons..." style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Quantité (Kg)</label>
                  <input required type="number" placeholder="Ex: 5000" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Budget max (FCFA)</label>
                  <input required type="number" placeholder="Ex: 2000000" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Date limite de réponse</label>
                <input required type="date" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Lieu de livraison</label>
                <input required placeholder="Ex: Marché Sandaga, Dakar" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Détails & exigences</label>
                <textarea required placeholder="Calibre, qualité, conditions de livraison..." rows={3} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', resize: 'none' }} />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 8, background: '#7C3AED', borderColor: '#7C3AED' }}>
                Publier l&apos;appel d&apos;offres
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détail des offres reçues */}
      {selectedTender && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: 'var(--bg)', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 24px 40px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                Offres pour {selectedTender.product}
                {selectedTender.status === 'ouvert' && (
                  <span style={{ fontSize: 10, background: '#EF4444', color: '#fff', padding: '2px 8px', borderRadius: 10, animation: 'pulseDot 2s infinite' }}>🔴 LIVE BIDDING</span>
                )}
              </h2>
              <button onClick={() => setSelectedTender(null)} style={{ background: 'var(--surface)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>{selectedTender.quantity.toLocaleString()} {selectedTender.unit} demandés • Budget max : {formatPrice(selectedTender.maxBudget)}</p>

            {(liveBids[selectedTender.id] || []).sort((a, b) => a.pricePerUnit - b.pricePerUnit).map((bid, i) => (
              <div key={bid.id} className="card" style={{ padding: 16, marginBottom: 12, border: i === 0 ? '2px solid var(--success)' : '1px solid transparent', animation: bid.isNew ? 'slideUp 0.5s ease' : 'none', background: bid.isNew ? '#F0FDF4' : '#fff' }}>
                {i === 0 && <span style={{ display: 'inline-block', background: '#D1FAE5', color: '#065F46', padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>💎 Meilleur prix</span>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15 }}>{bid.producerName}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{bid.farmName} • <MapPin size={11} style={{ display: 'inline' }} /> {bid.region}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#FBBF24' }}>
                    <Star size={13} fill="#FBBF24" /> {bid.rating}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.4, fontStyle: 'italic' }}>"{bid.message}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-light)' }}>Prix proposé</p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(bid.pricePerUnit)} / {selectedTender.unit}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-light)' }}>Quantité dispo</p>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{bid.quantity.toLocaleString()} {selectedTender.unit}</p>
                  </div>
                </div>
                <button 
                  onClick={() => i === 0 && openSignature(selectedTender.id, bid)}
                  className="btn btn-primary btn-block" 
                  style={{ marginTop: 12, background: i === 0 ? 'var(--primary)' : 'var(--surface)', color: i === 0 ? '#fff' : 'var(--text)', borderColor: i === 0 ? 'var(--primary)' : 'var(--border)' }}>
                  {i === 0 ? <><PenTool size={16} style={{ marginRight: 6 }} /> Accepter & Signer</> : 'Sélectionner'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {signatureModal.open && signatureModal.bid && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: '#fff', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 24px 40px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>Signature du contrat</h2>
              <button onClick={() => setSignatureModal({ open: false, tenderId: null, bid: null })} style={{ background: 'var(--surface)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Résumé de l'accord B2B</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Producteur :</span>
                <span>{signatureModal.bid.producerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>Prix final :</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{formatPrice(signatureModal.bid.pricePerUnit)} / unité</span>
              </div>
            </div>

            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Veuillez signer ci-dessous :</p>
            <div style={{ border: '2px dashed var(--border)', borderRadius: 12, overflow: 'hidden', background: '#FAFAFA', marginBottom: 12 }}>
              <canvas
                ref={canvasRef}
                width={350}
                height={150}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{ width: '100%', cursor: 'crosshair', touchAction: 'none' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={clearSignature} className="btn btn-outline" style={{ flex: 1 }}>Effacer</button>
              <button onClick={handleSignContract} className="btn btn-primary" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#10B981', borderColor: '#10B981' }}>
                <PenTool size={18} /> Valider la signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
