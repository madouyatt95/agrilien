'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { producerMonthlyStats, producerSalesData } from '@/data/mock-orders';
import { products } from '@/data/mock-products';
import { formatPrice } from '@/lib/utils';
import { ChevronLeft, ChevronDown, TrendingUp, Eye, Users, ShoppingBag, Heart, Package } from 'lucide-react';

// Données top produits avec images réelles depuis mock-products
const topSellingProducts = [
  { id: 'prod-5', quantitySold: '450 Kg', totalRevenue: 540000 },
  { id: 'prod-4', quantitySold: '350 Kg', totalRevenue: 315000 },
  { id: 'prod-2', quantitySold: '200 Kg', totalRevenue: 140000 },
  { id: 'prod-3', quantitySold: '150 Kg', totalRevenue: 75000 },
  { id: 'prod-1', quantitySold: '120 Kg', totalRevenue: 60000 },
  { id: 'prod-9', quantitySold: '80 L', totalRevenue: 64000 },
];

const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function StatistiquesPage() {
  const router = useRouter();
  const stats = producerMonthlyStats;
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Mai 2024');
  const [showAllProducts, setShowAllProducts] = useState(false);

  // ═══ GRAPHE SVG — Courbe lissée ═══
  const chartData = producerSalesData;
  const maxSales = Math.max(...chartData.map(d => d.sales));
  const chartW = 320;
  const chartH = 160;
  const padLeft = 45;
  const padBottom = 24;
  const padTop = 20;
  const usableW = chartW - padLeft;
  const usableH = chartH - padBottom - padTop;

  const points = chartData.map((d, i) => ({
    x: padLeft + (i / (chartData.length - 1)) * usableW,
    y: padTop + usableH - (d.sales / maxSales) * usableH,
    sales: d.sales,
    orders: d.orders,
    date: d.date,
  }));

  const linePath = points.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`;
  }).join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartH - padBottom} L ${points[0].x} ${chartH - padBottom} Z`;

  const yTicks = [0, 300000, 600000, 900000, 1200000, 1500000];
  const formatShort = (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header — sans burger, avec bouton retour */}
      <div style={{ background: 'var(--surface)', padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => router.back()} style={{ color: 'var(--text)' }}><ChevronLeft size={22} /></button>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>Statistiques</h1>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowMonthPicker(!showMonthPicker)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, fontWeight: 500, background: 'var(--surface)' }}>
            {selectedMonth} <ChevronDown size={14} />
          </button>
          {showMonthPicker && (
            <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 6, background: 'var(--surface)', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid var(--border)', zIndex: 100, width: 180, maxHeight: 240, overflowY: 'auto' }}>
              {months.map(m => (
                <button key={m} onClick={() => { setSelectedMonth(`${m} 2024`); setShowMonthPicker(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', fontSize: 13, fontWeight: selectedMonth.includes(m) ? 700 : 400, color: selectedMonth.includes(m) ? 'var(--primary)' : 'var(--text)', background: selectedMonth.includes(m) ? 'var(--primary-light)' : 'transparent', border: 'none', borderBottom: '1px solid var(--border)' }}>
                  {m} 2024
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* ═══ KPI Cards — 2x3 grid ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EAF7EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={16} color="#0B6B32" /></div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Ventes totales</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800 }}>
              {formatPrice(stats.totalSales).replace(' FCFA', '')} <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>FCFA</span>
            </p>
            <p style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>▲ {stats.salesGrowth}%</p>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 16 }}>💰</span></div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Bénéfice net</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>
              {formatPrice(stats.netProfit).replace(' FCFA', '')} <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)' }}>FCFA</span>
            </p>
            <p style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>▲ {stats.profitGrowth}%</p>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={16} color="#3B82F6" /></div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Commandes</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800 }}>{stats.totalOrders}</p>
            <p style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>▲ {stats.ordersGrowth}%</p>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={16} color="#F97316" /></div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Produits vendus</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800 }}>{stats.productsSold}</p>
            <p style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>▲ {stats.productsSoldGrowth}%</p>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={16} color="#EF4444" /></div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Vues produits</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800 }}>{stats.productViews.toLocaleString()}</p>
            <p style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>▲ {stats.viewsGrowth}%</p>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FDF2F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={16} color="#EC4899" /></div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Clients</span>
            </div>
            <p style={{ fontSize: 18, fontWeight: 800 }}>{stats.clients}</p>
            <p style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>▲ {stats.clientsGrowth}%</p>
          </div>
        </div>

        {/* ═══ GRAPHE COURBE SVG ═══ */}
        <div className="card" style={{ padding: '20px 16px', marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, paddingLeft: 4 }}>Évolution des ventes</h3>

          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 'auto' }}>
            {yTicks.map(tick => {
              const y = padTop + usableH - (tick / maxSales) * usableH;
              return (
                <g key={tick}>
                  <line x1={padLeft} y1={y} x2={chartW} y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
                  <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="8" fill="#9CA3AF">{formatShort(tick)}</text>
                </g>
              );
            })}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0B6B32" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0B6B32" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGrad)" />
            <path d={linePath} fill="none" stroke="#0B6B32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
              <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} style={{ cursor: 'pointer' }}>
                <circle cx={p.x} cy={p.y} r={hoveredPoint === i ? 6 : 4} fill={hoveredPoint === i ? '#0B6B32' : '#fff'} stroke="#0B6B32" strokeWidth="2" style={{ transition: 'r 0.2s' }} />
              </g>
            ))}
            {hoveredPoint !== null && (() => {
              const p = points[hoveredPoint];
              const tooltipW = 110;
              const tooltipX = Math.min(Math.max(p.x - tooltipW / 2, 0), chartW - tooltipW);
              const tooltipY = p.y - 42;
              return (
                <g>
                  <line x1={p.x} y1={p.y + 6} x2={p.x} y2={chartH - padBottom} stroke="#0B6B32" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                  <rect x={tooltipX} y={tooltipY} width={tooltipW} height={32} rx="8" fill="#1F2937" />
                  <text x={tooltipX + tooltipW / 2} y={tooltipY + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
                    {formatPrice(p.sales)}
                  </text>
                  <text x={tooltipX + tooltipW / 2} y={tooltipY + 25} textAnchor="middle" fontSize="8" fill="#9CA3AF">
                    {p.date} · {p.orders} cmd
                  </text>
                </g>
              );
            })()}
            {points.map((p, i) => (
              <text key={i} x={p.x} y={chartH - 6} textAnchor="middle" fontSize="8" fill="#9CA3AF">
                {p.date.replace(' mai', '')} mai
              </text>
            ))}
          </svg>
        </div>

        {/* ═══ PRODUITS LES PLUS VENDUS ═══ */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Produits les plus vendus</h3>
            <button style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }} onClick={() => setShowAllProducts(!showAllProducts)}>
              {showAllProducts ? 'Réduire' : 'Voir tout'}
            </button>
          </div>

          {showAllProducts ? (
            /* ═══ TABLEAU DÉTAILLÉ ═══ */
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', background: 'var(--bg)', padding: '10px 14px', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 2 }}>PRODUIT</div>
                <div style={{ flex: 1, textAlign: 'center' }}>QTÉ</div>
                <div style={{ flex: 1, textAlign: 'right' }}>REVENU</div>
                <div style={{ flex: 0.8, textAlign: 'right' }}>%</div>
              </div>
              {topSellingProducts.map((tp, i) => {
                const product = products.find(p => p.id === tp.id);
                if (!product) return null;
                const totalRev = topSellingProducts.reduce((s, t) => s + t.totalRevenue, 0);
                const pct = Math.round((tp.totalRevenue / totalRev) * 100);
                return (
                  <div key={tp.id} style={{ display: 'flex', padding: '12px 14px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img src={product.images[0]} alt={product.name} style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
                      <span style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', fontSize: 12 }}>{tp.quantitySold}</div>
                    <div style={{ flex: 1, textAlign: 'right', fontSize: 12, fontWeight: 700 }}>{formatPrice(tp.totalRevenue)}</div>
                    <div style={{ flex: 0.8, textAlign: 'right' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
              <div style={{ padding: 14, background: 'var(--bg)', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 13 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>{formatPrice(topSellingProducts.reduce((s, t) => s + t.totalRevenue, 0))}</span>
              </div>
            </div>
          ) : (
            /* ═══ LISTE SIMPLE ═══ */
            topSellingProducts.slice(0, 4).map((tp, i) => {
              const product = products.find(p => p.id === tp.id);
              if (!product) return null;
              return (
                <div key={tp.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 0',
                  borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                }}>
                  <img src={product.images[0]} alt={product.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--bg)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{product.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tp.quantitySold}</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>{formatPrice(tp.totalRevenue)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Overlay pour fermer le month picker */}
      {showMonthPicker && <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowMonthPicker(false)} />}
    </div>
  );
}
