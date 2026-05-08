'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/data/mock-products';
import { categories } from '@/data/mock-categories';
import { Search, Bell, Menu, Heart, MapPin, ShoppingCart, X, ChevronRight, Gavel } from 'lucide-react';
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
    </div>
  );
}
