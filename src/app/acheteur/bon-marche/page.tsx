'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Upload, Camera, FileText, Sparkles, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type ExtractedItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  matched: boolean;
};

export default function BonMarchePage() {
  const router = useRouter();
  const [step, setStep] = useState<'upload' | 'processing' | 'results'>('upload');
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);

  const simulateExtraction = () => {
    setStep('processing');
    setTimeout(() => {
      setExtractedItems([
        { id: '1', name: 'Tomates Roma', quantity: 10, unit: 'Kg', estimatedPrice: 450, matched: true },
        { id: '2', name: 'Oignons Rosés', quantity: 5, unit: 'Kg', estimatedPrice: 500, matched: true },
        { id: '3', name: 'Riz Local Étuvé', quantity: 25, unit: 'Kg', estimatedPrice: 700, matched: true },
        { id: '4', name: 'Mangues Kent', quantity: 8, unit: 'Kg', estimatedPrice: 600, matched: true },
        { id: '5', name: 'Poulet fermier', quantity: 3, unit: 'Unité', estimatedPrice: 3000, matched: true },
        { id: '6', name: 'Piment vert', quantity: 2, unit: 'Kg', estimatedPrice: 800, matched: false },
      ]);
      setStep('results');
    }, 3000);
  };

  const updateQuantity = (id: string, delta: number) => {
    setExtractedItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeItem = (id: string) => {
    setExtractedItems(prev => prev.filter(item => item.id !== id));
  };

  const totalPrice = extractedItems.reduce((sum, item) => sum + (item.quantity * item.estimatedPrice), 0);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button onClick={() => step === 'results' ? setStep('upload') : router.back()}><ChevronLeft size={24} /></button>
        <h1>Commande assistée</h1>
        <div style={{ width: 24 }} />
      </div>

      <div style={{ padding: 20 }}>
        {step === 'upload' && (
          <>
            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '20px 0 30px' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Sparkles size={32} color="var(--primary)" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Importez votre liste</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 300, margin: '0 auto' }}>
                Prenez en photo une liste manuscrite ou importez un fichier. L'IA transforme automatiquement votre document en panier.
              </p>
            </div>

            {/* Upload options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <button onClick={simulateExtraction} style={{ padding: 24, borderRadius: 16, background: 'var(--surface)', border: '2px dashed var(--primary)', textAlign: 'center', cursor: 'pointer' }}>
                <Camera size={28} color="var(--primary)" style={{ margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary)', marginBottom: 4 }}>📸 Prendre une photo</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Liste manuscrite</p>
              </button>
              <button onClick={simulateExtraction} style={{ padding: 24, borderRadius: 16, background: 'var(--surface)', border: '2px dashed var(--border)', textAlign: 'center', cursor: 'pointer' }}>
                <Upload size={28} color="var(--text-secondary)" style={{ margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>📄 Importer un fichier</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>PDF, Excel, image</p>
              </button>
            </div>

            {/* How it works */}
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Comment ça marche ?</h3>
              {[
                { step: '1', icon: '📸', title: 'Capturez', desc: 'Prenez en photo votre liste de courses ou bon de marché' },
                { step: '2', icon: '🤖', title: 'Extraction IA', desc: 'L\'IA identifie les produits, quantités et unités' },
                { step: '3', icon: '✏️', title: 'Vérifiez', desc: 'Modifiez les quantités ou supprimez des produits' },
                { step: '4', icon: '🛒', title: 'Commandez', desc: 'Ajoutez tout au panier en un clic' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 3 ? 16 : 0, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{s.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', animation: 'pulse 1.5s ease infinite' }}>
              <Sparkles size={36} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Analyse en cours...</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>L'IA extrait les produits de votre liste</p>
            <div style={{ width: 200, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--primary)', borderRadius: 2, animation: 'loading 2s ease infinite', width: '60%' }} />
            </div>
          </div>
        )}

        {step === 'results' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: 12, background: '#F0FDF4', borderRadius: 12 }}>
              <Sparkles size={20} color="#22C55E" />
              <p style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>
                {extractedItems.length} produits détectés • {extractedItems.filter(i => !i.matched).length > 0 ? `${extractedItems.filter(i => !i.matched).length} non trouvé(s) dans le catalogue` : 'Tous trouvés dans le catalogue ✓'}
              </p>
            </div>

            {extractedItems.map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, marginBottom: 8, opacity: item.matched ? 1 : 0.7, borderLeft: item.matched ? '3px solid var(--primary)' : '3px solid #F59E0B' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatPrice(item.estimatedPrice)} / {item.unit}</p>
                  {!item.matched && <p style={{ fontSize: 11, color: '#F59E0B', fontWeight: 600, marginTop: 2 }}>⚠ Produit non trouvé — prix estimé</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => updateQuantity(item.id, -1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ fontWeight: 700, fontSize: 14, width: 30, textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FEF2F2', border: 'none', color: '#EF4444' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {/* Récapitulatif */}
            <div className="card" style={{ padding: 16, marginTop: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{extractedItems.length} produits</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total estimé</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 18, fontWeight: 800 }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button onClick={() => { showToast('🛒 Tous les produits ajoutés au panier !'); setTimeout(() => router.push('/acheteur/panier'), 1500); }} className="btn btn-primary btn-block btn-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <ShoppingCart size={20} /> Ajouter tout au panier
            </button>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}} />

      {toast && (
        <div style={{ position: 'fixed', bottom: 100, left: 20, right: 20, background: '#18181B', color: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{toast}</div>
      )}
    </div>
  );
}
