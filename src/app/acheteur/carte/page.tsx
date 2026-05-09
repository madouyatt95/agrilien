'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Users, Star, ShieldCheck, Phone, Navigation, Radio } from 'lucide-react';
import { allProducers } from '@/data/mock-users';
import { getCurrentLocation } from '@/lib/utils';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';

const regions = [
  { id: 'dakar', name: 'Dakar', x: 58, y: 145, producers: 12, products: 45, specialties: ['Maraîchage', 'Transformation'] },
  { id: 'thies', name: 'Thiès', x: 95, y: 148, producers: 18, products: 62, specialties: ['Oignons', 'Tubercules'] },
  { id: 'saint-louis', name: 'Saint-Louis', x: 100, y: 55, producers: 8, products: 30, specialties: ['Riz', 'Tomates', 'Chou'] },
  { id: 'fatick', name: 'Fatick', x: 125, y: 175, producers: 10, products: 35, specialties: ['Riz', 'Céréales'] },
  { id: 'kaolack', name: 'Kaolack', x: 155, y: 170, producers: 15, products: 50, specialties: ['Mil', 'Arachide'] },
  { id: 'kolda', name: 'Kolda', x: 175, y: 235, producers: 22, products: 78, specialties: ['Mangues', 'Fruits', 'Lait'] },
  { id: 'ziguinchor', name: 'Ziguinchor', x: 115, y: 245, producers: 14, products: 42, specialties: ['Miel', 'Volaille', 'Fruits'] },
  { id: 'tambacounda', name: 'Tamba', x: 260, y: 185, producers: 6, products: 20, specialties: ['Bétail', 'Céréales'] },
  { id: 'kedougou', name: 'Kédougou', x: 300, y: 225, producers: 4, products: 12, specialties: ['Fruits sauvages'] },
  { id: 'matam', name: 'Matam', x: 235, y: 85, producers: 7, products: 25, specialties: ['Riz', 'Bétail'] },
  { id: 'louga', name: 'Louga', x: 115, y: 95, producers: 9, products: 28, specialties: ['Arachide', 'Bétail'] },
  { id: 'diourbel', name: 'Diourbel', x: 128, y: 140, producers: 11, products: 38, specialties: ['Arachide', 'Mil'] },
  { id: 'kaffrine', name: 'Kaffrine', x: 195, y: 160, producers: 8, products: 22, specialties: ['Céréales', 'Coton'] },
  { id: 'sedhiou', name: 'Sédhiou', x: 145, y: 240, producers: 5, products: 15, specialties: ['Anacarde', 'Fruits'] },
];

// Map region name to SVG coordinates for producer pins
const regionCoords: Record<string, { x: number; y: number }> = {};
regions.forEach(r => { regionCoords[r.name] = { x: r.x, y: r.y }; });

type View = 'carte' | 'liste';

