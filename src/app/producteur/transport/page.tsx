'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Truck, MapPin, Calendar, ArrowRight, Package, Plus, X, Navigation } from 'lucide-react';
import { formatPrice, getCurrentLocation } from '@/lib/utils';
import { useGalsenRegions } from '@/hooks/useGalsenAPI';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';

interface TransportOffer {
  id: string;
  driverName: string;
  company: string;
  departure: string;
  destination: string;
  date: string;
  totalCapacity: number;
  availableCapacity: number;
  pricePerTon: number;
  type: 'Frigorifique' | 'Bâché' | 'Ouvert';
  distance: string;
  duration: string;
}

export default function TransportPage() {
  const router = useRouter();
  const { regions } = useGalsenRegions();
  // Build a comprehensive city list from regions + their departments
  const senegalCities = regions.flatMap(r => [r.nom, ...r.departments]).filter((v, i, a) => a.indexOf(v) === i);
  const [offers] = useState<TransportOffer[]>([
    {
      id: '1', driverName: 'Modou Diagne', company: 'TransExpress SN',
      departure: 'Kolda', destination: 'Dakar', date: 'Demain, 06:00',
      totalCapacity: 10, availableCapacity: 3.5, pricePerTon: 15000, type: 'Bâché',
      distance: '702 km', duration: '~10h'
    },
    {
      id: '2', driverName: 'Ibrahima Fall', company: 'Logistique Niayes',
      departure: 'Thiès', destination: 'Dakar', date: 'Aujourd\'hui, 14:00',
      totalCapacity: 5, availableCapacity: 1.2, pricePerTon: 5000, type: 'Frigorifique',
      distance: '70 km', duration: '~1h30'
    },
    {
      id: '3', driverName: 'Cheikh Ndiaye', company: 'Ndiaye Transport',
      departure: 'Ziguinchor', destination: 'Kaolack', date: 'Jeu. 12 Mai',
      totalCapacity: 20, availableCapacity: 8, pricePerTon: 12000, type: 'Ouvert',
      distance: '460 km', duration: '~7h'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    departure: '',
    destination: '',
    date: '',
    availableCapacity: '',
    pricePerTon: '',
    type: 'Bâché'
  });

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate adding the offer
    setShowModal(false);
    alert("Votre trajet a été publié avec succès sur la bourse !");
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button className="page-header-back" onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
        <h1>Bourse de Transport</h1>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 12, marginBottom: 24, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Mutualisez vos frais d'expédition en partageant l'espace disponible dans les camions en partance.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <LocationAutocomplete
              value=""
              onChange={(v) => console.log('Départ:', v)}
              placeholder="Départ"
              showGPS={true}
            />
            <LocationAutocomplete
              value=""
              onChange={(v) => console.log('Destination:', v)}
              placeholder="Destination"
              showGPS={false}
            />
          </div>
        </div>

        {/* Uber Freight Live Map Simulation */}
        <div style={{ position: 'relative', width: '100%', height: 200, borderRadius: 16, overflow: 'hidden', marginBottom: 24, border: '1px solid var(--border)' }}>
          <div style={{ width: '100%', height: '100%', background: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop) center/cover', opacity: 0.8 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 41, 59, 0.4)' }} />
          
          {/* Truck 1 */}
          <div style={{ position: 'absolute', top: '40%', left: '30%', animation: 'moveRight 10s linear infinite' }}>
            <div style={{ background: '#22C55E', color: '#fff', padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
              <Truck size={12} /> Modou D.
            </div>
          </div>
          {/* Truck 2 */}
          <div style={{ position: 'absolute', top: '60%', right: '20%', animation: 'moveLeft 15s linear infinite' }}>
            <div style={{ background: '#3B82F6', color: '#fff', padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
              <Truck size={12} /> Ibrahima F.
            </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes moveRight { 0% { transform: translateX(0); } 50% { transform: translateX(100px); } 100% { transform: translateX(0); } }
            @keyframes moveLeft { 0% { transform: translateX(0); } 50% { transform: translateX(-80px); } 100% { transform: translateX(0); } }
          `}} />

          <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 8 }}>
            <span style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 8px', borderRadius: 6, fontSize: 10, backdropFilter: 'blur(4px)' }}>
              📍 3 camions en approche
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Camions disponibles</h2>
          <button onClick={() => setShowModal(true)} style={{ fontSize: 13, color: '#fff', background: 'var(--primary)', padding: '6px 12px', borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Plus size={16} /> Déclarer un trajet
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {offers.map(offer => {
            const fillPercentage = ((offer.totalCapacity - offer.availableCapacity) / offer.totalCapacity) * 100;
            return (
              <div key={offer.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{offer.driverName}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{offer.company} • {offer.type}</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(offer.pricePerTon)}/T</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px', background: 'var(--bg)', borderRadius: 8 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 2 }}>Départ</p>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{offer.departure}</p>
                  </div>
                  <ArrowRight size={16} color="var(--text-light)" />
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 2 }}>Arrivée</p>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{offer.destination}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
                    📍 {offer.distance} • {offer.duration}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Espace rempli</span>
                    <span style={{ fontWeight: 600 }}>Reste {offer.availableCapacity}T / {offer.totalCapacity}T</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${fillPercentage}%`, background: 'var(--primary)', borderRadius: 3 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                    <Calendar size={14} /> {offer.date}
                  </span>
                  <button className="btn btn-primary btn-sm" style={{ padding: '6px 16px' }}>
                    <Package size={14} style={{ marginRight: 6 }} /> Réserver
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Déclarer un trajet */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: 'var(--bg)', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 24px 40px', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Déclarer un espace</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'var(--surface)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Vous avez un camion qui part à vide ? Louez l'espace restant à d'autres producteurs et rentabilisez votre trajet.
            </p>

            <form onSubmit={handleAddOffer} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Départ</label>
                  <input required list="cities-depart" placeholder="Ex: Kolda" style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Arrivée</label>
                  <input required list="cities-arrivee" placeholder="Ex: Dakar" style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Date et Heure</label>
                <input required type="datetime-local" style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Espace dispo (Tonnes)</label>
                  <input required type="number" placeholder="Ex: 3.5" step="0.1" style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }}>Prix demandé (/Tonne)</label>
                  <input required type="number" placeholder="Ex: 15000" style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 8 }}>
                Publier mon trajet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
