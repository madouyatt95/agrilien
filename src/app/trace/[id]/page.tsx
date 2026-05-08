'use client';

import { useParams, useRouter } from 'next/navigation';
import { products } from '@/data/mock-products';
import { producerUser } from '@/data/mock-users';
import { MapPin, ShieldCheck, Calendar, Leaf, ChevronLeft, Award } from 'lucide-react';
import AgriLienLogo from '@/components/ui/Logo';

export default function TraceabilityPage() {
  const params = useParams();
  const router = useRouter();
  const product = products.find(p => p.id === params.id) || products[0];

  return (
    <div className="trace-page" style={{ background: '#0F172A', minHeight: '100vh', paddingBottom: 40, color: '#F8FAFC' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .trace-page { font-family: 'Inter', sans-serif; }
        .glass-card { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; }
        .timeline-line { position: absolute; left: 11px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, #10B981, rgba(16, 185, 129, 0.1)); }
        .timeline-dot { position: absolute; left: -26px; top: 4px; width: 14px; height: 14px; border-radius: 50%; background: #10B981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2); animation: pulseDot 2s infinite; }
        @keyframes pulseDot { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .satellite-map { width: 100%; height: 250px; border-radius: 16px; background-image: url('https://images.unsplash.com/photo-1595055006622-c3167eb2149b?q=80&w=1000&auto=format&fit=crop'); background-size: cover; background-position: center; position: relative; overflow: hidden; }
        .radar-ping { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; border-radius: 50%; background: #F59E0B; }
        .radar-ping::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; border-radius: 50%; border: 2px solid #F59E0B; animation: radar 2s infinite; }
        @keyframes radar { 0% { width: 20px; height: 20px; opacity: 1; } 100% { width: 150px; height: 150px; opacity: 0; } }
      `}} />

      {/* Header Public */}
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <AgriLienLogo size="md" />
      </div>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#D1FAE5', color: '#065F46', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
            <ShieldCheck size={16} /> Produit Certifié AgriLien
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>Origine & Traçabilité</h1>
          <p style={{ color: '#6B7280', fontSize: 14 }}>Batch ID: {product.id.toUpperCase()}-2024</p>
        </div>

        {/* Produit Card */}
        <div className="glass-card" style={{ overflow: 'hidden', marginBottom: 20, padding: 4 }}>
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 20 }} />
          <div style={{ padding: '20px 16px' }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{product.name}</h2>
            <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#94A3B8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={16} color="#10B981" /> Récolté le : 12 Mai 2024</span>
            </div>
          </div>
        </div>

        {/* QR Code réel et scannable */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 20, textAlign: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#E2E8F0' }}>Code d'Authenticité</h3>
          <div style={{ background: '#fff', padding: 16, borderRadius: 16, display: 'inline-block', marginBottom: 12 }}>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://agrilien.sn/trace/${product.id}`)}&color=0B6B32`} 
              alt="QR Code Traçabilité" 
              style={{ width: 160, height: 160, borderRadius: 8 }} 
            />
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 4 }}>Blockchain ID Hash</p>
          <p style={{ fontSize: 11, fontFamily: 'monospace', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: 8, wordBreak: 'break-all' }}>0x{Math.random().toString(16).slice(2, 10)}...{Math.random().toString(16).slice(2, 8)}</p>
        </div>

        {/* Producteur Card */}
        <div className="glass-card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#E2E8F0' }}>
            <MapPin size={20} color="#10B981" /> Vue Satellite de l'Exploitation
          </h3>
          <div className="satellite-map">
            <div className="radar-ping"></div>
            <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 6, fontSize: 10, backdropFilter: 'blur(4px)' }}>
              14°41'34.0"N 17°26'48.0"W
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
            <img src={producerUser.photo} alt={producerUser.name} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #10B981' }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 16 }}>{producerUser.name}</p>
              <p style={{ fontSize: 13, color: '#94A3B8' }}>{producerUser.farmName}</p>
            </div>
          </div>
          <div style={{ marginTop: 20, padding: 12, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 12, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <p style={{ fontSize: 12, color: '#34D399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} /> Pratiques Agricoles Certifiées Durables
            </p>
          </div>
        </div>

        {/* Parcours */}
        <div className="glass-card" style={{ padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 24, color: '#E2E8F0' }}>Parcours Augmenté</h3>
          <div style={{ position: 'relative', paddingLeft: 30 }}>
            <div className="timeline-line"></div>
            
            <div style={{ marginBottom: 30, position: 'relative' }}>
              <div className="timeline-dot"></div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Semis & Culture</p>
              <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8 }}>Janvier 2024 - Engrais organique local</p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, fontSize: 12, color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.05)' }}>
                Taux d'humidité du sol maintenu à 45% grâce à l'irrigation goutte-à-goutte.
              </div>
            </div>

            <div style={{ marginBottom: 30, position: 'relative' }}>
              <div className="timeline-dot" style={{ animationDelay: '0.5s' }}></div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Récolte & Qualité</p>
              <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8 }}>12 Mai 2024 - Trié à la main</p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, fontSize: 12, color: '#CBD5E1', border: '1px solid rgba(255,255,255,0.05)' }}>
                Test colorimétrique validé (Score: 8.5/10). Zéro pesticide détecté.
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div className="timeline-dot" style={{ animationDelay: '1s' }}></div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Enregistrement Blockchain</p>
              <p style={{ fontSize: 13, color: '#10B981', fontWeight: 500 }}>13 Mai 2024 - Smart Contract Validé</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => router.push('/')}
          className="btn btn-block btn-lg" style={{ background: '#10B981', color: '#fff', border: 'none', fontWeight: 800, marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          Acheter sur AgriLien <ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} />
        </button>
      </div>
    </div>
  );
}
