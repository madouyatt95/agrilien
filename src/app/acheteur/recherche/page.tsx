'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { products } from '@/data/mock-products';
import { categories } from '@/data/mock-categories';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, Search, Heart, MapPin, ShoppingCart, ChevronDown, ChevronUp, X, Leaf, Truck, Star, Calendar, Navigation } from 'lucide-react';
import { formatPrice, getCurrentLocation } from '@/lib/utils';
import { useGalsenRegions } from '@/hooks/useGalsenAPI';
import LocationAutocomplete from '@/components/ui/LocationAutocomplete';

function RechercheContent() {
  const router = useRouter();
  const { regionNames } = useGalsenRegions();
  const regions = ['Toutes', ...regionNames];
  const searchParams = useSearchParams();
  const { favorites, toggleFavorite, addToCart, cartItemCount } = useAuth();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || '');
  const [selectedRegion, setSelectedRegion] = useState('Toutes');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [showOrganicOnly, setShowOrganicOnly] = useState(false);
  const [showFreeDelivery, setShowFreeDelivery] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [showPromoOnly, setShowPromoOnly] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...products];
    if (query) result = result.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.producerName.toLowerCase().includes(query.toLowerCase()));
    if (selectedCategory) {
      const cat = categories.find(c => c.id === selectedCategory);
      if (cat) result = result.filter(p => p.category === cat.name);
    }
    if (selectedRegion !== 'Toutes') result = result.filter(p => p.region === selectedRegion);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (showAvailableOnly) result = result.filter(p => p.isAvailable);
    if (showOrganicOnly) result = result.filter(p => p.isOrganic);
    if (showFreeDelivery) result = result.filter(p => p.freeDelivery);
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);
    if (showPromoOnly) result = result.filter(p => p.discount && p.discount > 0);
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'popular') result.sort((a, b) => b.views - a.views);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'promo') result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    return result;
  }, [query, selectedCategory, selectedRegion, priceRange, showAvailableOnly, showOrganicOnly, showFreeDelivery, minRating, showPromoOnly, sortBy]);

  const activeFiltersCount = [selectedCategory, selectedRegion !== 'Toutes', priceRange[0] > 0 || priceRange[1] < 10000, showOrganicOnly, showFreeDelivery, minRating > 0, showPromoOnly].filter(Boolean).length;

  const resetFilters = () => {
    setSelectedCategory(''); setSelectedRegion('Toutes');
    setPriceRange([0, 10000]); setShowAvailableOnly(true);
    setShowOrganicOnly(false); setShowFreeDelivery(false);
    setMinRating(0); setShowPromoOnly(false); setSortBy('');
  };

  const handleLocateMe = async () => {
    try {
      const city = await getCurrentLocation();
      alert(`📍 Vrai GPS détecté : ${city}. Le filtre a été appliqué.`);
      setSelectedRegion(city); // Fallback: custom text if not in regions list, but UI will show it!
    } catch (error: any) {
      alert(`Impossible d'obtenir la position GPS: ${error.message}`);
    }
  };

  const toggleFilter = (id: string) => setExpandedFilter(expandedFilter === id ? null : id);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: 'var(--surface)', padding: '14px 20px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button onClick={() => router.back()} style={{ color: 'var(--text)' }}><ChevronLeft size={24} /></button>
          <h1 style={{ fontSize: 18, fontWeight: 700, flex: 1 }}>Recherche</h1>
          <button onClick={() => router.push('/acheteur/panier')} style={{ position: 'relative', color: 'var(--text)' }}>
            <ShoppingCart size={22} />
            {cartItemCount > 0 && <span style={{ position: 'absolute', top: -4, right: -6, background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 700, minWidth: 16, height: 16, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{cartItemCount}</span>}
          </button>
        </div>
        <div className="search-bar">
          <Search size={20} color="#9CA3AF" />
          <input placeholder="Rechercher un produit..." value={query} onChange={e => setQuery(e.target.value)} />
          {query && <button onClick={() => setQuery('')}><X size={16} color="#9CA3AF" /></button>}
        </div>
      </div>

      {/* Quick filter pills */}
      <div style={{ padding: '12px 20px 0', display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setShowOrganicOnly(!showOrganicOnly)} className={`filter-pill ${showOrganicOnly ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Leaf size={13} /> Bio
        </button>
        <button onClick={() => setShowFreeDelivery(!showFreeDelivery)} className={`filter-pill ${showFreeDelivery ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Truck size={13} /> Livraison gratuite
        </button>
        <button onClick={() => setMinRating(minRating >= 4 ? 0 : 4)} className={`filter-pill ${minRating >= 4 ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Star size={13} /> 4★+
        </button>
        <button onClick={() => setShowPromoOnly(!showPromoOnly)} className={`filter-pill ${showPromoOnly ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          🔥 Promo
        </button>
      </div>

      {/* Expandable Filters */}
      <div style={{ background: 'var(--surface)', marginTop: 12, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px 8px' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Filtres {activeFiltersCount > 0 && <span style={{ fontSize: 12, background: 'var(--primary)', color: '#fff', padding: '1px 7px', borderRadius: 8, marginLeft: 6 }}>{activeFiltersCount}</span>}</span>
          <button onClick={resetFilters} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>Réinitialiser</button>
        </div>

        {/* Catégorie */}
        <button onClick={() => toggleFilter('cat')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', width: '100%', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Catégorie</span>
          <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Toutes'}
            {expandedFilter === 'cat' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
        {expandedFilter === 'cat' && (
          <div style={{ padding: '8px 20px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button onClick={() => setSelectedCategory('')} className={`filter-pill ${!selectedCategory ? 'active' : ''}`}>Toutes</button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`filter-pill ${selectedCategory === c.id ? 'active' : ''}`}>{c.name}</button>
            ))}
          </div>
        )}

        {/* Localisation */}
        <button onClick={() => toggleFilter('loc')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', width: '100%', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Localisation</span>
          <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            {selectedRegion === 'Toutes' ? 'Toutes' : selectedRegion}
            {expandedFilter === 'loc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
        {expandedFilter === 'loc' && (
          <div style={{ padding: '8px 20px 12px' }}>
            <LocationAutocomplete
              value={selectedRegion === 'Toutes' ? '' : selectedRegion}
              onChange={(v, suggestion) => {
                if (v) {
                  setSelectedRegion(suggestion?.type === 'region' ? v : suggestion?.region || v);
                } else {
                  setSelectedRegion('Toutes');
                }
              }}
              placeholder="Rechercher une localité..."
              showGPS={true}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {regions.slice(0, 8).map(r => (
                <button key={r} onClick={() => setSelectedRegion(r)} className={`filter-pill ${selectedRegion === r ? 'active' : ''}`}>{r}</button>
              ))}
            </div>
          </div>
        )}

        {/* Prix */}
        <button onClick={() => toggleFilter('prix')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', width: '100%', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Prix</span>
          <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            {priceRange[0] === 0 && priceRange[1] === 10000 ? 'Tous' : `${priceRange[0]}-${priceRange[1]}`}
            {expandedFilter === 'prix' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
        {expandedFilter === 'prix' && (
          <div style={{ padding: '8px 20px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[['Tous', 0, 10000], ['< 500', 0, 500], ['500-1000', 500, 1000], ['1000-3000', 1000, 3000], ['> 3000', 3000, 10000]].map(([label, min, max]) => (
              <button key={label as string} onClick={() => setPriceRange([min as number, max as number])} className={`filter-pill ${priceRange[0] === min && priceRange[1] === max ? 'active' : ''}`}>{label as string}</button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{filtered.length} produit{filtered.length > 1 ? 's' : ''}</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, background: 'var(--surface)' }}>
            <option value="">Trier par</option>
            <option value="price-asc">Prix ↑</option>
            <option value="price-desc">Prix ↓</option>
            <option value="popular">Popularité</option>
            <option value="rating">Meilleure note</option>
            <option value="promo">Promotions</option>
          </select>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Aucun produit trouvé</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Essayez de modifier vos filtres</p>
            <button className="btn btn-primary btn-sm" onClick={resetFilters}>Réinitialiser</button>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(product => (
              <div key={product.id} className="product-card" onClick={() => router.push(`/acheteur/produit/${product.id}`)} style={{ cursor: 'pointer' }}>
                <div className="product-card-image">
                  <img src={product.images[0]} alt={product.name} />
                  {product.discount && <span style={{ position: 'absolute', top: 8, left: 8, background: '#EF4444', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>-{product.discount}%</span>}
                  {product.isPreorder && <span style={{ position: 'absolute', top: 8, left: product.discount ? 50 : 8, background: '#8B5CF6', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> Pré-commande</span>}
                  {product.isOrganic && <span style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(255,255,255,0.95)', color: '#0B6B32', padding: '2px 6px', borderRadius: 6, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}><Leaf size={10} /> Bio</span>}
                  <button className="product-card-fav" onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }}>
                    <Heart size={14} fill={favorites.includes(product.id) ? '#EF4444' : 'none'} color={favorites.includes(product.id) ? '#EF4444' : '#6B7280'} />
                  </button>
                </div>
                <div className="product-card-body">
                  <p className="product-card-name">{product.name}</p>
                  <p className="product-card-location"><MapPin size={11} /> {product.city}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <p className="product-card-price">{formatPrice(product.price)}</p>
                    {product.originalPrice && <span style={{ fontSize: 11, color: 'var(--text-light)', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="product-card-badge" style={{ background: product.isPreorder ? '#F3E8FF' : product.isLowStock ? '#FEF2F2' : '#F0FDF4', color: product.isPreorder ? '#7C3AED' : product.isLowStock ? '#EF4444' : '#22C55E' }}>
                      {product.isPreorder ? 'Gros volume' : product.isLowStock ? 'Stock limité' : 'Disponible'}
                    </span>
                    <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 2, color: '#FBBF24' }}><Star size={11} fill="#FBBF24" /> {product.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecherchePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div>}>
      <RechercheContent />
    </Suspense>
  );
}
