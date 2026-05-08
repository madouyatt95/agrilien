'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { products } from '@/data/mock-products';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, Heart, MapPin, Star, Truck, ShoppingCart, MessageCircle, ShieldCheck, Plus, Minus, Share2, Check, Leaf, X, Handshake } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, addToCart, favorites, toggleFavorite, cartItemCount } = useAuth();
  const product = products.find(p => p.id === params.id);
  const isB2B = user?.role === 'acheteur_pro';
  const minQty = product?.isPreorder && isB2B && product.minProOrderQuantity ? product.minProOrderQuantity : 1;
  const [quantity, setQuantity] = useState(minQty);
  const [addedMsg, setAddedMsg] = useState(false);

  // Négociation
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerSuccessMsg, setOfferSuccessMsg] = useState(false);

  let negotiationThreshold = 10;
  if (product) {
    if (product.category === 'AgriShare (Location)') negotiationThreshold = 3;
    else if (product.category === 'Céréales & Grains' || product.category === 'Tubercules & Racines') negotiationThreshold = 100;
    else if (product.category === 'Fruits & Légumes') negotiationThreshold = 50;
    else if (product.category === 'Bétail Bovin') negotiationThreshold = 2;
    else if (product.category === 'Volaille') negotiationThreshold = 20;
    else if (product.unit === 'Kg') negotiationThreshold = 50;
  }
  const canNegotiate = product ? quantity >= negotiationThreshold : false;

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerPrice) return;
    setShowOfferModal(false);
    setOfferSuccessMsg(true);
    setOfferPrice('');
    setTimeout(() => setOfferSuccessMsg(false), 3000);
  };

  if (!product) return (
    <div style={{ padding: 40, textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: 48, marginBottom: 12 }}>🔍</p>
      <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Produit introuvable</h2>
      <button className="btn btn-primary" onClick={() => router.back()}>Retour</button>
    </div>
  );

  const isFav = favorites.includes(product.id);
  const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 100 }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 300, background: '#f0f0f0' }}>
        <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 16, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <ChevronLeft size={22} />
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Share2 size={18} />
            </button>
            <button onClick={() => toggleFavorite(product.id)} style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Heart size={18} fill={isFav ? '#EF4444' : 'none'} color={isFav ? '#EF4444' : '#666'} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* Title & Price */}
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{product.name}</h1>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 10 }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(product.price)} / {product.unit}</p>
          {product.isPreorder && <span style={{ fontSize: 13, color: '#8B5CF6', fontWeight: 700, paddingBottom: 3 }}>Prix de gros</span>}
        </div>

        {/* Info row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {product.city}, {product.region}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={14} color="#FBBF24" fill="#FBBF24" /> {product.rating} ({product.reviewCount})</span>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: product.isPreorder ? '#F3E8FF' : product.isAvailable ? '#F0FDF4' : '#FEF2F2', color: product.isPreorder ? '#7C3AED' : product.isAvailable ? '#22C55E' : '#EF4444' }}>
            {product.isPreorder ? 'Pré-commande B2B' : product.isAvailable ? '✓ Disponible' : '✗ Indisponible'}
          </span>
          {product.isPreorder && product.harvestDate ? (
            <span className="badge" style={{ background: '#FFFBEB', color: '#D97706' }}>Récolte: {new Date(product.harvestDate).toLocaleDateString('fr-FR', {month: 'short', year: 'numeric'})}</span>
          ) : (
            <span className="badge" style={{ background: '#EAF7EF', color: '#0B6B32' }}>Stock: {product.stock} {product.unit}</span>
          )}
          {product.delivery && <span className="badge" style={{ background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', gap: 4 }}><Truck size={12} /> Livraison</span>}
        </div>

        {/* Quantity selector */}
        {product.isPreorder && !isB2B ? (
          <div style={{ background: '#FEF2F2', padding: 16, borderRadius: 12, marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: '#EF4444', fontWeight: 600 }}>Ce produit est réservé aux acheteurs professionnels (B2B) pour l'achat en gros. Veuillez vous connecter avec un compte Pro pour pré-commander.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: '14px 16px', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, display: 'block' }}>Quantité ({product.unit})</span>
              {product.isPreorder && <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Minimum : {minQty} {product.unit}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={() => quantity > minQty && setQuantity(quantity - (product.isPreorder ? 50 : 1))} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Minus size={16} />
              </button>
              <input 
                type="number" 
                min={minQty}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) setQuantity(Math.max(minQty, val));
                }}
                style={{ fontSize: 18, fontWeight: 700, minWidth: 24, width: 60, textAlign: 'center', background: 'transparent', border: 'none', outline: 'none' }}
              />
              <button onClick={() => setQuantity(quantity + (product.isPreorder ? 50 : 1))} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Plus size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Producer card */}
        <div style={{ marginBottom: 20, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ background: 'linear-gradient(135deg, #0B6B32 0%, #16A34A 100%)', padding: '16px 16px 40px', position: 'relative' }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Producteur Certifié</p>
          </div>
          <div style={{ padding: '0 16px 16px', marginTop: -28 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 12 }}>
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                  alt={product.producerName}
                  style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--surface)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)' }}>
                  <ShieldCheck size={11} color="#fff" />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 16 }}>{product.producerName}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{product.farmName}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={13} fill="#FBBF24" color="#FBBF24" />
                <span style={{ fontSize: 13, fontWeight: 700 }}>4.8</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>(52 avis)</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={12} /> {product.city}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => alert('Ouverture de la messagerie avec ' + product.producerName)}>
                <MessageCircle size={14} style={{ marginRight: 4 }} /> Contacter
              </button>
              <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => router.push(`/acheteur/producteur/${product.producerId}`)}>
                Voir le profil
              </button>
            </div>
          </div>
        </div>

        {/* Impact Carbone & Eco-Badges */}
        <div style={{ marginBottom: 24, padding: 20, borderRadius: 16, background: 'linear-gradient(to right, #F0FDF4, #DCFCE7)', border: '1px solid #BBF7D0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Leaf size={18} /> Bilan Carbone & Eco-Score
          </h3>
          <p style={{ fontSize: 12, color: '#15803D', marginBottom: 16, lineHeight: 1.5 }}>
            En achetant ce produit localement, vous évitez <strong>1.4 kg de CO₂</strong> par rapport à un produit importé.
          </p>
          
          <div style={{ position: 'relative', height: 8, background: '#86EFAC', borderRadius: 4, marginBottom: 8 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '15%', background: '#16A34A', borderRadius: 4 }}></div>
            <div style={{ position: 'absolute', top: -14, left: '15%', transform: 'translateX(-50%)', background: '#166534', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>
              A+
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#166534', fontWeight: 600, marginBottom: 16 }}>
            <span>Très faible impact (A)</span>
            <span>Fort impact (E)</span>
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', padding: '6px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#166534', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              🌱 100% Bio
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', padding: '6px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#166534', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              🤝 Commerce Équitable
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff', padding: '6px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#166534', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              💧 Irrigation Goutte-à-Goutte
            </span>
          </div>
        </div>

        {/* Description */}
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Description</h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Produits similaires</h3>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
              {similarProducts.map(p => (
                <div key={p.id} onClick={() => router.push(`/acheteur/produit/${p.id}`)} style={{ minWidth: 140, background: 'var(--surface)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer', flexShrink: 0 }}>
                  <div style={{ height: 100, overflow: 'hidden' }}>
                    <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{p.name}</p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(p.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Actions */}
      {!(product.isPreorder && !isB2B) && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--surface)', padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 0px))', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, zIndex: 50 }}>
          <button className="btn btn-outline" style={{ flex: 1, position: 'relative', opacity: canNegotiate ? 1 : 0.5 }} onClick={() => canNegotiate && setShowOfferModal(true)} disabled={!canNegotiate}>
            {offerSuccessMsg ? (
              <><Check size={18} color="#22C55E" /> Envoyé</>
            ) : (
              <><Handshake size={18} /> Négocier</>
            )}
          </button>
          <button className="btn btn-primary btn-lg" style={{ flex: 1, position: 'relative', background: product.isPreorder ? '#8B5CF6' : 'var(--primary)', borderColor: product.isPreorder ? '#8B5CF6' : 'var(--primary)' }} onClick={handleAddToCart}>
            {addedMsg ? (
              <><Check size={18} /> Ajouté !</>
            ) : (
              <><ShoppingCart size={18} /> {product.isPreorder ? 'Pré-commander' : 'Ajouter'}</>
            )}
          </button>
        </div>
      )}

      {/* Modal Faire une offre */}
      {showOfferModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowOfferModal(false)}>
          <div style={{ background: 'var(--surface)', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Faire une offre</h2>
              <button onClick={() => setShowOfferModal(false)} style={{ background: 'var(--bg)', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Vous souhaitez négocier le prix pour <strong>{quantity} {product.unit}</strong> ? Le prix actuel est de <strong>{formatPrice(product.price)} / {product.unit}</strong>.
            </p>

            <form onSubmit={handleSendOffer}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Votre prix proposé par {product.unit}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={e => setOfferPrice(e.target.value)}
                    placeholder={product.price.toString()}
                    style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)', fontSize: 16, fontWeight: 600 }}
                    required
                  />
                  <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-secondary)' }}>FCFA</span>
                </div>
                {offerPrice && (
                  <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginTop: 8 }}>
                    Total estimé : {formatPrice(parseInt(offerPrice) * quantity)}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Envoyer l'offre
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
