'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, MapPin, Check, CreditCard, Wallet, Lock, Plus, Navigation, ShieldCheck, Truck } from 'lucide-react';
import { formatPrice, getCurrentLocation } from '@/lib/utils';

type Step = 'recap' | 'address' | 'payment' | 'confirm' | 'success';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, cartItemCount } = useAuth();
  const [step, setStep] = useState<Step>('recap');
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('wave');
  const [confirmCode, setConfirmCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId] = useState(`CMD-${Date.now().toString().slice(-4)}`);

  const deliveryFee = cartTotal >= 5000 ? 0 : 1000;
  const total = cartTotal + deliveryFee;

  const [addresses, setAddresses] = useState([
    { label: '🏠 Domicile', detail: 'Rue 12, Médina, Dakar, Sénégal', default: true },
    { label: '🏢 Bureau', detail: 'Avenue Cheikh Anta Diop, Point E, Dakar', default: false },
  ]);

  const handleLocateMe = async () => {
    try {
      const city = await getCurrentLocation();
      alert(`📍 Vrai GPS détecté : Vous êtes à ${city}. L'adresse a été ajoutée.`);
      setAddresses([...addresses, { label: '📍 Position Actuelle', detail: city, default: false }]);
      setSelectedAddress(addresses.length);
    } catch (error: any) {
      alert(`Impossible d'obtenir la position GPS: ${error.message}`);
    }
  };

  const paymentMethods = [
    { id: 'wave', name: 'Wave', icon: '🌊', desc: 'Via PayDunya', color: '#1DC7EA' },
    { id: 'om', name: 'Orange Money', icon: '🟧', desc: 'Via PayDunya', color: '#FF6600' },
    { id: 'fm', name: 'Free Money', icon: '🔴', desc: 'Via PayDunya', color: '#E50000' },
    { id: 'cod', name: 'À la livraison', icon: '💵', desc: 'Payez en espèces', color: '#22C55E' },
  ];

  const handleConfirmPayment = async () => {
    if (paymentMethod !== 'cod' && confirmCode.length < 4) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setStep('success');
    clearCart();
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🛒</p>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Panier vide</p>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>Ajoutez des produits pour passer commande</p>
        <button className="btn btn-primary" onClick={() => router.push('/acheteur/recherche')}>Découvrir</button>
      </div>
    );
  }

  // ═══ SUCCESS ═══
  if (step === 'success') {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Check size={40} color="var(--success)" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Commande confirmée !</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>Numéro de commande</p>
        <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)', marginBottom: 24 }}>{orderId}</p>
        <div className="card" style={{ padding: 16, width: '100%', maxWidth: 340, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
            <span>Total payé</span><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
            <span>Paiement</span><span>{paymentMethods.find(p => p.id === paymentMethod)?.name}</span>
          </div>
        </div>
        <button className="btn btn-primary btn-block" style={{ maxWidth: 340, marginBottom: 10 }} onClick={() => router.push('/acheteur/commandes')}>
          Suivre ma commande
        </button>
        <button className="btn btn-outline btn-block" style={{ maxWidth: 340 }} onClick={() => router.push('/acheteur')}>
          Retour à l&apos;accueil
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 100 }}>
      {/* Header */}
      <div className="page-header">
        <button onClick={() => step === 'recap' ? router.back() : setStep(step === 'confirm' ? 'payment' : step === 'payment' ? 'address' : 'recap')}>
          <ChevronLeft size={24} />
        </button>
        <h1>{step === 'recap' ? 'Récapitulatif' : step === 'address' ? 'Livraison' : step === 'payment' ? 'Paiement' : 'Confirmation'}</h1>
        <div style={{ width: 24 }} />
      </div>

      {/* Progress steps */}
      <div style={{ display: 'flex', gap: 4, padding: '16px 20px 0' }}>
        {['recap', 'address', 'payment', 'confirm'].map((s, i) => (
          <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: ['recap', 'address', 'payment', 'confirm'].indexOf(step) >= i ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP: Récap */}
      {step === 'recap' && (
        <div style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Vos articles ({cartItemCount})</h3>
          {cart.map(item => (
            <div key={item.product.id} className="card" style={{ display: 'flex', gap: 12, padding: 14, marginBottom: 10 }}>
              <img src={item.product.images[0]} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{item.product.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.quantity} {item.product.unit}</p>
              </div>
              <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>{formatPrice(item.product.price * item.quantity)}</p>
            </div>
          ))}
          <div className="card" style={{ padding: 16, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
              <span>Sous-total</span><span>{formatPrice(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
              <span>Livraison</span>
              <span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'var(--text)' }}>{deliveryFee === 0 ? 'Gratuite ✓' : formatPrice(deliveryFee)}</span>
            </div>
            {deliveryFee > 0 && <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 8 }}>🎁 Livraison gratuite à partir de 5 000 FCFA</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
              <span>Total</span><span style={{ color: 'var(--primary)' }}>{formatPrice(total)}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => setStep('address')}>
            Choisir l&apos;adresse
          </button>
        </div>
      )}

      {/* STEP: Adresse */}
      {step === 'address' && (
        <div style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Adresse de livraison</h3>
          {addresses.map((addr, i) => (
            <button key={i} onClick={() => setSelectedAddress(i)} className="card"
              style={{ display: 'flex', gap: 14, padding: 16, marginBottom: 10, width: '100%', textAlign: 'left', border: selectedAddress === i ? '2px solid var(--primary)' : '1px solid transparent' }}>
              <MapPin size={20} color={selectedAddress === i ? 'var(--primary)' : 'var(--text-light)'} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{addr.label}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{addr.detail}</p>
              </div>
              {selectedAddress === i && <Check size={20} color="var(--primary)" />}
            </button>
          ))}
          <button onClick={handleLocateMe} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#EFF6FF', color: '#3B82F6', border: '1px dashed #BFDBFE', padding: '14px', borderRadius: 12, width: '100%', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
            <Navigation size={18} /> Utiliser ma position actuelle
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', color: 'var(--text-secondary)', fontSize: 13 }}>
            <Truck size={16} /> Livraison estimée : 30 - 60 minutes
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 8 }} onClick={() => setStep('payment')}>
            Choisir le paiement
          </button>
        </div>
      )}

      {/* STEP: Paiement */}
      {step === 'payment' && (
        <div style={{ padding: 20 }}>
          <div style={{ background: '#0F172A', color: '#fff', padding: '16px 20px', borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lock size={20} color="#0F172A" />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                Garantie Séquestre <span style={{ color: '#38BDF8' }}>PayDunya</span>
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.4, opacity: 0.9 }}>
                Votre argent est bloqué en toute sécurité. Il ne sera transféré au producteur <strong>qu'après confirmation de votre livraison</strong>.
              </p>
            </div>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Moyen de paiement</h3>
          {paymentMethods.map(pm => (
            <button key={pm.id} onClick={() => setPaymentMethod(pm.id)} className="card"
              style={{ display: 'flex', gap: 14, padding: 16, marginBottom: 10, width: '100%', textAlign: 'left', border: paymentMethod === pm.id ? '2px solid var(--primary)' : '1px solid transparent' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${pm.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{pm.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{pm.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{pm.desc}</p>
              </div>
              {paymentMethod === pm.id && <Check size={20} color="var(--primary)" />}
            </button>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            <ShieldCheck size={16} color="var(--success)" /> Paiement 100% sécurisé
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 8 }} onClick={() => setStep('confirm')}>
            Confirmer — {formatPrice(total)}
          </button>
        </div>
      )}

      {/* STEP: Confirmation code */}
      {step === 'confirm' && (
        <div style={{ padding: 20 }}>
          <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>
              {paymentMethods.find(p => p.id === paymentMethod)?.icon}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              {paymentMethod === 'cod' ? 'Confirmer la commande' : `Paiement Sécurisé PayDunya`}
            </h3>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(total)}</p>
          </div>

          {paymentMethod !== 'cod' && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12, textAlign: 'center' }}>
                Entrez le code de confirmation reçu par SMS
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {[0, 1, 2, 3].map(i => (
                  <input
                    key={i}
                    maxLength={1}
                    value={confirmCode[i] || ''}
                    onChange={e => {
                      const val = e.target.value;
                      if (val.length <= 1) {
                        const newCode = confirmCode.split('');
                        newCode[i] = val;
                        setConfirmCode(newCode.join(''));
                        if (val && i < 3) {
                          const next = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                          next?.focus();
                        }
                      }
                    }}
                    style={{
                      width: 56, height: 56, borderRadius: 12,
                      border: '2px solid var(--border)', fontSize: 24,
                      fontWeight: 700, textAlign: 'center', outline: 'none',
                    }}
                  />
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', marginTop: 12 }}>
                Code démo : <strong style={{ color: 'var(--primary)' }}>1234</strong>
              </p>
            </div>
          )}

          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={handleConfirmPayment}
            disabled={loading || (paymentMethod !== 'cod' && confirmCode.length < 4)}
            style={{ opacity: loading || (paymentMethod !== 'cod' && confirmCode.length < 4) ? 0.6 : 1 }}
          >
            {loading ? '⏳ Traitement en cours...' : '✓ Confirmer le paiement'}
          </button>
        </div>
      )}
    </div>
  );
}
