'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Phone, Signal } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function UssdDemoPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [screen, setScreen] = useState('main');

  const handleSend = () => {
    if (screen === 'main') {
      if (input === '1') setScreen('prices');
      else if (input === '2') setScreen('orders');
      else if (input === '3') setScreen('weather');
      else setScreen('error');
    } else {
      if (input === '0') setScreen('main');
    }
    setInput('');
  };

  const getScreenContent = () => {
    switch (screen) {
      case 'main':
        return `AgriLien USSD
1. Prix du marché
2. Mes Commandes
3. Météo & Alertes
4. Mon Solde
---
Entrez votre choix:`;
      case 'prices':
        return `Prix Dakar (Gros)
- Oignon: 450F/Kg
- Tomate: 800F/Kg
- Arachide: 600F/Kg
---
0. Retour`;
      case 'orders':
        return `Commandes
1 nvl: 500Kg Oignon
(Fatou Diop)
---
1. Accepter
0. Retour`;
      case 'weather':
        return `Météo Niayes
Pluies fortes prévues demain.
Protégez semis!
---
0. Retour`;
      case 'error':
        return `Choix invalide.
---
0. Retour`;
      default:
        return '';
    }
  };

  return (
    <div style={{ background: '#111827', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <button onClick={() => router.back()} style={{ position: 'absolute', top: 20, left: 20, color: '#fff', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 20 }}>
        <ChevronLeft size={20} /> Retour
      </button>

      <div style={{ textAlign: 'center', color: '#fff', marginBottom: 30 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Démo USSD (*123#)</h1>
        <p style={{ fontSize: 14, opacity: 0.8, maxWidth: 300, margin: '0 auto' }}>
          Simulation de l'interface hors-ligne pour les producteurs sans smartphone ni connexion internet.
        </p>
      </div>

      {/* Feature Phone Mockup */}
      <div style={{ width: 300, height: 580, background: '#1F2937', borderRadius: 40, padding: 16, border: '4px solid #374151', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
        {/* Screen */}
        <div style={{ background: '#9CA3AF', height: 220, borderRadius: 20, border: '8px solid #111827', padding: 12, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, color: '#111827' }}>
            <Signal size={14} />
            <span style={{ fontSize: 10, fontWeight: 800 }}>12:45</span>
            <Phone size={14} />
          </div>
          
          <div style={{ flex: 1, background: '#E5E7EB', borderRadius: 8, padding: 10, position: 'relative' }}>
            <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 13, color: '#111827', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
              {getScreenContent()}
            </pre>
            <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', gap: 8 }}>
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{ flex: 1, background: '#fff', border: '1px solid #9CA3AF', borderRadius: 4, padding: '4px 8px', fontSize: 14, fontFamily: 'monospace' }}
                maxLength={1}
              />
              <button onClick={handleSend} style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Keypad */}
        <div style={{ flex: 1, marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, alignContent: 'start' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
            <button 
              key={key}
              onClick={() => setInput(key)}
              style={{ background: '#374151', border: 'none', borderRadius: 8, height: 48, color: '#fff', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
