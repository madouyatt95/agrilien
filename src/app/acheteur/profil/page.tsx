'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/data/mock-products';
import { ChevronLeft, LogOut, ChevronRight, ShoppingBag, Heart, Star, MessageCircle, MapPin, Phone, Mail, RefreshCw, Upload, Navigation, Send, Bell, Truck, CreditCard, Edit2, AlertCircle, Mic, Play, Square } from 'lucide-react';
import { formatPrice, getCurrentLocation } from '@/lib/utils';
import { useGalsenRegions } from '@/hooks/useGalsenAPI';
import { specialties as SPECIALTIES_LIST } from '@/data/product-catalog';

type ActivePanel = null | 'infos' | 'adresses' | 'paiement' | 'notifs' | 'favoris' | 'messages' | 'avis' | 'chat' | 'devenir_producteur';

export default function ProfilPage() {
  const router = useRouter();
  const { user, logout, switchRole, favorites, toggleFavorite, producerRequests, submitProducerRequest } = useAuth();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Fatou Diop',
    email: user?.email || 'fatou@email.com',
    phone: user?.phone || '+221 77 123 45 67',
    address: 'Rue 12, Médina, Dakar',
  });
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const [savedMsg, setSavedMsg] = useState('');
  const [notifSettings, setNotifSettings] = useState({ orders: true, promos: true, messages: true, newsletter: false });
  const [formReq, setFormReq] = useState({ farmName: '', region: 'Dakar', department: '', specialties: '' });
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  
  const toggleSpec = (s: string) => {
    setSelectedSpecialties(prev => {
      const newSpecs = prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s];
      setFormReq({ ...formReq, specialties: newSpecs.join(', ') });
      return newSpecs;
    });
  };
  const { regionNames, getDepartments, loading: regionsLoading } = useGalsenRegions();

  const existingReq = user ? producerRequests.find(r => r.userId === user.id) : null;

  const handleSave = () => {
    setEditMode(false);
    setSavedMsg('Modifications enregistrées ✓');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleLogout = () => { logout(); router.replace('/login'); };

  const favProducts = products.filter(p => favorites.includes(p.id));

  const messages = [
    { id: 1, from: 'Amadou Ba', photo: '👨‍🌾', lastMsg: 'Votre commande de mangues est prête pour la livraison', time: 'Il y a 2h', unread: true },
    { id: 2, from: 'Ousmane Diallo', photo: '👨‍🌾', lastMsg: 'Merci pour votre commande de riz !', time: 'Hier', unread: false },
    { id: 3, from: 'Support AgriLien', photo: '🌿', lastMsg: 'Bienvenue sur AgriLien ! N\'hésitez pas à nous contacter.', time: 'Il y a 3j', unread: false },
  ];

  const [openConversation, setOpenConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [chatMessages, setChatMessages] = useState<Record<number, Array<{ text?: string; fromMe: boolean; time: string; voice?: { duration: number } }>>>({
    1: [
      { text: 'Bonjour, j\'ai commandé 3 kg de mangues Kent', fromMe: true, time: '10:15' },
      { text: 'Bonjour Fatou ! Oui je vois votre commande #CMD-1258', fromMe: false, time: '10:18' },
      { text: 'Les mangues sont récoltées ce matin, très belles qualité', fromMe: false, time: '10:19' },
      { text: 'Super ! Quand la livraison est-elle prévue ?', fromMe: true, time: '10:22' },
      { text: 'Votre commande de mangues est prête pour la livraison', fromMe: false, time: '11:30' },
    ],
    2: [
      { text: 'Bonjour, le riz est bien arrivé', fromMe: true, time: 'Hier 14:20' },
      { text: 'Merci pour votre commande de riz !', fromMe: false, time: 'Hier 14:35' },
      { text: 'N\'hésitez pas à recommander 😊', fromMe: false, time: 'Hier 14:36' },
    ],
    3: [
      { text: 'Bienvenue sur AgriLien ! N\'hésitez pas à nous contacter.', fromMe: false, time: 'Il y a 3j' },
      { text: 'Merci ! L\'app est très bien faite', fromMe: true, time: 'Il y a 3j' },
    ],
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !openConversation) return;
    setChatMessages(prev => ({
      ...prev,
      [openConversation]: [...(prev[openConversation] || []), { text: newMessage, fromMe: true, time: 'Maintenant' }],
    }));
    setNewMessage('');
  };

  const reviews = [
    { id: 1, product: 'Mangues Kent', rating: 5, comment: 'Excellentes mangues, très sucrées !', date: 'Il y a 3j' },
    { id: 2, product: 'Riz Local Étuvé', rating: 4, comment: 'Bon riz, livraison rapide.', date: 'Il y a 1 sem.' },
  ];

  // ═══ PANEL: Infos personnelles ═══
  if (activePanel === 'infos') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setActivePanel(null)}><ChevronLeft size={24} /></button>
          <h1>Mes informations</h1>
          <button onClick={() => editMode ? handleSave() : setEditMode(true)} style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
            {editMode ? 'Sauvegarder' : 'Modifier'}
          </button>
        </div>
        <div style={{ padding: 20 }}>
          {savedMsg && <div style={{ background: '#F0FDF4', color: '#22C55E', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>{savedMsg}</div>}
          {[
            { label: 'Nom complet', key: 'name' as const },
            { label: 'Email', key: 'email' as const },
            { label: 'Téléphone', key: 'phone' as const },
            { label: 'Adresse', key: 'address' as const },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>{field.label}</label>
              {editMode ? (
                <input value={formData[field.key]} onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--primary)', borderRadius: 8, fontSize: 14, outline: 'none' }} />
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}>{formData[field.key]}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ PANEL: Adresses ═══
  if (activePanel === 'adresses') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setActivePanel(null)}><ChevronLeft size={24} /></button>
          <h1>Adresses de livraison</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          <div className="card" style={{ padding: 16, marginBottom: 12, border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>🏠 Domicile</span>
              <span className="badge" style={{ background: '#EAF7EF', color: '#0B6B32' }}>Par défaut</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Rue 12, Médina, Dakar, Sénégal</p>
          </div>
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>🏢 Bureau</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Avenue Cheikh Anta Diop, Point E, Dakar</p>
          </div>
          <button className="btn btn-outline btn-block">+ Ajouter une adresse</button>
        </div>
      </div>
    );
  }

  // ═══ PANEL: Paiement ═══
  if (activePanel === 'paiement') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setActivePanel(null)}><ChevronLeft size={24} /></button>
          <h1>Moyens de paiement</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          {[
            { name: 'Wave', phone: '+221 77 *** ** 67', icon: '📱', active: true },
            { name: 'Orange Money', phone: '+221 76 *** ** 12', icon: '💳', active: false },
          ].map((pm, i) => (
            <div key={i} className="card" style={{ padding: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14, border: pm.active ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{pm.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{pm.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{pm.phone}</p>
              </div>
              <span className="badge" style={{ background: pm.active ? '#EAF7EF' : 'var(--bg)', color: pm.active ? '#0B6B32' : 'var(--text-secondary)' }}>{pm.active ? 'Actif' : 'Inactif'}</span>
            </div>
          ))}
          <button className="btn btn-outline btn-block" style={{ marginTop: 4 }}>+ Ajouter un moyen de paiement</button>
        </div>
      </div>
    );
  }

  // ═══ PANEL: Notifications ═══
  if (activePanel === 'notifs') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setActivePanel(null)}><ChevronLeft size={24} /></button>
          <h1>Notifications</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          {[
            { key: 'orders' as const, label: 'Commandes', desc: 'Suivi des commandes et livraisons' },
            { key: 'promos' as const, label: 'Promotions', desc: 'Offres et réductions exclusives' },
            { key: 'messages' as const, label: 'Messages', desc: 'Messages des producteurs' },
            { key: 'newsletter' as const, label: 'Newsletter', desc: 'Actualités agricoles hebdomadaires' },
          ].map(item => (
            <div key={item.key} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
              <button onClick={() => setNotifSettings({ ...notifSettings, [item.key]: !notifSettings[item.key] })}
                style={{ width: 48, height: 28, borderRadius: 14, background: notifSettings[item.key] ? 'var(--primary)' : 'var(--border)', position: 'relative', transition: 'background 0.2s' }}>
                <span style={{ position: 'absolute', top: 3, left: notifSettings[item.key] ? 23 : 3, width: 22, height: 22, borderRadius: 11, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ PANEL: Favoris ═══
  if (activePanel === 'favoris') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setActivePanel(null)}><ChevronLeft size={24} /></button>
          <h1>Mes favoris ({favProducts.length})</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          {favProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ fontSize: 48, marginBottom: 12 }}>❤️</p>
              <p style={{ fontWeight: 600, marginBottom: 8 }}>Aucun favori pour le moment</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Ajoutez des produits en cliquant sur le cœur</p>
              <button className="btn btn-primary btn-sm" onClick={() => { setActivePanel(null); router.push('/acheteur/recherche'); }}>Découvrir des produits</button>
            </div>
          ) : (
            favProducts.map(product => (
              <div key={product.id} className="card" style={{ display: 'flex', gap: 14, padding: 14, marginBottom: 10 }}>
                <img src={product.images[0]} alt={product.name} onClick={() => router.push(`/acheteur/produit/${product.id}`)}
                  style={{ width: 70, height: 70, borderRadius: 10, objectFit: 'cover', cursor: 'pointer' }} />
                <div style={{ flex: 1 }} onClick={() => router.push(`/acheteur/produit/${product.id}`)} role="button">
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{product.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}><MapPin size={11} /> {product.city}, Sénégal</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(product.price)} / {product.unit}</p>
                </div>
                <button onClick={() => toggleFavorite(product.id)} style={{ alignSelf: 'center', padding: 8 }}>
                  <Heart size={20} fill="#EF4444" color="#EF4444" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ═══ PANEL: Chat conversation ═══
  if (activePanel === 'chat' && openConversation) {
    const contact = messages.find(m => m.id === openConversation);
    const convoMessages = chatMessages[openConversation] || [];
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="page-header" style={{ borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => { setActivePanel('messages'); setOpenConversation(null); }}><ChevronLeft size={24} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{contact?.photo}</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14 }}>{contact?.from}</p>
              <p style={{ fontSize: 11, color: 'var(--text-light)' }}>En ligne</p>
            </div>
          </div>
          <div style={{ width: 24 }} />
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {convoMessages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.fromMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%', padding: '10px 14px', borderRadius: 16,
                background: msg.fromMe ? 'var(--primary)' : 'var(--surface)',
                color: msg.fromMe ? '#fff' : 'var(--text)',
                borderBottomRightRadius: msg.fromMe ? 4 : 16,
                borderBottomLeftRadius: msg.fromMe ? 16 : 4,
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
              }}>
                {msg.voice ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button style={{ width: 32, height: 32, borderRadius: '50%', background: msg.fromMe ? 'rgba(255,255,255,0.2)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
                      <Play size={14} color={msg.fromMe ? '#fff' : 'var(--primary)'} />
                    </button>
                    <div style={{ flex: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
                      {[...Array(16)].map((_, j) => <div key={j} style={{ width: 3, height: Math.random() * 14 + 4, background: msg.fromMe ? 'rgba(255,255,255,0.5)' : 'var(--primary)', borderRadius: 2, opacity: 0.5 + Math.random() * 0.5 }} />)}
                    </div>
                    <span style={{ fontSize: 10, opacity: 0.7 }}>{msg.voice.duration}s</span>
                  </div>
                ) : (
                  <p style={{ fontSize: 14, lineHeight: 1.4 }}>{msg.text}</p>
                )}
                <p style={{ fontSize: 10, marginTop: 4, opacity: 0.6, textAlign: 'right' }}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recording indicator */}
        {isRecordingVoice && (
          <div style={{ background: '#FEF2F2', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid #FECACA' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1s ease infinite' }} />
            <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 600, flex: 1 }}>Enregistrement en cours...</span>
            <button onClick={() => {
              setIsRecordingVoice(false);
              if (!openConversation) return;
              setChatMessages(prev => ({
                ...prev,
                [openConversation]: [...(prev[openConversation] || []), { fromMe: true, time: 'Maintenant', voice: { duration: Math.floor(Math.random() * 8) + 3 } }],
              }));
              showToast('🎤 Message vocal envoyé');
            }} style={{ padding: '6px 12px', background: '#EF4444', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 12, border: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Square size={12} /> Envoyer
            </button>
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '12px 16px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setIsRecordingVoice(true)} style={{ width: 40, height: 40, borderRadius: '50%', background: isRecordingVoice ? '#FEF2F2' : '#F3F4F6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isRecordingVoice ? '#EF4444' : 'var(--text-secondary)', flexShrink: 0 }}>
            <Mic size={20} />
          </button>
          <input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Écrire un message..."
            style={{ flex: 1, padding: '10px 16px', borderRadius: 20, border: '1px solid var(--border)', fontSize: 14, outline: 'none' }}
          />
          <button onClick={handleSendMessage} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Send size={18} color="#fff" />
          </button>
        </div>
      </div>
    );
  }

  // ═══ PANEL: Messages (liste) ═══
  if (activePanel === 'messages') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setActivePanel(null)}><ChevronLeft size={24} /></button>
          <h1>Messages</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          {messages.map(msg => (
            <div key={msg.id} className="card" onClick={() => { setOpenConversation(msg.id); setActivePanel('chat'); }}
              style={{ display: 'flex', gap: 14, padding: 16, marginBottom: 10, cursor: 'pointer', border: msg.unread ? '1px solid var(--primary)' : '1px solid transparent' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{msg.photo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: msg.unread ? 700 : 500, fontSize: 14 }}>{msg.from}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-light)', flexShrink: 0 }}>{msg.time}</span>
                </div>
                <p style={{ fontSize: 13, color: msg.unread ? 'var(--text)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.lastMsg}</p>
              </div>
              {msg.unread && <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--primary)', alignSelf: 'center', flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ PANEL: Avis ═══
  if (activePanel === 'avis') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setActivePanel(null)}><ChevronLeft size={24} /></button>
          <h1>Mes avis</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          {reviews.map(r => (
            <div key={r.id} className="card" style={{ padding: 16, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{r.product}</span>
                <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{r.date}</span>
              </div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i <= r.rating ? '#FBBF24' : 'none'} color="#FBBF24" />)}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ PANEL: Devenir Producteur ═══
  if (activePanel === 'devenir_producteur') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setActivePanel(null)}><ChevronLeft size={24} /></button>
          <h1>Devenir producteur</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          {existingReq && existingReq.status === 'en_attente' ? (
            <div style={{ background: '#FFFBEB', color: '#B45309', padding: '20px', borderRadius: 12, textAlign: 'center', border: '1px solid #FDE68A', marginTop: 40 }}>
              <span style={{ fontSize: 40, display: 'block', marginBottom: 10 }}>⏳</span>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Demande en cours d'examen</p>
              <p style={{ fontSize: 13, color: '#92400E' }}>Votre demande pour l'exploitation "{existingReq.farmName}" est en cours de validation par notre équipe d'administration.</p>
              <button className="btn btn-outline btn-block" style={{ marginTop: 20 }} onClick={() => setActivePanel(null)}>Retour au profil</button>
            </div>
          ) : existingReq && existingReq.status === 'approuve' ? (
            <div style={{ background: '#F0FDF4', color: '#22C55E', padding: '20px', borderRadius: 12, textAlign: 'center', border: '1px solid #BBF7D0', marginTop: 40 }}>
              <span style={{ fontSize: 40, display: 'block', marginBottom: 10 }}>✅</span>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Félicitations !</p>
              <p style={{ fontSize: 13, color: '#166534' }}>Votre compte producteur a été approuvé. Vous pouvez maintenant basculer en mode producteur depuis votre profil.</p>
              <button className="btn btn-primary btn-block" style={{ marginTop: 20 }} onClick={() => setActivePanel(null)}>Retour au profil</button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>Remplissez ce formulaire pour rejoindre notre réseau de producteurs vérifiés. Vos produits seront visibles par des milliers d'acheteurs.</p>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Nom de l'exploitation</label>
                <input value={formReq.farmName} onChange={e => setFormReq({...formReq, farmName: e.target.value})} placeholder="ex: Ferme du Saloum" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Région</label>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 8, paddingRight: 8 }}>
                  <select value={formReq.region} onChange={e => setFormReq({...formReq, region: e.target.value, department: ''})} style={{ width: '100%', padding: '12px 16px', border: 'none', background: 'transparent', fontSize: 14, outline: 'none' }} disabled={regionsLoading}>
                    {regionsLoading ? (
                      <option>Chargement...</option>
                    ) : (
                      regionNames.map(name => <option key={name} value={name}>{name}</option>)
                    )}
                  </select>
                  <button onClick={async () => { try { const c = await getCurrentLocation(); const m = regionNames.find(r => c.toLowerCase().includes(r.toLowerCase())); if (m) setFormReq({...formReq, region: m, department: ''}); showToast(`📍 Position : ${c}`); } catch(e: any) { showToast(`⚠️ ${e.message}`); } }} style={{ color: '#3B82F6', flexShrink: 0, padding: 8 }} title="Me géolocaliser">
                    <Navigation size={18} />
                  </button>
                </div>
              </div>
              {getDepartments(formReq.region).length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Département</label>
                  <select value={formReq.department} onChange={e => setFormReq({...formReq, department: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option value="">Sélectionner un département</option>
                    {getDepartments(formReq.region).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Principales spécialités</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SPECIALTIES_LIST.map(s => (
                    <button key={s} onClick={() => toggleSpec(s)} type="button" style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: selectedSpecialties.includes(s) ? '2px solid var(--primary)' : '1px solid var(--border)', background: selectedSpecialties.includes(s) ? 'var(--primary-light)' : 'var(--surface)', color: selectedSpecialties.includes(s) ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      {selectedSpecialties.includes(s) ? '✓ ' : ''}{s}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>NINEA ou Registre de Commerce</label>
                <input placeholder="Numéro NINEA (optionnel)" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Photo de la Carte d'Identité (CNI)</label>
                <div style={{ width: '100%', padding: '20px', border: '1.5px dashed var(--primary)', borderRadius: 8, textAlign: 'center', background: 'var(--primary-light)', cursor: 'pointer' }}>
                  <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>Taper pour uploader (PDF, JPG)</p>
                </div>
              </div>

              <button className="btn btn-primary btn-block" onClick={() => {
                if (!user || !formReq.farmName) { showToast('⚠️ Veuillez remplir le nom de l\'exploitation'); return; }
                submitProducerRequest({
                  userId: user.id,
                  userName: user.name,
                  farmName: formReq.farmName,
                  region: formReq.region,
                  specialties: formReq.specialties
                });
              }}>
                Soumettre ma demande
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ═══ PAGE PROFIL PRINCIPALE ═══
  const menuItems = [
    { label: 'Mes informations', icon: <Edit2 size={20} />, bg: '#EAF7EF', color: '#0B6B32', action: () => setActivePanel('infos') },
    { label: 'Adresses de livraison', icon: <Truck size={20} />, bg: '#EFF6FF', color: '#3B82F6', action: () => setActivePanel('adresses') },
    { label: 'Moyens de paiement', icon: <CreditCard size={20} />, bg: '#FFF7ED', color: '#F97316', action: () => setActivePanel('paiement') },
    { label: 'Notifications', icon: <Bell size={20} />, bg: '#FEF3C7', color: '#D97706', action: () => setActivePanel('notifs') },
  ];

  const activityItems = [
    { label: 'Mes commandes', icon: <ShoppingBag size={20} />, action: () => router.push('/acheteur/commandes') },
    { label: `Mes favoris (${favorites.length})`, icon: <Heart size={20} />, action: () => setActivePanel('favoris') },
    { label: 'Mes avis', icon: <Star size={20} />, action: () => setActivePanel('avis') },
    { label: 'Messages', icon: <MessageCircle size={20} />, action: () => setActivePanel('messages'), badge: 1 },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Profile Info — sans roue crantée inutile */}
      <div style={{ background: 'var(--surface)', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', marginBottom: 12, border: '3px solid var(--primary-light)' }}>
          <img src={user?.photo || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{user?.name || 'Fatou Diop'}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
          <Mail size={14} /> {user?.email}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
          <Phone size={14} /> {user?.phone}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mon compte</p>
        <div className="card" style={{ marginBottom: 20 }}>
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', width: '100%', borderBottom: i < menuItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>{item.icon}</div>
              <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              <ChevronRight size={18} color="var(--text-light)" />
            </button>
          ))}
        </div>

        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mes activités</p>
        <div className="card" style={{ marginBottom: 20 }}>
          {activityItems.map((item, i) => (
            <button key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', width: '100%', borderBottom: i < activityItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.icon}</span>
              <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              {item.badge ? <span style={{ background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{item.badge}</span> : <ChevronRight size={18} color="var(--text-light)" />}
            </button>
          ))}
        </div>

        {user?.id?.startsWith('producer') || (existingReq && existingReq.status === 'approuve') ? (
          <button onClick={() => { switchRole(); router.replace('/producteur'); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 14, borderRadius: 12, background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: 14, marginTop: 8 }}>
            <RefreshCw size={18} /> Passer en mode Producteur
          </button>
        ) : (
          <button onClick={() => setActivePanel('devenir_producteur')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 14, borderRadius: 12, background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 600, fontSize: 14, marginTop: 8, border: '1.5px solid var(--accent)' }}>
            <RefreshCw size={18} /> {existingReq && existingReq.status === 'en_attente' ? 'Demande producteur en cours' : 'Devenir producteur'}
          </button>
        )}

        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 14, borderRadius: 12, border: '1px solid var(--error)', color: 'var(--error)', fontWeight: 600, fontSize: 14, marginTop: 8 }}>
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 100, left: 20, right: 20, background: '#18181B', color: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{toast}</div>
      )}
    </div>
  );
}
