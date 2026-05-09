'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { producerMonthlyStats } from '@/data/mock-orders';
import { orders } from '@/data/mock-orders';
import { Bell, Eye, EyeOff, ArrowDownCircle, CloudRain, Sun, TrendingUp, TrendingDown, Users, Truck, Gavel, MapPin, Navigation } from 'lucide-react';
import { formatPrice, getStatusLabel, getStatusColor, getStatusBgColor, formatRelativeTime, getCurrentLocation } from '@/lib/utils';
import { useState } from 'react';
import AgriLienLogo from '@/components/ui/Logo';
import { useGalsenRegions } from '@/hooks/useGalsenAPI';
import { useWeather } from '@/hooks/useWeather';

export default function ProducteurDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const { regionNames, loading: regionsLoading } = useGalsenRegions();
  const [selectedRegion, setSelectedRegion] = useState(user?.region || 'Kolda');
  const [locating, setLocating] = useState(false);
  const stats = producerMonthlyStats;
  const { weather, loading: weatherLoading } = useWeather(selectedRegion);

  const handleLocateMe = async () => {
    setLocating(true);
    try {
      const city = await getCurrentLocation();
      const matched = regionNames.find(r => city.toLowerCase().includes(r.toLowerCase()));
      if (matched) setSelectedRegion(matched);
      else setSelectedRegion(city);
    } catch (err: any) {
      alert(`Erreur GPS : ${err.message}`);
    } finally {
      setLocating(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* Header avec logo */}
      <div style={{ background: 'var(--surface)', padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <AgriLienLogo size="md" />
        <button onClick={() => router.push('/producteur/profil?panel=notifs')} style={{ position: 'relative', color: 'var(--text)' }}>
          <Bell size={22} />
          <span className="nav-badge" style={{ position: 'absolute', top: -4, right: -6 }}>2</span>
        </button>
      </div>

      <div style={{ padding: 20 }}>
        {/* Greeting avec photo producteur */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face"
            alt="Amadou Ba"
            style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }}
          />
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Bonjour, {user?.firstName || 'Amadou'} 👋</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Voici ce qui se passe aujourd&apos;hui sur votre activité.</p>
          </div>
        </div>

        {/* Balance Card — vert comme la capture */}
        <div style={{ background: 'var(--primary)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, color: '#fff' }}>
          <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 4 }}>Solde disponible</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 28, fontWeight: 800 }}>
              {showBalance ? formatPrice(245000) : '••••••'}
            </span>
            <button onClick={() => setShowBalance(!showBalance)} style={{ color: 'rgba(255,255,255,0.7)' }}>
              {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(255,255,255,0.2)', borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: 13 }}>
            <ArrowDownCircle size={18} /> Retirer mes revenus
          </button>
        </div>

        {/* Sélecteur de région + GPS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <MapPin size={16} color="var(--primary)" />
          <select
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}
            disabled={regionsLoading}
          >
            {regionsLoading ? (
              <option>Chargement...</option>
            ) : (
              regionNames.map(r => <option key={r} value={r}>{r}</option>)
            )}
          </select>
          <button
            onClick={handleLocateMe}
            disabled={locating}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#EFF6FF', color: '#3B82F6',
              border: '1px solid #BFDBFE', padding: '8px 12px',
              borderRadius: 10, fontSize: 12, fontWeight: 700,
              whiteSpace: 'nowrap',
              animation: locating ? 'spin 1s linear infinite' : 'none',
            }}
          >
            <Navigation size={14} /> {locating ? '...' : 'Me géolocaliser'}
          </button>
        </div>

        {/* Widgets: IA Météo & Mercuriale - Full width pour mobile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {/* Widget IA Agro-Météorologique — REAL DATA */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <div style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #8B5CF6 100%)', padding: '16px 20px', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TrendingUp size={16} /> IA Agro-Météorologique
                </span>
                <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: 12, backdropFilter: 'blur(4px)' }}>
                  📍 {selectedRegion}
                </span>
              </div>
              {weatherLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', animation: 'pulseDot 1.5s infinite' }} />
                  <div>
                    <div style={{ width: 80, height: 28, background: 'rgba(255,255,255,0.2)', borderRadius: 6, marginBottom: 6 }} />
                    <div style={{ width: 150, height: 14, background: 'rgba(255,255,255,0.15)', borderRadius: 4 }} />
                  </div>
                </div>
              ) : weather ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 42, filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))' }}>{weather.weatherIcon}</span>
                    <div>
                      <p style={{ fontSize: 32, fontWeight: 900, lineHeight: 1, letterSpacing: '-1px' }}>{weather.temperature}°C</p>
                      <p style={{ fontSize: 13, opacity: 0.9 }}>{weather.weatherLabel} (Ressenti {weather.apparentTemperature}°C)</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12, opacity: 0.9 }}>
                    <p style={{ marginBottom: 4 }}>💧 Humidité : {weather.humidity}%</p>
                    <p style={{ marginBottom: 4 }}>💨 Vent : {weather.windSpeed} km/h</p>
                    <p>🌡️ {weather.tempMin}° / {weather.tempMax}°</p>
                  </div>
                </div>
              ) : (
                <p style={{ opacity: 0.7, fontSize: 13 }}>Données météo indisponibles</p>
              )}
            </div>
            <div style={{ padding: '16px 20px', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: 'pulseDot 2s infinite' }}>
                  <span style={{ fontSize: 16 }}>🤖</span>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Conseil IA pour aujourd'hui</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {weather && weather.rainProbability > 60 ? (
                      <>Risque de pluie à <strong style={{ color: '#EF4444' }}>{weather.rainProbability}%</strong>. L'IA recommande de <strong>suspendre l'irrigation</strong> et de protéger les jeunes pousses.</>
                    ) : weather && weather.temperature > 35 ? (
                      <>Températures élevées (<strong style={{ color: '#F59E0B' }}>{weather.temperature}°C</strong>). Privilégiez <strong>l'arrosage tôt le matin</strong> et paillez vos cultures pour conserver l'humidité.</>
                    ) : weather && weather.humidity < 40 ? (
                      <>Humidité basse (<strong style={{ color: '#F59E0B' }}>{weather.humidity}%</strong>). Augmentez la fréquence d'irrigation et surveillez les signes de stress hydrique.</>
                    ) : (
                      <>Conditions favorables pour vos cultures. Température de <strong>{weather?.temperature}°C</strong> avec <strong>{weather?.humidity}%</strong> d'humidité — idéal pour la croissance.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Widget Mercuriale (Prix du marché Wall Street Style) */}
          <div className="card" style={{ padding: 16, background: '#0F172A', color: '#F8FAFC', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={16} color="#10B981" /> Agri-Bourse</span>
              <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 8 }}>📍 {selectedRegion}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Oignon Local</span>
                <svg width="50" height="20" viewBox="0 0 50 20"><path d="M0,15 Q10,20 20,10 T40,5 L50,0" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" /></svg>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, display: 'block' }}>450 F</span>
                  <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>+12.5%</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Tomate</span>
                <svg width="50" height="20" viewBox="0 0 50 20"><path d="M0,5 Q10,0 20,10 T40,15 L50,20" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" /></svg>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, display: 'block' }}>800 F</span>
                  <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>-4.2%</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px', alignItems: 'center', padding: '8px 0' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Mangue Kent</span>
                <svg width="50" height="20" viewBox="0 0 50 20"><path d="M0,18 Q15,10 25,5 T45,2 L50,0" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" /></svg>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, display: 'block' }}>1200 F</span>
                  <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>+8.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📈 Forecast de Trésorerie */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ background: 'linear-gradient(135deg, #064E3B, #10B981)', padding: '16px 20px', color: '#fff' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
              📈 Prévisions de Trésorerie
            </h3>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              {[
                { period: '7 jours', amount: 85000, trend: '+12%' },
                { period: '30 jours', amount: 340000, trend: '+8%' },
                { period: '90 jours', amount: 1250000, trend: '+22%' },
              ].map(f => (
                <div key={f.period} style={{ flex: 1, textAlign: 'center', padding: 12, background: 'var(--bg)', borderRadius: 12 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>{f.period}</p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{formatPrice(f.amount)}</p>
                  <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700 }}>{f.trend}</span>
                </div>
              ))}
            </div>
            {/* Mini graphique simulé */}
            <div style={{ height: 60, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
              {[30, 45, 35, 55, 40, 60, 50, 70, 55, 75, 65, 80, 70, 85, 90].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: `rgba(16, 185, 129, ${0.3 + (i / 20)})`, borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>
              <span>Avr</span><span>Mai</span><span>Juin</span><span>Juil</span>
            </div>
          </div>
        </div>

        {/* Quick Actions (Coopérative & Transport) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          <button onClick={() => router.push('/producteur/cooperative')} className="card" style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EAF7EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#0B6B32" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 13, fontWeight: 700 }}>Ma Coopérative</p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Gérer mon GIE</p>
            </div>
          </button>
          <button onClick={() => router.push('/producteur/transport')} className="card" style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={20} color="#3B82F6" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 13, fontWeight: 700 }}>Transport</p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Bourse de Fret</p>
            </div>
          </button>
          <button onClick={() => router.push('/producteur/appels-offres')} className="card" style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gavel size={20} color="#7C3AED" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 13, fontWeight: 700 }}>Appels d'Offres</p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Marchés B2B</p>
            </div>
          </button>
        </div>

        {/* Monthly Summary — 3x2 grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Résumé du mois</h3>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Mai 2024 ›</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 10 }}>
          <div className="card" style={{ padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 800 }}>{formatPrice(stats.totalSales)}</p>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>Ventes totales</p>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--success)', marginTop: 6 }}>▲ {stats.salesGrowth}% vs Av.</p>
          </div>
          <div className="card" style={{ padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 800 }}>{stats.totalOrders}</p>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>Commandes</p>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--success)', marginTop: 6 }}>▲ {stats.ordersGrowth}% vs Av.</p>
          </div>
          <div className="card" style={{ padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 800 }}>{stats.productsSold}</p>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>Produits vendus</p>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--success)', marginTop: 6 }}>▲ {stats.productsSoldGrowth}% vs Av.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
          <div className="card" style={{ padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 800 }}>{stats.productViews.toLocaleString()}</p>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>Vues produits</p>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--success)', marginTop: 6 }}>▲ {stats.viewsGrowth}% vs Av.</p>
          </div>
          <div className="card" style={{ padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 800 }}>{stats.favorites}</p>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>Favoris</p>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--success)', marginTop: 6 }}>▲ {stats.favoritesGrowth}% vs Av.</p>
          </div>
          <div className="card" style={{ padding: 14, textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 800 }}>{stats.clients}</p>
            <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 4 }}>Clients</p>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--success)', marginTop: 6 }}>▲ {stats.clientsGrowth}% vs Av.</p>
          </div>
        </div>

        {/* Recent Orders — avec photos produits comme la capture */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Commandes récentes</h3>
          <button style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }} onClick={() => router.push('/producteur/commandes')}>Voir tout</button>
        </div>
        {orders.slice(0, 4).map(order => (
          <div key={order.id} className="card" style={{ padding: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {/* Thumbnail produit */}
              <img
                src={order.items[0]?.productImage}
                alt={order.items[0]?.productName}
                style={{ width: 50, height: 50, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{order.orderNumber}</span>
                  <span className="badge" style={{ background: getStatusBgColor(order.status), color: getStatusColor(order.status), fontSize: 11 }}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text)' }}>
                  {order.items[0]?.productName}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {order.items[0]?.quantity} {order.items[0]?.unit} · {formatPrice(order.total)}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>{formatRelativeTime(order.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
