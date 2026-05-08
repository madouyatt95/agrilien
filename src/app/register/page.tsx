'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Tractor, ShoppingCart, User, MapPin, CheckCircle, Leaf, Navigation } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGalsenRegions } from '@/hooks/useGalsenAPI';
import { getCurrentLocation } from '@/lib/utils';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { regionNames, getDepartments, loading: regionsLoading } = useGalsenRegions();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'acheteur_classique' | 'acheteur_pro' | 'producteur' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    region: 'Dakar',
    department: '',
  });
  const [locating, setLocating] = useState(false);

  const handleLocateMe = async () => {
    setLocating(true);
    try {
      const city = await getCurrentLocation();
      // Try to match with a known region
      const matched = regionNames.find(r => city.toLowerCase().includes(r.toLowerCase()));
      if (matched) {
        setFormData({ ...formData, region: matched, department: '' });
      }
      alert(`📍 Position détectée : ${city}`);
    } catch (err: any) {
      alert(`Erreur GPS : ${err.message}`);
    } finally {
      setLocating(false);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = role === 'producteur' ? 5 : 3;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulation API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    // Automatically login with demo account based on role for demonstration
    if (role === 'producteur') {
      login('amadou@agrilien.sn', 'demo123');
      router.push('/producteur');
    } else if (role === 'acheteur_pro') {
      login('hotel@agrilien.sn', 'demo123');
      router.push('/acheteur');
    } else {
      login('fatou@agrilien.sn', 'demo123');
      router.push('/acheteur');
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <button onClick={handleBack} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          {[...Array(totalSteps)].map((_, i) => (
            <div key={i} style={{ height: 6, width: 24, borderRadius: 3, background: i + 1 <= step ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s ease' }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        
        {/* Step 1: Choix du rôle */}
        <div style={{ 
          position: 'absolute', width: '100%', padding: 24,
          transform: step === 1 ? 'translateX(0)' : 'translateX(-120%)',
          opacity: step === 1 ? 1 : 0,
          transition: 'transform 0.4s ease, opacity 0.4s ease',
          pointerEvents: step === 1 ? 'auto' : 'none'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: 16 }}>
              <Leaf size={32} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Bienvenue sur AgriLien</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Comment souhaitez-vous utiliser la plateforme ?</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button 
              onClick={() => { setRole('producteur'); setTimeout(handleNext, 300); }}
              style={{ padding: 24, borderRadius: 20, background: 'var(--surface)', border: role === 'producteur' ? '2px solid var(--primary)' : '2px solid var(--border)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s', boxShadow: role === 'producteur' ? '0 8px 16px rgba(11, 107, 50, 0.1)' : 'none' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Tractor size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Je suis Producteur</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Je veux vendre mes récoltes et répondre aux appels d'offres.</p>
              </div>
            </button>

            <button 
              onClick={() => { setRole('acheteur_pro'); setTimeout(handleNext, 300); }}
              style={{ padding: 24, borderRadius: 20, background: 'var(--surface)', border: role === 'acheteur_pro' ? '2px solid #8B5CF6' : '2px solid var(--border)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s', boxShadow: role === 'acheteur_pro' ? '0 8px 16px rgba(139, 92, 246, 0.1)' : 'none' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EDE9FE', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShoppingCart size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Acheteur B2B (Pro)</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Grossiste, hôtel, restaurant. Je lance des appels d'offres.</p>
              </div>
            </button>

            <button 
              onClick={() => { setRole('acheteur_classique'); setTimeout(handleNext, 300); }}
              style={{ padding: 24, borderRadius: 20, background: 'var(--surface)', border: role === 'acheteur_classique' ? '2px solid var(--accent)' : '2px solid var(--border)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s', boxShadow: role === 'acheteur_classique' ? '0 8px 16px rgba(249, 115, 22, 0.1)' : 'none' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Acheteur Classique</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Particulier. Je cherche des produits frais, locaux et de qualité.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Informations */}
        <div style={{ 
          position: 'absolute', width: '100%', padding: 24,
          transform: step === 2 ? 'translateX(0)' : step < 2 ? 'translateX(120%)' : 'translateX(-120%)',
          opacity: step === 2 ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
          pointerEvents: step === 2 ? 'auto' : 'none'
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Faisons connaissance</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Saisissez vos informations principales.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Nom complet</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '0 16px' }}>
                <User size={20} color="var(--text-light)" />
                <input 
                  type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Amadou Ba"
                  style={{ width: '100%', padding: '16px 12px', background: 'transparent', border: 'none', outline: 'none', fontSize: 16 }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Téléphone / Numéro Wave</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '0 16px' }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', paddingRight: 12, borderRight: '1px solid var(--border)' }}>+221</span>
                <input 
                  type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="77 123 45 67"
                  style={{ width: '100%', padding: '16px 12px', background: 'transparent', border: 'none', outline: 'none', fontSize: 16 }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Région principale</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '0 16px', paddingRight: 8 }}>
                <MapPin size={20} color="var(--text-light)" />
                <select 
                  value={formData.region} onChange={e => setFormData({...formData, region: e.target.value, department: ''})}
                  style={{ width: '100%', padding: '16px 12px', background: 'transparent', border: 'none', outline: 'none', fontSize: 16, appearance: 'none' }}
                  disabled={regionsLoading}
                >
                  {regionsLoading ? (
                    <option>Chargement...</option>
                  ) : (
                    regionNames.map(name => <option key={name} value={name}>{name}</option>)
                  )}
                </select>
                <button onClick={handleLocateMe} disabled={locating} style={{ color: locating ? '#9CA3AF' : '#3B82F6', flexShrink: 0, animation: locating ? 'spin 1s linear infinite' : 'none' }} title="Me géolocaliser">
                  <Navigation size={20} />
                </button>
              </div>
            </div>

            {getDepartments(formData.region).length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Département</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '0 16px' }}>
                  <MapPin size={20} color="var(--text-light)" />
                  <select
                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                    style={{ width: '100%', padding: '16px 12px', background: 'transparent', border: 'none', outline: 'none', fontSize: 16, appearance: 'none' }}
                  >
                    <option value="">Sélectionner un département</option>
                    {getDepartments(formData.region).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            )}

            <button 
              onClick={handleNext}
              disabled={!formData.name || !formData.phone}
              className="btn btn-primary btn-block btn-lg" style={{ marginTop: 12 }}
            >
              Continuer <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Step 3 (Acheteur: Finalisation, Producteur: Spécialités) */}
        <div style={{ 
          position: 'absolute', width: '100%', padding: 24,
          transform: step === 3 ? 'translateX(0)' : step < 3 ? 'translateX(120%)' : 'translateX(-120%)',
          opacity: step === 3 ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
          pointerEvents: step === 3 ? 'auto' : 'none'
        }}>
          {role === 'producteur' ? (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Que cultivez-vous ?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Sélectionnez vos spécialités principales.</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
                {['Mangues', 'Oignons', 'Riz', 'Tomates', 'Mil', 'Arachide', 'Anacarde', 'Volaille', 'Miel'].map(spec => (
                  <button key={spec} onClick={(e) => { e.currentTarget.classList.toggle('selected-pill'); }}
                    className="filter-pill" style={{ fontSize: 14, padding: '10px 16px' }}>
                    {spec}
                  </button>
                ))}
              </div>
              <style jsx>{`
                .selected-pill { background: var(--primary) !important; color: white !important; border-color: var(--primary) !important; }
              `}</style>
              
              <button onClick={handleNext} className="btn btn-primary btn-block btn-lg">
                Suivant <ChevronRight size={20} />
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle size={40} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Tout est prêt !</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
                Votre compte Acheteur a été configuré avec succès. Vous pouvez maintenant découvrir les meilleurs produits du Sénégal.
              </p>
              <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary btn-block btn-lg" style={{ background: 'var(--success)', borderColor: 'var(--success)' }}>
                {isSubmitting ? 'Création...' : 'Commencer mes achats'}
              </button>
            </div>
          )}
        </div>

        {/* Step 4 (Producteur: Justificatif) */}
        {role === 'producteur' && (
          <div style={{ 
            position: 'absolute', width: '100%', padding: 24,
            transform: step === 4 ? 'translateX(0)' : step < 4 ? 'translateX(120%)' : 'translateX(-120%)',
            opacity: step === 4 ? 1 : 0,
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
            pointerEvents: step === 4 ? 'auto' : 'none',
            overflowY: 'auto', maxHeight: '100%'
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Vérification</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Rejoignez notre réseau de producteurs vérifiés pour rassurer vos futurs acheteurs.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Nom de l'exploitation</label>
                <input placeholder="ex: Ferme du Saloum" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'var(--surface)' }} />
              </div>
              
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Numéro NINEA (Optionnel)</label>
                <input placeholder="Ex: 123456789" style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', background: 'var(--surface)' }} />
              </div>
              
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Photo de la Carte d'Identité (CNI)</label>
                <div style={{ border: '2px dashed var(--primary)', borderRadius: 12, padding: 24, textAlign: 'center', background: 'var(--primary-light)', cursor: 'pointer' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', border: '1px solid var(--primary)' }}>
                    <Leaf size={20} />
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--primary)', marginBottom: 2 }}>Scanner ou uploader</p>
                  <p style={{ fontSize: 11, color: 'var(--primary)', opacity: 0.8 }}>JPG ou PNG (Max 5Mo)</p>
                </div>
              </div>
            </div>
            
            <button onClick={handleNext} className="btn btn-primary btn-block btn-lg">
              Terminer l'inscription <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Step 5 (Producteur: Finalisation) */}
        {role === 'producteur' && (
          <div style={{ 
            position: 'absolute', width: '100%', padding: 24,
            transform: step === 5 ? 'translateX(0)' : 'translateX(120%)',
            opacity: step === 5 ? 1 : 0,
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
            pointerEvents: step === 5 ? 'auto' : 'none'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Tractor size={40} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Bienvenue {formData.name.split(' ')[0]} !</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
                Votre profil de producteur a été créé. Vos documents sont en cours de validation. Vous pouvez d'ores et déjà préparer votre catalogue.
              </p>
              <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary btn-block btn-lg">
                {isSubmitting ? 'Création...' : 'Accéder à mon tableau de bord'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
