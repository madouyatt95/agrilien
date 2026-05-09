'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Users, Star, ShieldCheck, Phone, Navigation, Radio } from 'lucide-react';
import { allProducers } from '@/data/mock-users';
import { getCurrentLocation } from '@/lib/utils';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';
import LeafletMap from '@/components/ui/LeafletMap';

const regions = [
  { id: 'dakar', name: 'Dakar', lat: 14.6928, lng: -17.4467, producers: 12, products: 45, specialties: ['Maraîchage', 'Transformation'] },
  { id: 'thies', name: 'Thiès', lat: 14.7928, lng: -16.9260, producers: 18, products: 62, specialties: ['Oignons', 'Tubercules'] },
  { id: 'saint-louis', name: 'Saint-Louis', lat: 16.0333, lng: -16.5000, producers: 8, products: 30, specialties: ['Riz', 'Tomates', 'Chou'] },
  { id: 'fatick', name: 'Fatick', lat: 14.3581, lng: -16.4056, producers: 10, products: 35, specialties: ['Riz', 'Céréales'] },
  { id: 'kaolack', name: 'Kaolack', lat: 14.1667, lng: -16.0667, producers: 15, products: 50, specialties: ['Mil', 'Arachide'] },
  { id: 'kolda', name: 'Kolda', lat: 12.8833, lng: -14.9500, producers: 22, products: 78, specialties: ['Mangues', 'Fruits', 'Lait'] },
  { id: 'ziguinchor', name: 'Ziguinchor', lat: 12.5833, lng: -16.2667, producers: 14, products: 42, specialties: ['Miel', 'Volaille', 'Fruits'] },
  { id: 'tambacounda', name: 'Tamba', lat: 13.7667, lng: -13.6667, producers: 6, products: 20, specialties: ['Bétail', 'Céréales'] },
  { id: 'kedougou', name: 'Kédougou', lat: 12.5500, lng: -12.1833, producers: 4, products: 12, specialties: ['Fruits sauvages'] },
  { id: 'matam', name: 'Matam', lat: 15.6500, lng: -13.2500, producers: 7, products: 25, specialties: ['Riz', 'Bétail'] },
  { id: 'louga', name: 'Louga', lat: 15.6167, lng: -16.2167, producers: 9, products: 28, specialties: ['Arachide', 'Bétail'] },
  { id: 'diourbel', name: 'Diourbel', lat: 14.6500, lng: -16.2333, producers: 11, products: 38, specialties: ['Arachide', 'Mil'] },
  { id: 'kaffrine', name: 'Kaffrine', lat: 14.1167, lng: -15.5500, producers: 8, products: 22, specialties: ['Céréales', 'Coton'] },
  { id: 'sedhiou', name: 'Sédhiou', lat: 12.7000, lng: -15.5500, producers: 5, products: 15, specialties: ['Anacarde', 'Fruits'] },
];



type View = 'carte' | 'liste';

export default function CartePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<typeof regions[0] | null>(null);
  const [selectedProducer, setSelectedProducer] = useState<typeof allProducers[0] | null>(null);
  const [view, setView] = useState<View>('carte');
  const [radarMode, setRadarMode] = useState(false);
  const [radarDetections, setRadarDetections] = useState<{name: string, type: string, distance: string}[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

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
      showToast(`📍 Vrai GPS détecté : Vous êtes à ${city}. L'affichage a été centré.`);
      // Match with known regions if possible
      const foundRegion = regions.find(r => city.toLowerCase().includes(r.name.toLowerCase()));
      if (foundRegion) setSelected(foundRegion);
    } catch (error: any) {
      showToast(`⚠️ Impossible d'obtenir la position GPS: ${error.message}`);
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
          {/* Map Interactive Leaflet */}
          <div style={{ padding: '0 20px', marginBottom: 16, height: 400 }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', border: '2px solid var(--border)', height: '100%', position: 'relative', zIndex: 10 }}>
              <LeafletMap 
                markers={regions.map(r => ({ id: r.id, name: r.name, lat: r.lat, lng: r.lng, producers: r.producers, specialties: r.specialties }))} 
                onMarkerClick={(m) => {
                  const reg = regions.find(r => r.id === m.id);
                  if (reg) { setSelected(reg); setSelectedProducer(null); }
                }} 
              />
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
                    <button className="btn btn-outline btn-sm" style={{ padding: '8px 12px' }} onClick={() => showToast('📞 Appel vers ' + selectedProducer.phone)}>
                      <Phone size={14} /> Contacter
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
        }
      `}} />

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 100, left: 20, right: 20, background: '#18181B', color: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{toast}</div>
      )}
    </div>
  );
}