export default function CartePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<typeof regions[0] | null>(null);
  const [selectedProducer, setSelectedProducer] = useState<typeof allProducers[0] | null>(null);
  const [view, setView] = useState<View>('carte');
  const [radarMode, setRadarMode] = useState(false);
  const [radarDetections, setRadarDetections] = useState<{name: string, type: string, distance: string}[]>([]);

  const toggleRadar = () => {
    if (radarMode) {
      setRadarMode(false);
      setRadarDetections([]);
      return;
    }
    setRadarMode(true);
    setRadarDetections([]);
    setTimeout(() => setRadarDetections([{ name: 'Amadou Ba', type: 'Producteur', distance: '2.3 km' }]), 1500);
    setTimeout(() => setRadarDetections(prev => [...prev, { name: 'Ibrahima Transport', type: 'Transporteur', distance: '800 m' }]), 2800);
    setTimeout(() => setRadarDetections(prev => [...prev, { name: 'Mariama Sow', type: 'Producteur', distance: '5.1 km' }]), 4000);
  };

  const totalProducers = regions.reduce((s, r) => s + r.producers, 0);

  // Find producers for a region
  const getProducersForRegion = (regionName: string) =>
    allProducers.filter(p => p.region === regionName || p.city === regionName);

  const handleLocateMe = async () => {
    try {
      const city = await getCurrentLocation();
      alert(`📍 Vrai GPS détecté : Vous êtes à ${city}. L'affichage a été centré.`);
      // Match with known regions if possible
      const foundRegion = regions.find(r => city.toLowerCase().includes(r.name.toLowerCase()));
      if (foundRegion) setSelected(foundRegion);
    } catch (error: any) {
      alert(`Impossible d'obtenir la position GPS: ${error.message}`);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button onClick={() => router.back()}><ChevronLeft size={24} /></button>
        <h1>Carte des producteurs</h1>
        <div style={{ width: 24 }} />
      </div>

      {/* Stats banner */}
      <div style={{ padding: '16px 20px 8px' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="card" style={{ flex: 1, padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{totalProducers}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Producteurs</p>
          </div>
          <div className="card" style={{ flex: 1, padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{regions.length}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Régions</p>
          </div>
          <div className="card" style={{ flex: 1, padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--info)' }}>{allProducers.length}</p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Inscrits</p>
          </div>
        </div>
      </div>

      {/* Location Search */}
      <div style={{ padding: '8px 20px 4px' }}>
        <LocationAutocomplete
          value=""
          onChange={(v, suggestion) => {
            if (suggestion) {
              const regionName = suggestion.type === 'region' ? suggestion.name : suggestion.region;
              const foundRegion = regions.find(r => r.name.toLowerCase() === regionName.toLowerCase());
              if (foundRegion) setSelected(foundRegion);
            }
          }}
          placeholder="Rechercher une localité (ex: Mbour, Kolda...)"
          showGPS={false}
        />
      </div>

      {/* View toggle & Geolocate */}
      <div style={{ padding: '8px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setView('carte')} className={`filter-pill ${view === 'carte' ? 'active' : ''}`}>🗺️ Carte</button>
          <button onClick={() => setView('liste')} className={`filter-pill ${view === 'liste' ? 'active' : ''}`}>👨‍🌾 Producteurs</button>
        </div>
        <button onClick={handleLocateMe} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EFF6FF', color: '#3B82F6', border: '1px solid #BFDBFE', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
          <Navigation size={14} /> Me géolocaliser
        </button>
        <button onClick={toggleRadar} style={{ display: 'flex', alignItems: 'center', gap: 4, background: radarMode ? '#10B981' : '#F0FDF4', color: radarMode ? '#fff' : '#16A34A', border: radarMode ? 'none' : '1px solid #BBF7D0', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
          <Radio size={14} /> Radar
        </button>
      </div>

      {/* Radar Overlay */}
      {radarMode && (
        <div style={{ padding: '0 20px 12px' }}>
          <div style={{ background: '#0F172A', borderRadius: 16, padding: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 160 }}>
              {/* Radar rings */}
              {[120, 90, 60, 30].map((size, i) => (
                <div key={i} className="radar-ring" style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', border: '1px solid rgba(16, 185, 129, 0.2)', animationDelay: `${i * 0.5}s` }} />
              ))}
              {/* Radar sweep */}
              <div className="radar-sweep" style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%' }} />
              {/* Center dot */}
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 15px #10B981', zIndex: 2 }} />
            </div>
            <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: 12, marginTop: 8 }}>
              {radarDetections.length === 0 ? 'Détection en cours...' : `${radarDetections.length} entité(s) détectée(s) à proximité`}
            </p>
            {radarDetections.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {radarDetections.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px 12px', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{d.type === 'Producteur' ? '👨‍🌾' : '🚛'}</span>
                      <div>
                        <p style={{ color: '#F8FAFC', fontSize: 13, fontWeight: 600 }}>{d.name}</p>
                        <p style={{ color: '#64748B', fontSize: 11 }}>{d.type}</p>
                      </div>
                    </div>
                    <span style={{ color: '#10B981', fontSize: 13, fontWeight: 700 }}>{d.distance}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'carte' && (
        <>
          {/* Map SVG */}
          <div style={{ padding: '0 20px', marginBottom: 16 }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 30%, #7DD3FC 100%)', padding: 2 }}>
              <div style={{ borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
                <svg viewBox="0 0 380 300" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  {/* Ocean texture */}
                  <rect width="380" height="300" fill="url(#oceanGrad)" />
                  <defs>
                    <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#BFDBFE" />
                      <stop offset="100%" stopColor="#93C5FD" />
                    </linearGradient>
                    <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#D1FAE5" />
                      <stop offset="100%" stopColor="#A7F3D0" />
                    </linearGradient>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
                    </filter>
                  </defs>

                  {/* Contour du Sénégal with gradient */}
                  <path d="M50,130 L55,100 L75,70 L100,45 L130,35 L165,38 L210,50 L245,65 L280,80 L320,105 L340,140 L345,175 L335,200 L310,230 L280,245 L250,250 L220,255 L190,260 L160,265 L135,260 L110,255 L90,250 L80,240 L65,225 L55,210 L45,185 L42,160 L50,130Z"
                    fill="url(#landGrad)" stroke="#059669" strokeWidth="1.5" filter="url(#shadow)" />

                  {/* Gambie */}
                  <path d="M65,195 L95,192 L130,190 L165,192 L195,195 L195,205 L165,207 L130,210 L95,208 L65,205Z"
                    fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8" />
                  <text x="130" y="202" textAnchor="middle" fontSize="7" fill="#92400E" fontWeight="600">Gambie</text>

                  {/* Fleuve Sénégal (north border) */}
                  <path d="M50,130 L75,70 L100,45 L130,35 L165,38 L210,50 L245,65" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />

                  {/* Océan label */}
                  <text x="25" y="170" fontSize="8" fill="#3B82F6" fontWeight="600" opacity="0.5" transform="rotate(-90, 25, 170)">OCÉAN ATLANTIQUE</text>

                  {/* Region dots */}
                  {regions.map(r => {
                    const regionProducers = getProducersForRegion(r.name);
                    const hasProducers = regionProducers.length > 0;
                    const dotSize = Math.max(7, Math.min(12, r.producers / 2));
                    return (
                      <g key={r.id} onClick={() => { setSelected(r); setSelectedProducer(null); }} style={{ cursor: 'pointer' }}>
                        {hasProducers && (
                          <circle cx={r.x} cy={r.y} r={dotSize + 8} fill="var(--primary)" opacity="0.1">
                            <animate attributeName="r" values={`${dotSize + 4};${dotSize + 12};${dotSize + 4}`} dur="2.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.15;0.03;0.15" dur="2.5s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <circle cx={r.x} cy={r.y} r={dotSize}
                          fill={selected?.id === r.id ? '#F59E0B' : hasProducers ? '#059669' : '#D1D5DB'}
                          stroke="#fff" strokeWidth="2.5" filter="url(#shadow)" />
                        <text x={r.x} y={r.y + dotSize + 12} textAnchor="middle"
                          fontSize="9" fontWeight="700" fill="#1F2937">{r.name}</text>
                        <text x={r.x} y={r.y + dotSize + 21} textAnchor="middle"
                          fontSize="7" fill="#6B7280">{r.producers} prod.</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Selected producer card */}
          {selectedProducer && (
            <div className="card" style={{ margin: '0 20px 16px', padding: 16, borderLeft: '4px solid var(--accent)' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedProducer.photo} alt={selectedProducer.name}
                  style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{selectedProducer.name}</h3>
                    {selectedProducer.isVerified && <ShieldCheck size={14} color="#22C55E" />}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    <MapPin size={11} style={{ display: 'inline' }} /> {selectedProducer.city}, {selectedProducer.region}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    🌾 {selectedProducer.farmName} · {selectedProducer.farmSize}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                    <Star size={13} color="#FBBF24" fill="#FBBF24" />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedProducer.rating}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-light)' }}>({selectedProducer.reviewCount} avis)</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    {selectedProducer.specialties.map(s => (
                      <span key={s} style={{ padding: '3px 8px', borderRadius: 10, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 11, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => router.push(`/acheteur/producteur/${selectedProducer.id}`)}>
                      Voir les produits
                    </button>
                    <button className="btn btn-outline btn-sm" style={{ padding: '8px 12px' }} onClick={() => alert('Appel vers ' + selectedProducer.phone)}>
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selected region info */}
          {selected && !selectedProducer && (
            <div className="card" style={{ margin: '0 20px 16px', padding: 20, borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</h3>
                <button onClick={() => setSelected(null)} style={{ fontSize: 12, color: 'var(--text-light)' }}>✕</button>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={14} color="var(--primary)" />
                  <span style={{ fontSize: 13 }}>{selected.producers} producteurs</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} color="var(--accent)" />
                  <span style={{ fontSize: 13 }}>{selected.products} produits</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {selected.specialties.map(s => (
                  <span key={s} style={{ padding: '4px 10px', borderRadius: 12, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 11, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
              {/* Registered producers in this region */}
              {getProducersForRegion(selected.name).length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Producteurs inscrits :</p>
                  {getProducersForRegion(selected.name).map(p => (
                    <button key={p.id} onClick={() => setSelectedProducer(p)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', width: '100%', borderBottom: '1px solid var(--border)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.photo} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.farmName} · {p.specialties.slice(0, 2).join(', ')}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Star size={11} color="#FBBF24" fill="#FBBF24" />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{p.rating}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <button className="btn btn-primary btn-sm btn-block" onClick={() => router.push('/acheteur/recherche')}>
                Voir les produits de {selected.name}
              </button>
            </div>
          )}
        </>
      )}

      {/* LIST VIEW — All producers */}
      {view === 'liste' && (
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{allProducers.length} producteurs inscrits sur AgriLien</p>
          {allProducers.map(p => (
            <div key={p.id} className="card" style={{ display: 'flex', gap: 14, padding: 14, marginBottom: 10, cursor: 'pointer' }}
              onClick={() => router.push(`/acheteur/producteur/${p.id}`)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.photo} alt={p.name} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</span>
                  {p.isVerified && <ShieldCheck size={14} color="#22C55E" />}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>
                  <MapPin size={11} style={{ display: 'inline' }} /> {p.city} · {p.farmName}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{p.farmSize} · {p.specialties.slice(0, 3).join(', ')}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={12} color="#FBBF24" fill="#FBBF24" />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.rating}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-light)' }}>({p.reviewCount} avis)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All regions list */}
      {view === 'carte' && !selected && (
        <div style={{ padding: '0 20px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Toutes les régions</h3>
          {[...regions].sort((a, b) => b.producers - a.producers).map(r => (
            <button key={r.id} className="card" onClick={() => { setSelected(r); setSelectedProducer(null); }}
              style={{ display: 'flex', gap: 14, padding: 14, marginBottom: 8, width: '100%', textAlign: 'left' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={18} color="var(--primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.producers} producteurs · {r.specialties.slice(0, 2).join(', ')}</p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>{r.products}</span>
            </button>
          ))}
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .radar-ring {
          animation: radarPulse 2s ease-out infinite;
        }
        @keyframes radarPulse {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .radar-sweep {
          background: conic-gradient(from 0deg, transparent 0deg, rgba(16, 185, 129, 0.3) 60deg, transparent 120deg);
          animation: radarSweep 2s linear infinite;
        }
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
