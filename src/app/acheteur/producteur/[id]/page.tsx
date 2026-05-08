'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { products } from '@/data/mock-products';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, MapPin, Star, Heart, MessageCircle, Check, Phone, ShoppingBag, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const producers = [
  { id: 'producer-1', name: 'Amadou Ba', farm: 'Ferme Ba', region: 'Kolda', bio: 'Exploitant agricole depuis 15 ans à Kolda. Spécialisé en mangues Kent, céréales et produits laitiers. Certification bio depuis 2020.', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', cover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=250&fit=crop', verified: true, rating: 4.7, reviewCount: 67, memberSince: '2020', specialties: ['Fruits', 'Céréales', 'Laitiers'] },
  { id: 'producer-2', name: 'Ousmane Diallo', farm: 'Ferme du Saloum', region: 'Fatick', bio: 'Producteur de riz local et de tomates dans la vallée du Saloum. Pratiques agricoles durables et respect de la terre.', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', cover: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=250&fit=crop', verified: true, rating: 4.5, reviewCount: 43, memberSince: '2021', specialties: ['Céréales', 'Légumes'] },
  { id: 'producer-3', name: 'Alpha Ndiaye', farm: 'Alpha Trading', region: 'Thiès', bio: 'Grossiste et producteur d\'oignons et de pommes de terre. Approvisionnement régulier des marchés de Dakar.', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', cover: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&h=250&fit=crop', verified: false, rating: 4.3, reviewCount: 28, memberSince: '2022', specialties: ['Tubercules', 'Légumes'] },
  { id: 'producer-4', name: 'Mariama Sow', farm: 'Coopérative Casamance', region: 'Ziguinchor', bio: 'Coopérative de femmes productrices de miel bio et d\'élevage de volailles fermières en Casamance.', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop', cover: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&h=250&fit=crop', verified: true, rating: 4.8, reviewCount: 52, memberSince: '2019', specialties: ['Miel', 'Volaille'] },
];

export default function ProducerPublicPage() {
  const router = useRouter();
  const params = useParams();
  const producerId = params.id as string;
  const { favorites, toggleFavorite } = useAuth();

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg) return;
    setShowContactModal(false);
    setContactSuccess(true);
    setContactMsg('');
    setTimeout(() => setContactSuccess(false), 3000);
  };

  const producer = producers.find(p => p.id === producerId) || producers[0];
  const producerProducts = products.filter(p => p.producerId === producer.id && p.isAvailable);

  const reviews = [
    { user: 'Fatou D.', rating: 5, comment: 'Excellents produits, toujours frais !', date: 'Il y a 2j' },
    { user: 'Moussa F.', rating: 4, comment: 'Bonne qualité, livraison rapide.', date: 'Il y a 1 sem.' },
    { user: 'Awa S.', rating: 5, comment: 'Je recommande vivement !', date: 'Il y a 2 sem.' },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 100 }}>
      {/* Cover + Back button */}
      <div style={{ position: 'relative', height: 180 }}>
        <img src={producer.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)' }} />
        <button onClick={() => router.back()} style={{ position: 'absolute', top: 16, left: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Profile card */}
      <div style={{ padding: '0 20px', marginTop: -40, position: 'relative', zIndex: 1 }}>
        <div className="card" style={{ padding: 20, textAlign: 'center', overflow: 'visible' }}>
          <img src={producer.photo} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', margin: '-60px auto 12px', boxShadow: 'var(--shadow-md)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{producer.name}</h2>
            {producer.verified && <Check size={16} color="#fff" style={{ background: '#3B82F6', borderRadius: '50%', padding: 2 }} />}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{producer.farm}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
            <MapPin size={13} /> {producer.region}, Sénégal
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
            <div><span style={{ fontSize: 18, fontWeight: 700 }}>{producer.rating}</span><p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Note</p></div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div><span style={{ fontSize: 18, fontWeight: 700 }}>{producerProducts.length}</span><p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Produits</p></div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div><span style={{ fontSize: 18, fontWeight: 700 }}>{producer.reviewCount}</span><p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Avis</p></div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowContactModal(true)}>
              {contactSuccess ? <><Check size={16} /> Envoyé</> : <><MessageCircle size={16} /> Contacter</>}
            </button>
            <a href={`tel:+221770000000`} className="btn btn-outline" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={16} style={{ marginRight: 6 }} /> Appeler
            </a>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ padding: '16px 20px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>À propos</h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{producer.bio}</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          {producer.specialties.map(s => (
            <span key={s} style={{ padding: '4px 12px', borderRadius: 20, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 12, fontWeight: 600 }}>{s}</span>
          ))}
          <span style={{ padding: '4px 12px', borderRadius: 20, background: 'var(--bg)', color: 'var(--text-secondary)', fontSize: 12 }}>Membre depuis {producer.memberSince}</span>
        </div>
      </div>

      {/* Produits */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Ses produits ({producerProducts.length})</h3>
        </div>
        <div className="product-grid">
          {producerProducts.map(product => (
            <div key={product.id} className="product-card" onClick={() => router.push(`/acheteur/produit/${product.id}`)} style={{ cursor: 'pointer' }}>
              <div className="product-card-image">
                <img src={product.images[0]} alt={product.name} />
                {product.discount && <span style={{ position: 'absolute', top: 8, left: 8, background: '#EF4444', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>-{product.discount}%</span>}
                <button className="product-card-fav" onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }}>
                  <Heart size={14} fill={favorites.includes(product.id) ? '#EF4444' : 'none'} color={favorites.includes(product.id) ? '#EF4444' : '#6B7280'} />
                </button>
              </div>
              <div className="product-card-body">
                <p className="product-card-name">{product.name}</p>
                <p className="product-card-price">{formatPrice(product.price)} / {product.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avis */}
      <div style={{ padding: '0 20px 20px' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Avis clients</h3>
        {reviews.map((r, i) => (
          <div key={i} className="card" style={{ padding: 14, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{r.user}</span>
              <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{r.date}</span>
            </div>
            <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
              {[1, 2, 3, 4, 5].map(j => <Star key={j} size={12} fill={j <= r.rating ? '#FBBF24' : 'none'} color="#FBBF24" />)}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.comment}</p>
          </div>
        ))}
      </div>
      
      {/* Modal Contact */}
      {showContactModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowContactModal(false)}>
          <div style={{ background: 'var(--surface)', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Contacter {producer.name}</h2>
              <button onClick={() => setShowContactModal(false)} style={{ background: 'var(--bg)', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSendContact}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Votre message</label>
                <textarea
                  value={contactMsg}
                  onChange={e => setContactMsg(e.target.value)}
                  placeholder="Bonjour, je suis intéressé par vos produits..."
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)', fontSize: 14, minHeight: 120, resize: 'none', fontFamily: 'inherit' }}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
