'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, TrendingDown, RefreshCw, ShoppingBag } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  options?: { label: string; icon: string }[];
}

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: 'Salam ! 👋 Je suis votre assistant AgriLien. Comment puis-je vous aider aujourd\'hui ?',
    options: [
      { label: 'Trouver le meilleur prix', icon: '💰' },
      { label: 'Comparer les producteurs', icon: '📊' },
      { label: 'Optimiser mes coûts', icon: '📉' },
      { label: 'Proposer des alternatives', icon: '🔄' },
    ]
  }
];

const aiResponses: Record<string, string> = {
  'Trouver le meilleur prix': '💰 **Analyse des prix en cours...**\n\nVoici les meilleurs prix actuels :\n\n🧅 **Oignons** : 350F/Kg chez Alpha Ndiaye (Thiès) — *le moins cher du marché (-12%)*\n🍅 **Tomates** : 500F/Kg chez Ousmane Diallo (Fatick)\n🥭 **Mangues Kent** : 800F/Kg chez Amadou Ba (Kolda)\n\n💡 **Mon conseil** : Commandez les oignons chez Alpha et groupez avec les tomates de Ousmane pour économiser sur le transport !',
  'Comparer les producteurs': '📊 **Comparaison des producteurs de votre zone :**\n\n⭐ **Amadou Ba** (Kolda)\n• Note : 4.7/5 • Fiabilité : 98%\n• Spécialité : Mangues, Céréales\n\n⭐ **Mariama Sow** (Ziguinchor)\n• Note : 4.8/5 • Fiabilité : 99%\n• Spécialité : Miel Bio, Volaille\n\n⭐ **Alpha Ndiaye** (Thiès)\n• Note : 4.3/5 • Fiabilité : 92%\n• Spécialité : Oignons, Pommes de terre\n\n🏆 **Recommandation** : Pour la qualité, privilégiez Mariama Sow. Pour le prix, Alpha Ndiaye.',
  'Optimiser mes coûts': '📉 **Analyse de vos habitudes d\'achat :**\n\n🔍 Vous achetez souvent des tomates et oignons séparément.\n\n💡 **3 conseils pour réduire vos coûts :**\n\n1️⃣ **Groupage** : Combinez vos commandes d\'oignons et tomates. Économie estimée : **-15% sur le transport**.\n2️⃣ **Achat en gros** : Passez à 100Kg d\'oignons pour débloquer le prix négocié à 300F/Kg au lieu de 400F.\n3️⃣ **Saisonnalité** : Les mangues seront 30% moins chères dans 2 semaines (pic de récolte à Kolda).\n\n💰 **Économie totale estimée : 45 000 FCFA/mois**',
  'Proposer des alternatives': '🔄 **Alternatives intelligentes :**\n\nSi vous cherchez des **tomates** mais le prix est trop élevé :\n→ 🍅 Les **tomates cerises** de Mariama Sow sont 20% moins chères\n→ 🫙 La **purée de tomate artisanale** (Coopérative Casamance) offre un meilleur rapport qualité/prix pour la cuisine\n\nSi vous cherchez du **mil** :\n→ 🌾 Le **fonio** est une alternative nutritive à prix comparable\n→ 🌽 Le **maïs local** est actuellement 25% moins cher\n\n💡 **Astuce** : Activez les alertes de prix pour être notifié quand vos produits favoris baissent !',
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOptionClick = (option: string) => {
    const userMsg: Message = { role: 'user', content: option };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = aiResponses[option] || 'Je suis en train d\'analyser votre demande. Fonctionnalité en développement ! 🚧';
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const keywords = inputValue.toLowerCase();
      let response = '';
      if (keywords.includes('prix') || keywords.includes('combien') || keywords.includes('cher')) {
        response = '💰 D\'après mon analyse en temps réel, les meilleurs prix pour votre recherche :\n\n• **Oignons** : à partir de 350F/Kg (Alpha Trading, Thiès)\n• **Tomates** : à partir de 500F/Kg (Ferme du Saloum, Fatick)\n\nSouhaitez-vous que je lance une négociation automatique ?';
      } else if (keywords.includes('livraison') || keywords.includes('transport')) {
        response = '🚛 Pour optimiser votre livraison, je recommande le groupage avec d\'autres acheteurs de votre zone. Prochaine livraison groupée vers Dakar : **Mercredi 15 Mai**. Économie estimée : **-40% sur le transport**.';
      } else {
        response = `🤖 J'ai bien noté votre demande : "${inputValue}". \n\nJe suis en train d'analyser les données du marché pour vous donner la meilleure réponse. En attendant, voici quelques actions rapides :`;
      }
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        options: [
          { label: 'Trouver le meilleur prix', icon: '💰' },
          { label: 'Optimiser mes coûts', icon: '📉' },
        ]
      }]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: 90, right: 20, width: 56, height: 56,
          borderRadius: 28, background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          color: '#38BDF8', border: '2px solid #334155', boxShadow: '0 8px 25px rgba(15, 23, 42, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 90,
          transition: 'all 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'none'
        }}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 160, right: 12, left: 12, maxWidth: 400,
          height: 460, background: '#0F172A', borderRadius: 24, overflow: 'hidden',
          zIndex: 95, display: 'flex', flexDirection: 'column',
          border: '1px solid #334155', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', background: '#1E293B', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: 'linear-gradient(135deg, #38BDF8, #818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={20} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC' }}>AgriBot IA</h3>
              <p style={{ fontSize: 11, color: '#38BDF8' }}>● En ligne — Assistant Premium</p>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: '#94A3B8', background: 'none', border: 'none', padding: 4 }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '12px 16px', borderRadius: 16,
                  background: msg.role === 'user' ? '#38BDF8' : '#1E293B',
                  color: msg.role === 'user' ? '#0F172A' : '#F8FAFC',
                  fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line',
                  borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                  borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 16,
                }}>
                  {msg.content}
                  {msg.options && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                      {msg.options.map((opt, j) => (
                        <button key={j} onClick={() => handleOptionClick(opt.label)}
                          style={{ padding: '8px 12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 20, color: '#38BDF8', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          {opt.icon} {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: '#1E293B', borderRadius: 12, width: 'fit-content' }}>
                <div className="typing-dot" style={{ animationDelay: '0s' }} />
                <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid #334155', display: 'flex', gap: 8, background: '#1E293B' }}>
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Demandez à l'IA..."
              style={{ flex: 1, padding: '10px 14px', background: '#0F172A', border: '1px solid #475569', borderRadius: 12, color: '#F8FAFC', fontSize: 13, outline: 'none' }}
            />
            <button type="submit" style={{ width: 40, height: 40, borderRadius: 12, background: '#38BDF8', border: 'none', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .typing-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #38BDF8;
          animation: typingBounce 1.4s infinite ease-in-out;
        }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </>
  );
}
