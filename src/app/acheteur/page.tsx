'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/data/mock-products';
import { categories } from '@/data/mock-categories';
import { Search, Bell, Menu, Heart, MapPin, ShoppingCart, X, ChevronRight, Gavel, Camera } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import AgriLienLogo from '@/components/ui/Logo';
import styles from './acheteur.module.css';

export default function AcheteurHomePage() {
  const { user, favorites, toggleFavorite, addToCart, cartItemCount } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [heroProducts, setHeroProducts] = useState<typeof products>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [showPhotoScanner, setShowPhotoScanner] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const mockStories = [
    { id: 1, producer: 'Amadou Ba', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=900&fit=crop', caption: 'Récolte des mangues Kent ce matin 🥭', time: 'Il y a 2h', hasNew: true },
    { id: 2, producer: 'Mariama Sow', photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop', image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&h=900&fit=crop', caption: 'Nos poules pondeuses en pleine forme 🐔', time: 'Il y a 4h', hasNew: true },
    { id: 3, producer: 'Ousmane Diallo', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=900&fit=crop', caption: 'Le riz est bientôt prêt pour la récolte 🌾', time: 'Il y a 6h', hasNew: false },
    { id: 4, producer: 'Alpha Ndiaye', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&h=900&fit=crop', caption: 'Chargement des oignons pour Dakar 🧅🚛', time: 'Il y a 8h', hasNew: false },
  ];

  // Story auto-progress — WhatsApp-style auto-advance
  useEffect(() => {
    if (activeStory === null) return;
    setStoryProgress(0);
    const interval = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          // Auto-advance to the next story, or close if last
          const nextIndex = activeStory + 1;
          if (nextIndex < mockStories.length) {
            setActiveStory(nextIndex);
          } else {
            setActiveStory(null);
          }
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [activeStory]);

  // Photo scanner simulation
  const handlePhotoScan = () => {
    setShowPhotoScanner(true);
    setScanComplete(false);
    setTimeout(() => {
      setScanComplete(true);
      setTimeout(() => {
        setShowPhotoScanner(false);
        setScanComplete(false);
        router.push('/acheteur/recherche?q=tomates');
      }, 1200);
    }, 2500);
  };

  useEffect(() => {
    const freshProducts = products.filter(p => p.category === 'Fruits & Légumes' && p.isAvailable);
    if (freshProducts.length > 0) {
      const shuffled = [...freshProducts].sort(() => 0.5 - Math.random());
      setHeroProducts(shuffled.slice(0, 3));
    }
  }, []);

  const featuredProducts = products.filter(p => p.isAvailable).slice(0, 4);
  const recommendedProducts = products.filter(p => p.isAvailable).slice(0, 6);

  // Autocomplétion
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const matchedProducts = products
      .filter(p => p.name.toLowerCase().includes(q) || p.producerName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 5)
      .map(p => ({ type: 'product' as const, id: p.id, label: p.name, sub: `${formatPrice(p.price)} / ${p.unit} — ${p.city}`, image: p.images[0] }));
    const matchedCats = categories
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(c => ({ type: 'category' as const, id: c.id, label: c.name, sub: `${c.productCount} produits`, image: c.icon }));
    return [...matchedCats, ...matchedProducts];
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      router.push(`/acheteur/recherche?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (s: typeof suggestions[0]) => {
    setShowSuggestions(false);
    setSearchQuery('');
    if (s.type === 'product') router.push(`/acheteur/produit/${s.id}`);
    else router.push(`/acheteur/recherche?cat=${s.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className={styles.home}>
      {/* ═══ DRAWER CATÉGORIES ═══ */}
      {drawerOpen && <div className={styles.drawerOverlay} onClick={() => setDrawerOpen(false)} />}
      <div className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <h2>Catégories</h2>
          <button onClick={() => setDrawerOpen(false)}><X size={24} /></button>
        </div>
        <div className={styles.drawerList}>
          <button
            className={`${styles.drawerItem} ${styles.drawerItemActive}`}
            onClick={() => { setDrawerOpen(false); router.push('/acheteur/recherche'); }}
          >
            <span>Tous</span>
            <div className={styles.drawerItemBar} />
          </button>
          <button
            className={styles.drawerItem}
            onClick={() => { setDrawerOpen(false); router.push('/acheteur/agent-ia'); }}
            style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#0284C7', fontWeight: 700 }}
          >
            <div className={styles.drawerItemContent}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <span>Sourcing IA (Premium)</span>
            </div>
            <ChevronRight size={18} color="#0284C7" />
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={styles.drawerItem}
              onClick={() => { setDrawerOpen(false); router.push(`/acheteur/recherche?cat=${cat.id}`); }}
            >
              <div className={styles.drawerItemContent}>
                <img src={cat.icon} alt={cat.name} className={styles.drawerItemImg} />
                <span>{cat.name}</span>
              </div>
              <ChevronRight size={18} color="#9CA3AF" />
            </button>
          ))}
        </div>
      </div>

      {/* ═══ HEADER avec vrai logo ═══ */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuBtn} onClick={() => setDrawerOpen(true)}><Menu size={22} /></button>
          <AgriLienLogo size="sm" />
        </div>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn} onClick={() => router.push('/acheteur/panier')} style={{ position: 'relative' }}>
            <ShoppingCart size={22} />
            {cartItemCount > 0 && <span className={styles.badge}>{cartItemCount}</span>}
          </button>
          <button className={styles.iconBtn} onClick={() => router.push('/acheteur/notifications')} style={{ position: 'relative' }}>
            <Bell size={22} />
            <span className={styles.badge}>3</span>
          </button>
        </div>
      </div>

      {/* ═══ STORIES BAR ═══ */}
      <div style={{ padding: '12px 0 8px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '0 20px', scrollbarWidth: 'none' }}>
          {mockStories.map((story, i) => (
            <button key={story.id} onClick={() => setActiveStory(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <div style={{ width: 62, height: 62, borderRadius: '50%', padding: 2, background: story.hasNew ? 'linear-gradient(135deg, #16A34A, #22D3EE)' : '#D1D5DB' }}>
                <img src={story.photo} alt={story.producer} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{story.producer.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ GREETING ═══ */}
      <div className={styles.greeting}>
        <h1>Bonjour, {user?.firstName || 'Fatou'} 👋</h1>
        <p>Que cherchez-vous aujourd&apos;hui ?</p>
      </div>

      {/* ═══ SEARCH avec autocomplétion ═══ */}
      <form onSubmit={handleSearch} className={styles.searchWrap}>
        <div className="search-bar" ref={searchRef} style={{ position: 'relative' }}>
          <Search size={20} color="#9CA3AF" />
          <input
            placeholder="Rechercher un produit, une exploitation..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <button type="button" onClick={handlePhotoScan} style={{ padding: 4, display: 'flex', alignItems: 'center' }} title="Recherche par photo">
            <Camera size={18} color="#16A34A" />
          </button>
          {searchQuery && (
            <button type="button" onClick={() => { setSearchQuery(''); setShowSuggestions(false); }} style={{ padding: 4 }}>
              <X size={16} color="#9CA3AF" />
            </button>
          )}
          <button type="submit" className={styles.searchSubmit}><Search size={18} color="#fff" /></button>
        </div>
        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestionsDropdown}>
            {suggestions.map((s, i) => (
              <button key={i} className={styles.suggestionItem} onMouseDown={() => handleSuggestionClick(s)}>
                <img src={s.image} alt="" className={styles.suggestionImg} />
                <div className={styles.suggestionText}>
                  <span className={styles.suggestionLabel}>{s.label}</span>
                  <span className={styles.suggestionSub}>{s.sub}</span>
                </div>
                <span className={styles.suggestionType}>{s.type === 'category' ? 'Catégorie' : 'Produit'}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* ═══ VENTES FLASH (PANIC BUTTON ANTI-GASPI) ═══ */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', borderRadius: 16, padding: '16px 20px', color: '#fff', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>⚡</span> Ventes Flash Anti-Gaspi
            </h2>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              ⏱️ 01:45:22
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
            {/* Simulation d'un produit en vente flash */}
            <div onClick={() => router.push(`/acheteur/produit/prod-3`)} style={{ minWidth: 160, background: '#fff', borderRadius: 12, overflow: 'hidden', color: '#000', cursor: 'pointer', flexShrink: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: '#EF4444', color: '#fff', fontSize: 12, fontWeight: 800, padding: '4px 8px', borderBottomLeftRadius: 12, zIndex: 2 }}>
                -70%
              </div>
              <div style={{ height: 110, position: 'relative' }}>
                <img src="https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=300&h=300&fit=crop" alt="Mangues Kent" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Mangues Kent mûres</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#EF4444' }}>300F</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF', textDecoration: 'line-through' }}>1000F</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ HERO SLIDER — dynamique (Un seul encadré) ═══ */}
      <div className={styles.heroCard} style={{ padding: 0, display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {heroProducts.length > 0 ? heroProducts.map((hp, i) => (
          <div key={hp.id} onClick={() => router.push(`/acheteur/produit/${hp.id}`)} style={{ scrollSnapAlign: 'start', minWidth: '100%', height: '100%', position: 'relative', flexShrink: 0 }}>
            <img
              src={hp.images[0]}
              alt={hp.name}
              className={styles.heroImg}
            />
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <h2>{hp.name}</h2>
                  <p>Par {hp.farmName}</p>
                </div>
                <div style={{ background: 'var(--primary)', padding: '6px 12px', borderRadius: 20, color: '#fff', fontWeight: 700, fontSize: 13, alignSelf: 'center' }}>
                  {formatPrice(hp.price)}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1 }}>
                <button className={styles.heroBtn}>Découvrir</button>
                <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
                  {heroProducts.map((_, dotIdx) => (
                    <div key={dotIdx} style={{ width: 6, height: 6, borderRadius: '50%', background: i === dotIdx ? '#fff' : 'rgba(255,255,255,0.4)' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div onClick={() => router.push('/acheteur/recherche')} style={{ scrollSnapAlign: 'start', minWidth: '100%', height: '100%', position: 'relative', flexShrink: 0 }}>
            <img
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=300&fit=crop"
              alt="Produits frais"
              className={styles.heroImg}
            />
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <h2>Produits frais</h2>
              <p>direct de nos producteurs locaux</p>
              <button className={styles.heroBtn}>Découvrir</button>
            </div>
          </div>
        )}
      </div>

      {/* B2B BANNER — visible uniquement pour les Acheteurs Pro */}
      {user?.role === 'acheteur_pro' && (
        <div onClick={() => router.push('/acheteur/appels-offres')} style={{ margin: '0 20px 16px', background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)', borderRadius: 14, padding: '16px 20px', color: '#fff', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Gavel size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>Appels d'Offres B2B</p>
            <p style={{ fontSize: 12, opacity: 0.9 }}>Publiez vos besoins en gros volume</p>
          </div>
          <ChevronRight size={20} />
        </div>
      )}

      {/* ═══ CATÉGORIES POPULAIRES avec images ═══ */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Catégories populaires</h3>
          <button className={styles.seeAll} onClick={() => router.push('/acheteur/categories')}>Voir tout</button>
        </div>
        <div className={styles.categoriesScroll}>
          {categories.slice(0, 6).map(cat => (
            <button key={cat.id} className={styles.categoryCard} onClick={() => router.push(`/acheteur/recherche?cat=${cat.id}`)}>
              <div className={styles.categoryImgWrap}>
                <img src={cat.icon} alt={cat.name} className={styles.categoryImg} />
              </div>
              <span className={styles.categoryLabel}>{cat.name.split(' & ')[0]}{cat.name.includes('&') ? ` & ${cat.name.split('& ')[1]?.split(' ')[0] || ''}` : ''}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ 🔥 OFFRES DU JOUR — promotions réelles ═══ */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>🔥 Offres du jour</h3>
          <button className={styles.seeAll} onClick={() => router.push('/acheteur/recherche')}>Voir tout</button>
        </div>
        <div className={styles.offersScroll}>
          {products.filter(p => p.discount && p.discount > 0).map(product => (
            <div key={product.id} className={styles.offerCard} onClick={() => router.push(`/acheteur/produit/${product.id}`)}>
              <div className={styles.offerImage}>
                <img src={product.images[0]} alt={product.name} />
                <span className={styles.discountBadge}>-{product.discount}%</span>
                <button className={styles.favBtn} onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }}>
                  <Heart size={14} fill={favorites.includes(product.id) ? '#EF4444' : 'none'} color={favorites.includes(product.id) ? '#EF4444' : '#6B7280'} />
                </button>
              </div>
              <div className={styles.offerBody}>
                <p className={styles.offerName}>{product.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p className={styles.offerPrice}>{formatPrice(product.price)}</p>
                  {product.originalPrice && <span style={{ fontSize: 11, color: 'var(--text-light)', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>}
                </div>
                <p className={styles.offerLoc}><MapPin size={11} /> {product.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ MEILLEURES VENTES ═══ */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Meilleures ventes</h3>
          <button className={styles.seeAll} onClick={() => router.push('/acheteur/recherche')}>Voir tout</button>
        </div>
        <div className={styles.offersScroll}>
          {featuredProducts.map(product => (
            <div key={product.id} className={styles.offerCard} onClick={() => router.push(`/acheteur/produit/${product.id}`)}>
              <div className={styles.offerImage}>
                <img src={product.images[0]} alt={product.name} />
                {product.isOrganic && <span style={{ position: 'absolute', top: 8, left: 8, background: '#22C55E', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>Bio</span>}
                <button className={styles.favBtn} onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }}>
                  <Heart size={14} fill={favorites.includes(product.id) ? '#EF4444' : 'none'} color={favorites.includes(product.id) ? '#EF4444' : '#6B7280'} />
                </button>
              </div>
              <div className={styles.offerBody}>
                <p className={styles.offerName}>{product.name}</p>
                <p className={styles.offerPrice}>{formatPrice(product.price)} / {product.unit}</p>
                <p className={styles.offerLoc}><MapPin size={11} /> {product.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ PRODUITS RECOMMANDÉS ═══ */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Produits recommandés</h3>
          <button className={styles.seeAll} onClick={() => router.push('/acheteur/recherche')}>Voir tout</button>
        </div>
        <div className={styles.productGrid}>
          {recommendedProducts.map(product => (
            <div key={product.id} className={styles.productCard} onClick={() => router.push(`/acheteur/produit/${product.id}`)}>
              <div className={styles.productCardImg}>
                <img src={product.images[0]} alt={product.name} />
                <button className={styles.favBtn} onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }}>
                  <Heart size={14} fill={favorites.includes(product.id) ? '#EF4444' : 'none'} color={favorites.includes(product.id) ? '#EF4444' : '#6B7280'} />
                </button>
              </div>
              <div className={styles.productCardBody}>
                <p className={styles.productName}>{product.name}</p>
                <p className={styles.productLoc}><MapPin size={11} /> {product.city}, Sénégal</p>
                <p className={styles.productPrice}>{formatPrice(product.price)} / {product.unit}</p>
                <div className={styles.productBottom}>
                  <span className={styles.productBadge} data-status={product.isLowStock ? 'low' : 'ok'}>
                    {product.isLowStock ? 'Stock limité' : 'Disponible'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SUPPORT BANNER ═══ */}
      <div className={styles.supportBanner}>
        <span>🌱</span>
        <p>Soutenez nos producteurs locaux ! Chaque achat soutient l&apos;agriculture sénégalaise.</p>
      </div>

      {/* ═══ STORY VIEWER FULLSCREEN ═══ */}
      {activeStory !== null && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 500, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', display: 'flex', gap: 4 }}>
            {mockStories.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: '#fff', width: i < activeStory ? '100%' : i === activeStory ? `${storyProgress}%` : '0%', transition: 'width 0.1s linear' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px' }}>
            <img src={mockStories[activeStory].photo} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
            <div>
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{mockStories[activeStory].producer}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{mockStories[activeStory].time}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setActiveStory(null); }} style={{ marginLeft: 'auto', color: '#fff', background: 'none', border: 'none', padding: 8 }}>
              <X size={24} />
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
            <img src={mockStories[activeStory].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {/* Tap zones: left = prev, right = next */}
            <div onClick={() => { if (activeStory > 0) { setActiveStory(activeStory - 1); setStoryProgress(0); } }} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '35%', cursor: 'pointer' }} />
            <div onClick={() => { if (activeStory < mockStories.length - 1) { setActiveStory(activeStory + 1); setStoryProgress(0); } else { setActiveStory(null); } }} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%', cursor: 'pointer' }} />
          </div>
          <div style={{ padding: '16px 20px 40px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>{mockStories[activeStory].caption}</p>
          </div>
        </div>
      )}

      {/* ═══ PHOTO SCANNER OVERLAY ═══ */}
      {showPhotoScanner && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => { setShowPhotoScanner(false); setScanComplete(false); }} style={{ position: 'absolute', top: 20, right: 20, color: '#fff', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <X size={24} />
          </button>
          <div style={{ position: 'relative', width: 250, height: 250, borderRadius: 24, overflow: 'hidden', border: '3px solid rgba(22, 163, 74, 0.6)' }}>
            <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=300&fit=crop" alt="scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            {!scanComplete && <div className="scan-laser" />}
            {scanComplete && <div style={{ position: 'absolute', inset: 0, background: 'rgba(22, 163, 74, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 48 }}>✅</span></div>}
          </div>
          <p style={{ color: '#fff', marginTop: 24, fontSize: 16, fontWeight: 700 }}>{scanComplete ? 'Tomates détectées !' : 'Analyse en cours...'}</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>{scanComplete ? 'Redirection vers les résultats...' : 'Pointez l\'appareil vers le produit'}</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .scan-laser {
          position: absolute;
          left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #16A34A, transparent);
          animation: scanMove 1.5s ease-in-out infinite;
          box-shadow: 0 0 15px #16A34A;
        }
        @keyframes scanMove {
          0% { top: 0; }
          50% { top: calc(100% - 3px); }
          100% { top: 0; }
        }
      `}} />
    </div>
  );
}
