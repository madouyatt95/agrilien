'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { producerMonthlyStats, producerSalesData } from '@/data/mock-orders';
import { products } from '@/data/mock-products';
import { formatPrice } from '@/lib/utils';
import { Menu, ChevronDown } from 'lucide-react';

// Données top produits avec images réelles depuis mock-products
const topSellingProducts = [
  { id: 'prod-5', quantitySold: '450 Kg', totalRevenue: 540000 },
  { id: 'prod-4', quantitySold: '350 Kg', totalRevenue: 315000 },
  { id: 'prod-2', quantitySold: '200 Kg', totalRevenue: 140000 },
  { id: 'prod-3', quantitySold: '150 Kg', totalRevenue: 75000 },
  { id: 'prod-1', quantitySold: '120 Kg', totalRevenue: 60000 },
  { id: 'prod-9', quantitySold: '80 L', totalRevenue: 64000 },
];

export default function StatistiquesPage() {
  const router = useRouter();
  const stats = producerMonthlyStats;
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

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

  // Points de la courbe
  const points = chartData.map((d, i) => ({
    x: padLeft + (i / (chartData.length - 1)) * usableW,
    y: padTop + usableH - (d.sales / maxSales) * usableH,
    sales: d.sales,
    date: d.date,
  }));

  // Chemin de la courbe lissée (catmull-rom → bézier)
  const linePath = points.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`;
  }).join(' ');

  // Zone remplie sous la courbe
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartH - padBottom} L ${points[0].x} ${chartH - padBottom} Z`;

  // Grille Y
  const yTicks = [0, 300000, 600000, 900000, 1200000, 1500000];
  const formatShort = (v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <button style={{ color: 'var(--text)' }}><Menu size={22} /></button>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>Statistiques</h1>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, fontWeight: 500, background: 'var(--surface)' }}>
          Mai 2024 <ChevronDown size={14} />
        </button>
      </div>

      <div style={{ padding: 20 }}>
        {/* ═══ KPI Cards — 2 colonnes ═══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Ventes totales</p>
            <p style={{ fontSize: 20, fontWeight: 800 }}>
              {formatPrice(stats.totalSales).replace(' FCFA', '')} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>FCFA</span>
            </p>
            <p style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginTop: 8 }}>▲ {stats.salesGrowth}% vs Avr.</p>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Bénéfice net</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>
              {formatPrice(stats.netProfit).replace(' FCFA', '')} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>FCFA</span>
            </p>
            <p style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginTop: 8 }}>▲ {stats.profitGrowth}% vs Avr.</p>
          </div>
        </div>

        {/* ═══ GRAPHE COURBE SVG ═══ */}
        <div className="card" style={{ padding: '20px 16px', marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, paddingLeft: 4 }}>Évolution des ventes</h3>

          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 'auto' }}>
            {/* Lignes horizontales grille */}
            {yTicks.map(tick => {
              const y = padTop + usableH - (tick / maxSales) * usableH;
              return (
                <g key={tick}>
                  <line x1={padLeft} y1={y} x2={chartW} y2={y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
                  <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="8" fill="#9CA3AF">{formatShort(tick)}</text>
                </g>
              );
            })}

            {/* Zone remplie sous la courbe — dégradé vert */}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0B6B32" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0B6B32" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGrad)" />

            {/* Courbe */}
            <path d={linePath} fill="none" stroke="#0B6B32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Points */}
            {points.map((p, i) => (
              <g key={i}
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={p.x} cy={p.y} r={hoveredPoint === i ? 6 : 4}
                  fill={hoveredPoint === i ? '#0B6B32' : '#fff'}
                  stroke="#0B6B32" strokeWidth="2"
                  style={{ transition: 'r 0.2s' }}
                />
              </g>
            ))}

            {/* Tooltip */}
            {hoveredPoint !== null && (() => {
              const p = points[hoveredPoint];
              const tooltipW = 110;
              const tooltipX = Math.min(Math.max(p.x - tooltipW / 2, 0), chartW - tooltipW);
              const tooltipY = p.y - 42;
              return (
                <g>
                  {/* Ligne verticale pointillée */}
                  <line x1={p.x} y1={p.y + 6} x2={p.x} y2={chartH - padBottom} stroke="#0B6B32" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                  {/* Bulle */}
                  <rect x={tooltipX} y={tooltipY} width={tooltipW} height={32} rx="8" fill="#1F2937" />
                  <text x={tooltipX + tooltipW / 2} y={tooltipY + 14} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
                    {formatPrice(p.sales)}
                  </text>
                  <text x={tooltipX + tooltipW / 2} y={tooltipY + 25} textAnchor="middle" fontSize="8" fill="#9CA3AF">
                    {p.date}
                  </text>
                </g>
              );
            })()}

            {/* Labels X (dates) */}
            {points.map((p, i) => (
              <text key={i} x={p.x} y={chartH - 6} textAnchor="middle" fontSize="8" fill="#9CA3AF">
                {p.date.replace(' mai', '')} mai
              </text>
            ))}
          </svg>
        </div>

        {/* ═══ PRODUITS LES PLUS VENDUS — avec vraies photos ═══ */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Produits les plus vendus</h3>
            <button style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }} onClick={() => router.push('/producteur/produits')}>Voir tout</button>
          </div>

          {topSellingProducts.map((tp, i) => {
            const product = products.find(p => p.id === tp.id);
            if (!product) return null;
            return (
              <div key={tp.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0',
                borderBottom: i < topSellingProducts.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                {/* Photo produit ronde */}
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--bg)' }}
                />
                {/* Nom + quantité */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{product.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tp.quantitySold}</p>
                </div>
                {/* Revenus */}
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>{formatPrice(tp.totalRevenue)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
