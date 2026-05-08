'use client';

import { adminStats, salesData, topProducts, regionSales, recentActivity, alerts } from '@/data/mock-orders';
import { formatPrice } from '@/lib/utils';
import { Users, Tractor, ShoppingBag, TrendingUp, TrendingDown, DollarSign, Percent, Download, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { producerRequests, approveProducerRequest } = useAuth();
  const stats = adminStats;

  const kpis = [
    { label: 'Utilisateurs totaux', value: stats.totalUsers.toLocaleString(), growth: 18, icon: <Users size={20} />, bg: '#EAF7EF', color: '#0B6B32' },
    { label: 'Producteurs', value: stats.totalProducers.toLocaleString(), growth: 15, icon: <Tractor size={20} />, bg: '#FFF7ED', color: '#F97316' },
    { label: 'Acheteurs', value: stats.totalBuyers.toLocaleString(), growth: 21, icon: <Users size={20} />, bg: '#EFF6FF', color: '#3B82F6' },
    { label: 'Commandes totales', value: stats.totalOrders.toLocaleString(), growth: 22, icon: <ShoppingBag size={20} />, bg: '#F0FDF4', color: '#22C55E' },
    { label: 'Ventes totales', value: formatPrice(stats.totalSales), growth: 25, icon: <DollarSign size={20} />, bg: '#EAF7EF', color: '#0B6B32' },
    { label: 'Commissions', value: formatPrice(stats.totalCommissions), growth: 20, icon: <Percent size={20} />, bg: '#FEF3C7', color: '#D97706' },
  ];

  const orderDistribution = [
    { label: 'Livrées', value: 52, count: 1911, color: '#22C55E' },
    { label: 'Confirmées', value: 23, count: 845, color: '#3B82F6' },
    { label: 'En attente', value: 15, count: 551, color: '#F97316' },
    { label: 'Annulées', value: 10, count: 367, color: '#EF4444' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Tableau de bord</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Bienvenue, voici un aperçu global de la plateforme.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm" style={{ gap: 6 }}><Calendar size={16} /> 30 derniers jours</button>
          <button className="btn btn-accent btn-sm" style={{ gap: 6 }}><Download size={16} /> Exporter le rapport</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: kpi.bg, color: kpi.color }}>{kpi.icon}</div>
            <p className="stat-label">{kpi.label}</p>
            <p className="stat-value" style={{ fontSize: 20 }}>{kpi.value}</p>
            <p className="stat-trend up">▲ {kpi.growth}% <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>vs période précédente</span></p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 28 }}>
        {/* Sales Evolution */}
        <div className="card card-padded" style={{ gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Évolution des ventes</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160, padding: '0 8px' }}>
            {salesData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', background: `var(--primary)`, borderRadius: 4, height: Math.max(10, (d.sales / 5500000) * 140), opacity: 0.6 + (i * 0.06) }} />
                <span style={{ fontSize: 9, color: 'var(--text-light)' }}>{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Distribution */}
        <div className="card card-padded">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Répartition des commandes</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 140, marginBottom: 16 }}>
            <div style={{ width: 130, height: 130, borderRadius: '50%', background: `conic-gradient(#22C55E 0% 52%, #3B82F6 52% 75%, #F97316 75% 90%, #EF4444 90% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 20, fontWeight: 800 }}>3 674</span>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Total</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {orderDistribution.map(d => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{d.label}</span>
                <span style={{ fontWeight: 600 }}>{d.value}%</span>
                <span style={{ color: 'var(--text-light)' }}>({d.count.toLocaleString()})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card card-padded">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Activité récente</h3>
            <button style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Voir tout</button>
          </div>
          {recentActivity.map(act => (
            <div key={act.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <p style={{ marginBottom: 2 }}>{act.message}</p>
              <p style={{ fontSize: 11, color: 'var(--text-light)' }}>{act.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 28 }}>
        {/* Top Products */}
        <div className="card card-padded">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Top produits</h3>
            <button style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Voir tout</button>
          </div>
          <table className="data-table" style={{ width: '100%' }}>
            <thead><tr><th>Produit</th><th>Ventes</th><th>Commandes</th></tr></thead>
            <tbody>
              {topProducts.map(p => (
                <tr key={p.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 18 }}>{p.image}</span> {p.name}</td>
                  <td>{formatPrice(p.totalSales)}</td>
                  <td>{p.totalOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Regions */}
        <div className="card card-padded">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Top régions par ventes</h3>
            <button style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Voir tout</button>
          </div>
          <table className="data-table" style={{ width: '100%' }}>
            <thead><tr><th>Région</th><th>Ventes (FCFA)</th><th>Part</th></tr></thead>
            <tbody>
              {regionSales.map(r => (
                <tr key={r.region}>
                  <td>{r.region}</td>
                  <td>{new Intl.NumberFormat('fr-FR').format(r.sales)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${r.percentage}%`, height: '100%', background: 'var(--primary)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12 }}>{r.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts */}
        <div className="card card-padded">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>Alertes & notifications</h3>
            <button style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Voir tout</button>
          </div>
          {alerts.map(alert => (
            <div key={alert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13 }}>{alert.label}</span>
              <span className="badge" style={{
                background: alert.type === 'danger' ? '#FEF2F2' : alert.type === 'warning' ? '#FFF7ED' : '#EFF6FF',
                color: alert.type === 'danger' ? '#EF4444' : alert.type === 'warning' ? '#F97316' : '#3B82F6',
                fontWeight: 700,
              }}>{alert.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Producer Requests Row */}
      {producerRequests.filter(r => r.status === 'en_attente').length > 0 && (
        <div className="card card-padded" style={{ marginBottom: 28, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tractor size={18} color="var(--primary)" /> Demandes d'inscription Producteurs
              <span style={{ background: '#EF4444', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 10 }}>{producerRequests.filter(r => r.status === 'en_attente').length} en attente</span>
            </h3>
          </div>
          <table className="data-table" style={{ width: '100%', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
            <thead><tr><th>Demandeur</th><th>Exploitation</th><th>Région</th><th>Spécialités</th><th>Action</th></tr></thead>
            <tbody>
              {producerRequests.filter(r => r.status === 'en_attente').map(req => (
                <tr key={req.id}>
                  <td style={{ fontWeight: 600 }}>{req.userName}</td>
                  <td>{req.farmName}</td>
                  <td>{req.region}</td>
                  <td>{req.specialties}</td>
                  <td>
                    <button onClick={() => approveProducerRequest(req.id)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}>
                      <CheckCircle size={14} /> Approuver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, padding: '20px 0', borderTop: '1px solid var(--border)' }}>
        {[
          { label: 'Taux de conversion', value: `${stats.conversionRate}%`, growth: 2.4 },
          { label: 'Panier moyen', value: formatPrice(stats.averageCart), growth: 8.1 },
          { label: 'Taux de livraison à temps', value: `${stats.deliveryOnTime}%`, growth: 4.7 },
          { label: 'Taux de satisfaction', value: `${stats.satisfactionRate} / 5`, growth: 0.3, icon: '⭐' },
        ].map((item, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{item.icon || ''}{item.value}</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{item.label}</p>
            <p style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>▲ {item.growth} vs période précédente</p>
          </div>
        ))}
      </div>
    </div>
  );
}
