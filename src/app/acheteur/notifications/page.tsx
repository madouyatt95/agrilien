'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Package, Tag, MessageCircle, Bell, AlertCircle, Check } from 'lucide-react';

const notificationsData = [
  { id: 1, type: 'order', title: 'Commande expédiée', desc: 'Votre commande #CMD-1258 est en route', time: 'Il y a 30 min', read: false, icon: Package, color: '#3B82F6' },
  { id: 2, type: 'promo', title: 'Promo -20% sur le Miel', desc: 'Le miel de Casamance est en promotion !', time: 'Il y a 2h', read: false, icon: Tag, color: '#F97316' },
  { id: 3, type: 'message', title: 'Nouveau message', desc: 'Amadou Ba : Votre commande est prête', time: 'Il y a 3h', read: false, icon: MessageCircle, color: '#0B6B32' },
  { id: 4, type: 'stock', title: 'Retour en stock', desc: 'Les Arachides Décortiquées sont de retour !', time: 'Hier', read: true, icon: AlertCircle, color: '#22C55E' },
  { id: 5, type: 'order', title: 'Commande livrée', desc: 'Votre commande #CMD-1254 a été livrée', time: 'Hier', read: true, icon: Check, color: '#22C55E' },
  { id: 6, type: 'promo', title: '🔥 Offre flash', desc: 'Mangues Kent à -17% jusqu\'au 1er juin', time: 'Il y a 2j', read: true, icon: Tag, color: '#EF4444' },
  { id: 7, type: 'system', title: 'Bienvenue sur AgriLien !', desc: 'Découvrez les meilleurs produits locaux', time: 'Il y a 5j', read: true, icon: Bell, color: '#6B7280' },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(notificationsData);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="page-header">
        <button onClick={() => router.back()}><ChevronLeft size={24} /></button>
        <h1>Notifications {unreadCount > 0 && <span style={{ fontSize: 13, background: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: 10, marginLeft: 6 }}>{unreadCount}</span>}</h1>
        <button onClick={markAllRead} style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>Tout lire</button>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {notifications.map(n => {
          const Icon = n.icon;
          return (
            <button key={n.id} className="card" onClick={() => { markRead(n.id); if (n.type === 'message') showToast('💬 Messagerie avec ' + n.desc.split(':')[0] + ' bientôt disponible'); }}
              style={{ display: 'flex', gap: 14, padding: 16, marginBottom: 8, width: '100%', textAlign: 'left', borderLeft: n.read ? 'none' : `3px solid ${n.color}`, opacity: n.read ? 0.7 : 1 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${n.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={n.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: n.read ? 500 : 700, fontSize: 14 }}>{n.title}</span>
                  {!n.read && <span style={{ width: 8, height: 8, borderRadius: 4, background: n.color, flexShrink: 0, marginTop: 4 }} />}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.desc}</p>
                <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>{n.time}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 100, left: 20, right: 20, background: '#18181B', color: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{toast}</div>
      )}
    </div>
  );
}
