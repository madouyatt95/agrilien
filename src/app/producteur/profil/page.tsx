'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { producerUser } from '@/data/mock-users';
import { specialties as SPECIALTIES_LIST } from '@/data/product-catalog';
import { Star, ShieldCheck, MapPin, ChevronRight, ChevronLeft, CreditCard, Truck, Lock, Settings, HelpCircle, LogOut, Edit, Bell, MessageCircle, BarChart3, Package, RefreshCw, Send, Mic, Square, Play, Pause, Upload, Clock } from 'lucide-react';

type Panel = null | 'infos' | 'paiement' | 'adresses' | 'securite' | 'notifs' | 'messages' | 'verification';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProducteurProfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPanel = (searchParams.get('panel') as Panel) || null;
  const { logout, switchRole } = useAuth();
  const producer = producerUser;
  const [panel, setPanel] = useState<Panel>(initialPanel);
  const [editMode, setEditMode] = useState(false);
  const [chatUser, setChatUser] = useState<{name: string, online: boolean} | null>(null);
  const [chatMsg, setChatMsg] = useState('');
  const [formData, setFormData] = useState({
    name: producer.name, email: 'amadou@agrilien.sn',
    phone: '+221 77 234 56 78', address: `${producer.city}, Sénégal`,
    farmSize: producer.farmSize, specialties: producer.specialties.join(', '),
  });
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(producer.specialties.filter(s => !SPECIALTIES_LIST.includes(s)));
  const [specializations, setSpecializations] = useState<string[]>(producer.specialties.filter(s => SPECIALTIES_LIST.includes(s)));
  const [notifSettings, setNotifSettings] = useState({ orders: true, promos: true, messages: true, newsletter: false });
  const [savedMsg, setSavedMsg] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const [isRecording, setIsRecording] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<{id: string, duration: number, playing: boolean}[]>([]);
  const [chatMessages, setChatMessages] = useState<{id: string, from: 'me'|'other', text?: string, voice?: {duration: number}, time: string}[]>([
    { id: '1', from: 'other', text: 'Bonjour, je voudrais savoir si vos mangues Kent sont toujours disponibles ?', time: '10:42' },
    { id: '2', from: 'other', text: 'Je voudrais commander 5 kg de mangues.', time: '10:43' },
  ]);
  const [verificationStatus, setVerificationStatus] = useState<'none'|'pending'|'verified'>('none');

  const handleSave = () => { setEditMode(false); setSavedMsg('Modifications enregistrées ✓'); setTimeout(() => setSavedMsg(''), 3000); };
  const handleLogout = () => { logout(); router.replace('/login'); };

  // ═══ PANEL: Infos personnelles ═══
  if (panel === 'infos') {
    const fields = [
      { label: 'Nom complet', key: 'name' as const },
      { label: 'Email', key: 'email' as const },
      { label: 'Téléphone', key: 'phone' as const },
      { label: 'Adresse', key: 'address' as const },
      { label: 'Taille exploitation', key: 'farmSize' as const },
    ];
    const toggleSpec = (s: string) => setSelectedSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setPanel(null)}><ChevronLeft size={24} /></button>
          <h1>Mes informations</h1>
          <button onClick={() => editMode ? handleSave() : setEditMode(true)} style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
            {editMode ? 'Sauvegarder' : 'Modifier'}
          </button>
        </div>
        <div style={{ padding: 20 }}>
          {savedMsg && <div style={{ background: '#F0FDF4', color: '#22C55E', padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>{savedMsg}</div>}
          {fields.map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>{f.label}</label>
              {editMode ? (
                <input value={formData[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--primary)', borderRadius: 8, fontSize: 14, outline: 'none' }} />
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}>{formData[f.key]}</div>
              )}
            </div>
          ))}
          {/* Spécialisation Métier */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Spécialisation Métier</label>
            {editMode ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SPECIALTIES_LIST.map(s => (
                  <button key={s} onClick={() => setSpecializations(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} type="button" style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: specializations.includes(s) ? '2px solid var(--primary)' : '1px solid var(--border)', background: specializations.includes(s) ? 'var(--primary-light)' : 'var(--surface)', color: specializations.includes(s) ? 'var(--primary)' : 'var(--text-secondary)' }}>
                    {specializations.includes(s) ? '✓ ' : ''}{s}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {specializations.length > 0 ? specializations.map(s => (
                  <span key={s} style={{ padding: '8px 14px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>🌾</span>
                    {s}
                  </span>
                )) : (
                  <div style={{ padding: '8px 14px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}>Non définie</div>
                )}
              </div>
            )}
          </div>
          {/* Spécialités produits */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Spécialités produits</label>
            {editMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selectedSpecialties.map(s => (
                    <button key={s} onClick={() => setSelectedSpecialties(prev => prev.filter(x => x !== s))} type="button" style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'var(--primary)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {s} <span>×</span>
                    </button>
                  ))}
                </div>
                <input 
                  placeholder="Ajouter un produit (ex: Tomate) et appuyer sur Entrée" 
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.currentTarget as HTMLInputElement).value.trim();
                      if (val && !selectedSpecialties.includes(val)) setSelectedSpecialties([...selectedSpecialties, val]);
                      (e.currentTarget as HTMLInputElement).value = '';
                    }
                  }}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedSpecialties.map(s => (
                  <span key={s} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══ PANEL: Vérification ═══
  if (panel === 'verification') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setPanel(null)}><ChevronLeft size={24} /></button>
          <h1>Vérification du compte</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          {verificationStatus === 'pending' ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 36 }}><Clock size={36} color="#F59E0B" /></div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>En attente de validation</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Votre pièce d&apos;identité a été soumise. Un administrateur la vérifiera sous 24 à 48h.</p>
              <div style={{ marginTop: 20, padding: 14, background: '#FFF7ED', borderRadius: 12, fontSize: 13, color: '#B45309' }}>⏳ Statut : En cours de vérification</div>
            </div>
          ) : verificationStatus === 'verified' ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><ShieldCheck size={36} color="#22C55E" /></div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#22C55E' }}>Compte vérifié ✓</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Votre identité a été confirmée par l&apos;administrateur.</p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><ShieldCheck size={28} color="#3B82F6" /></div>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Vérifiez votre identité</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Pour accéder à toutes les fonctionnalités, veuillez soumettre votre pièce d&apos;identité.</p>
              </div>
              <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📋 Document requis :</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>• Carte nationale d&apos;identité (CNI)</p>
              </div>
              <div style={{ border: '2px dashed var(--border)', borderRadius: 16, padding: 32, textAlign: 'center', marginBottom: 20 }}>
                <Upload size={32} color="var(--text-secondary)" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Cliquez pour télécharger votre CNI</p>
                <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>JPG, PNG ou PDF • 5 Mo max</p>
              </div>
              <button onClick={() => { setVerificationStatus('pending'); showToast('✅ Pièce d\'identité soumise !'); }} className="btn btn-primary btn-block btn-lg">Soumettre pour vérification</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ═══ PANEL: Adresses ═══
  if (panel === 'adresses') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setPanel(null)}><ChevronLeft size={24} /></button>
          <h1>Adresses de livraison</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          <div className="card" style={{ padding: 16, marginBottom: 12, border: '2px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>🌾 Exploitation</span>
              <span className="badge" style={{ background: '#EAF7EF', color: '#0B6B32' }}>Par défaut</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{producer.city}, Sénégal — {producer.farmSize}</p>
          </div>
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>🏠 Domicile</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Quartier Saré Moussa, Kolda</p>
          </div>
          <button className="btn btn-outline btn-block">+ Ajouter une adresse</button>
        </div>
      </div>
    );
  }

  // ═══ PANEL: Paiement ═══
  if (panel === 'paiement') {
    const methods = [
      { name: 'Wave', phone: '+221 77 *** ** 78', icon: '📱', active: true },
      { name: 'Orange Money', phone: '+221 76 *** ** 45', icon: '💳', active: false },
    ];
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setPanel(null)}><ChevronLeft size={24} /></button>
          <h1>Moyens de paiement</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          {methods.map((pm, i) => (
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

  // ═══ PANEL: Sécurité ═══
  if (panel === 'securite') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setPanel(null)}><ChevronLeft size={24} /></button>
          <h1>Sécurité</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          {[{ label: 'Changer le mot de passe', desc: 'Dernière modification il y a 3 mois' },
            { label: 'Authentification à deux facteurs', desc: 'Protégez votre compte avec la 2FA' },
            { label: 'Sessions actives', desc: '2 appareils connectés' }].map((item, i) => (
            <div key={i} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div><p style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</p><p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.desc}</p></div>
              <ChevronRight size={18} color="var(--text-light)" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ PANEL: Notifications ═══
  if (panel === 'notifs') {
    const notifications = [
      { id: 1, title: 'Nouvelle commande', desc: 'Vous avez reçu une commande de 12 000 FCFA de Fatou Diop.', time: 'Il y a 10 min', unread: true, icon: '📦' },
      { id: 2, title: 'Stock faible', desc: 'Attention: Le stock de "Mangues Kent" est presque épuisé (12 Kg restants).', time: 'Il y a 2h', unread: true, icon: '⚠️' },
      { id: 3, title: 'Paiement reçu', desc: 'Le virement de 245 000 FCFA a été traité avec succès.', time: 'Hier', unread: false, icon: '💰' },
      { id: 4, title: 'Avis client', desc: 'Un acheteur a laissé un avis 5 étoiles sur "Riz Local Étuvé".', time: 'Il y a 2j', unread: false, icon: '⭐' }
    ];
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        <div className="page-header">
          <button onClick={() => setPanel(null)}><ChevronLeft size={24} /></button>
          <h1>Notifications</h1>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ padding: 20 }}>
          {notifications.map(notif => (
            <div key={notif.id} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', gap: 14, borderLeft: notif.unread ? '4px solid var(--primary)' : '4px solid transparent' }}>
              <div style={{ fontSize: 24, alignSelf: 'flex-start', marginTop: 2 }}>{notif.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <p style={{ fontWeight: notif.unread ? 700 : 600, fontSize: 14 }}>{notif.title}</p>
                  <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{notif.time}</span>
                </div>
                <p style={{ fontSize: 13, color: notif.unread ? 'var(--text)' : 'var(--text-secondary)', lineHeight: 1.4 }}>{notif.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ PANEL: Messages ═══
  if (panel === 'messages') {
    const msgs = [
      { id: 1, from: 'Fatou Diop', lastMsg: 'Je voudrais commander 5 kg de mangues', time: 'Il y a 1h', unread: true },
      { id: 2, from: 'Moussa Ndiaye', lastMsg: 'Merci pour la livraison rapide !', time: 'Hier', unread: false },
      { id: 3, from: 'Support AgriLien', lastMsg: 'Votre profil a été vérifié avec succès.', time: 'Il y a 3j', unread: false },
    ];
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
        {chatUser ? (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: 'var(--surface)', padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <button onClick={() => setChatUser(null)}><ChevronLeft size={24} /></button>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👤</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15 }}>{chatUser.name}</p>
                <p style={{ fontSize: 11, color: chatUser.online ? 'var(--success)' : 'var(--text-light)' }}>{chatUser.online ? 'En ligne' : 'Vu récemment'}</p>
              </div>
            </div>
            
            <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {chatMessages.map(msg => (
                <div key={msg.id} style={{ alignSelf: msg.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                  {msg.voice ? (
                    <div style={{ background: msg.from === 'me' ? 'var(--primary)' : 'var(--surface)', border: msg.from === 'me' ? 'none' : '1px solid var(--border)', padding: '10px 14px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button style={{ width: 32, height: 32, borderRadius: '50%', background: msg.from === 'me' ? 'rgba(255,255,255,0.2)' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
                        <Play size={14} color={msg.from === 'me' ? '#fff' : 'var(--primary)'} />
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          {[...Array(20)].map((_, i) => <div key={i} style={{ width: 3, height: Math.random() * 16 + 4, background: msg.from === 'me' ? 'rgba(255,255,255,0.5)' : 'var(--primary)', borderRadius: 2, opacity: 0.6 + Math.random() * 0.4 }} />)}
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: msg.from === 'me' ? 'rgba(255,255,255,0.7)' : 'var(--text-light)' }}>{msg.voice.duration}s</span>
                    </div>
                  ) : (
                    <div style={{ background: msg.from === 'me' ? 'var(--primary)' : 'var(--surface)', border: msg.from === 'me' ? 'none' : '1px solid var(--border)', padding: '10px 14px', borderRadius: msg.from === 'me' ? '12px 12px 0 12px' : '12px 12px 12px 0', color: msg.from === 'me' ? '#fff' : 'var(--text)' }}>
                      <p style={{ fontSize: 14 }}>{msg.text}</p>
                    </div>
                  )}
                  <p style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 2, textAlign: msg.from === 'me' ? 'right' : 'left' }}>{msg.time}</p>
                </div>
              ))}
            </div>

            {/* Recording indicator */}
            {isRecording && (
              <div style={{ background: '#FEF2F2', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid #FECACA' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1s ease infinite' }} />
                <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 600, flex: 1 }}>Enregistrement en cours...</span>
                <button onClick={() => {
                  setIsRecording(false);
                  const newMsg = { id: Date.now().toString(), from: 'me' as const, voice: { duration: Math.floor(Math.random() * 10) + 3 }, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
                  setChatMessages(prev => [...prev, newMsg]);
                  showToast('🎤 Message vocal envoyé');
                }} style={{ padding: '6px 12px', background: '#EF4444', color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 12, border: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Square size={12} /> Arrêter
                </button>
              </div>
            )}

            <div style={{ background: 'var(--surface)', padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
              <button onClick={() => setIsRecording(true)} style={{ width: 44, height: 44, borderRadius: '50%', background: isRecording ? '#FEF2F2' : '#F3F4F6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isRecording ? '#EF4444' : 'var(--text-secondary)' }}>
                <Mic size={20} />
              </button>
              <input 
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                placeholder="Écrivez un message..." 
                onKeyDown={e => { if (e.key === 'Enter' && chatMsg.trim()) { setChatMessages(prev => [...prev, { id: Date.now().toString(), from: 'me', text: chatMsg, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]); setChatMsg(''); } }}
                style={{ flex: 1, padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 20, fontSize: 14, outline: 'none' }} 
              />
              <button 
                onClick={() => { if(chatMsg.trim()){ setChatMessages(prev => [...prev, { id: Date.now().toString(), from: 'me', text: chatMsg, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }]); setChatMsg(''); } }}
                style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={18} style={{ marginLeft: -2 }} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="page-header">
              <button onClick={() => setPanel(null)}><ChevronLeft size={24} /></button>
              <h1>Messages</h1>
              <div style={{ width: 24 }} />
            </div>
            <div style={{ padding: 20 }}>
              {msgs.map(msg => (
                <button key={msg.id} onClick={() => setChatUser({ name: msg.from, online: true })} className="card" style={{ display: 'flex', gap: 14, padding: 16, marginBottom: 10, border: msg.unread ? '1px solid var(--primary)' : '1px solid transparent', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>👤</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: msg.unread ? 700 : 500, fontSize: 14 }}>{msg.from}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{msg.time}</span>
                    </div>
                    <p style={{ fontSize: 13, color: msg.unread ? 'var(--text)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.lastMsg}</p>
                  </div>
                  {msg.unread && <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--primary)', alignSelf: 'center' }} />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // ═══ PAGE PROFIL PRINCIPALE ═══
  const accountMenu = [
    { label: 'Informations personnelles', icon: <Edit size={20} />, bg: '#EAF7EF', color: '#0B6B32', action: () => setPanel('infos') },
    { label: 'Moyens de paiement', icon: <CreditCard size={20} />, bg: '#FFF7ED', color: '#F97316', action: () => setPanel('paiement') },
    { label: 'Adresses de livraison', icon: <Truck size={20} />, bg: '#EFF6FF', color: '#3B82F6', action: () => setPanel('adresses') },
    { label: 'Sécurité', icon: <Lock size={20} />, bg: '#FEF2F2', color: '#EF4444', action: () => setPanel('securite') },
    { label: 'Vérification', icon: <ShieldCheck size={20} />, bg: '#F0FDF4', color: '#22C55E', action: () => setPanel('verification') },
  ];

  const activityMenu = [
    { label: 'Mes commandes', icon: <Package size={20} />, action: () => router.push('/producteur/commandes') },
    { label: 'Mes produits', icon: <BarChart3 size={20} />, action: () => router.push('/producteur/produits') },
    { label: 'Statistiques', icon: <BarChart3 size={20} />, action: () => router.push('/producteur/statistiques') },
    { label: 'Messages', icon: <MessageCircle size={20} />, action: () => setPanel('messages'), badge: 1 },
    { label: 'Notifications', icon: <Bell size={20} />, action: () => setPanel('notifs') },
  ];

  const actionMenu = [
    { label: 'Paramètres', icon: <Settings size={20} />, action: () => {} },
    { label: "Centre d'aide", icon: <HelpCircle size={20} />, action: () => {} },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Profile Header */}
      <div style={{ background: 'var(--primary)', padding: '40px 20px 30px', textAlign: 'center', position: 'relative' }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: '4px solid rgba(255,255,255,0.3)' }}>
          <img src={producer.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{producer.name}</h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, marginBottom: 6 }}>
          <ShieldCheck size={14} color="#22C55E" />
          <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>Producteur vérifié</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
          <Star size={14} color="#FBBF24" fill="#FBBF24" />
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{producer.rating} ({producer.reviewCount} avis)</span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Membre depuis {producer.memberSince}</p>
      </div>

      <div style={{ padding: 20 }}>
        {/* Farm Info */}
        <div className="card" style={{ padding: 16, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🌾 Mon exploitation</h3>
          {[
            { icon: <MapPin size={16} />, label: `${producer.city}, Sénégal` },
            { icon: <span>📐</span>, label: producer.farmSize },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--text)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
          <div style={{ padding: '10px 0' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>🌾 Spécialisation</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {specializations.length > 0 ? specializations.map(s => (
                <span key={s} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, background: 'var(--primary)', color: '#fff' }}>{s}</span>
              )) : (
                <span style={{ fontSize: 13, color: 'var(--text-light)' }}>Non définie</span>
              )}
            </div>
          </div>
          <div style={{ padding: '10px 0' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>🌿 Spécialités produits</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedSpecialties.map(s => (
                <span key={s} style={{ padding: '4px 10px', borderRadius: 16, fontSize: 11, fontWeight: 600, background: 'var(--primary-light)', color: 'var(--primary)' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Mon compte */}
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mon compte</p>
        <div className="card" style={{ marginBottom: 20 }}>
          {accountMenu.map((item, i) => (
            <button key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', width: '100%', borderBottom: i < accountMenu.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>{item.icon}</div>
              <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              <ChevronRight size={18} color="var(--text-light)" />
            </button>
          ))}
        </div>

        {/* Mes activités */}
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mes activités</p>
        <div className="card" style={{ marginBottom: 20 }}>
          {activityMenu.map((item, i) => (
            <button key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', width: '100%', borderBottom: i < activityMenu.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.icon}</span>
              <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              {item.badge ? <span style={{ background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{item.badge}</span> : <ChevronRight size={18} color="var(--text-light)" />}
            </button>
          ))}
        </div>

        {/* Actions */}
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</p>
        <div className="card" style={{ marginBottom: 20 }}>
          {actionMenu.map((item, i) => (
            <button key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', width: '100%', borderBottom: i < actionMenu.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.icon}</span>
              <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 500 }}>{item.label}</span>
              <ChevronRight size={18} color="var(--text-light)" />
            </button>
          ))}
        </div>

        <button onClick={() => { switchRole(); router.replace('/acheteur'); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 14, borderRadius: 12, background: 'var(--primary)', color: '#fff', fontWeight: 600, fontSize: 14 }}>
          <RefreshCw size={18} /> Passer en mode Acheteur
        </button>

        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: 14, borderRadius: 12, border: '1px solid var(--error)', color: 'var(--error)', fontWeight: 600, fontSize: 14, marginTop: 10 }}>
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </div>
  );
}

export default function ProducteurProfilPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Chargement...</div>}>
      <ProducteurProfilContent />
    </Suspense>
  );
}
