'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, ShoppingBag, Tractor, Shield, Building2, Phone } from 'lucide-react';
import { UserRole } from '@/types';
import AgriLienLogo from '@/components/ui/Logo';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAs } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      if (email.includes('admin')) router.push('/admin');
      else if (email.includes('amadou')) router.push('/producteur');
      else router.push('/acheteur');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    loginAs(role);
    switch (role) {
      case 'acheteur': router.push('/acheteur'); break;
      case 'acheteur_pro': router.push('/acheteur'); break;
      case 'producteur': router.push('/producteur'); break;
      case 'admin': router.push('/admin'); break;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Vrai logo AgriLien */}
        <div className={styles.logo}>
          <AgriLienLogo size="lg" />
        </div>
        <p className={styles.subtitle}>Marketplace agricole du Sénégal</p>

        {/* ═══ ACCÈS DÉMO EN UN CLIC ═══ */}
        <div className={styles.demoSection}>
          <p className={styles.demoTitle}>Accès rapide — un clic</p>
          <div className={styles.demoButtons}>
            <button onClick={() => handleDemoLogin('acheteur')} className={styles.demoBtn} data-role="acheteur">
              <div className={styles.demoBtnIcon} style={{ background: '#EAF7EF' }}>
                <ShoppingBag size={22} color="#0B6B32" />
              </div>
              <div className={styles.demoBtnText}>
                <strong>Acheteur Classique</strong>
                <span>Fatou Diop · Détail</span>
              </div>
            </button>
            <button onClick={() => handleDemoLogin('acheteur_pro')} className={styles.demoBtn} data-role="acheteur">
              <div className={styles.demoBtnIcon} style={{ background: '#F3E8FF' }}>
                <Building2 size={22} color="#9333EA" />
              </div>
              <div className={styles.demoBtnText}>
                <strong>Acheteur Pro (B2B)</strong>
                <span>Restaurant · Gros</span>
              </div>
            </button>
            <button onClick={() => handleDemoLogin('producteur')} className={styles.demoBtn} data-role="producteur">
              <div className={styles.demoBtnIcon} style={{ background: '#FFF7ED' }}>
                <Tractor size={22} color="#F97316" />
              </div>
              <div className={styles.demoBtnText}>
                <strong>Producteur</strong>
                <span>Amadou Ba · Kolda</span>
              </div>
            </button>
            <button onClick={() => handleDemoLogin('admin')} className={styles.demoBtn} data-role="admin">
              <div className={styles.demoBtnIcon} style={{ background: '#EFF6FF' }}>
                <Shield size={22} color="#3B82F6" />
              </div>
              <div className={styles.demoBtnText}>
                <strong>Admin</strong>
                <span>Super administrateur</span>
              </div>
            </button>
          </div>
        </div>

        <div className={styles.divider}><span>ou connectez-vous</span></div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com" required />
          </div>
          <div className={styles.field}>
            <label>Mot de passe</label>
            <div className={styles.passwordWrap}>
              <input type={showPassword ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.eyeBtn}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={`btn btn-primary btn-block btn-lg ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Nouveau sur AgriLien ?{' '}
              <button type="button" onClick={() => router.push('/register')} style={{ color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                Créer un compte
              </button>
            </p>
          </div>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button onClick={() => router.push('/ussd-demo')} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 20, padding: '8px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Phone size={14} /> Tester la version hors-ligne (USSD)
          </button>
        </div>
      </div>
    </div>
  );
}
