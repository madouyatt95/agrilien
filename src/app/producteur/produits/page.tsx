'use client';

import { useState } from 'react';
import { products } from '@/data/mock-products';
import { formatPrice, getStatusLabel, getStatusColor, getStatusBgColor } from '@/lib/utils';
import { Plus, Minus, Edit2, AlertCircle, Zap, Check, Mic } from 'lucide-react';
import { categories as globalCategories } from '@/data/mock-categories';
import { productCatalog, catalogCategories } from '@/data/product-catalog';
import { Product } from '@/types';

export default function MesProduitsPage() {
  const [tab, setTab] = useState('tous');
  const myProducts = products.filter(p => p.producerId === 'producer-1');
  const tabs = [
    { id: 'tous', label: `Tous (${myProducts.length})` },
    { id: 'en_vente', label: `En vente (${myProducts.filter(p => p.status === 'en_vente').length})` },
    { id: 'en_rupture', label: `En rupture (${myProducts.filter(p => p.status === 'en_rupture').length})` },
    { id: 'inventaire', label: 'Inventaire' },
  ];
  
  const [localProducts, setLocalProducts] = useState<Product[]>(myProducts);
  const filtered = tab === 'tous' || tab === 'inventaire' ? localProducts : localProducts.filter(p => p.status === tab);

  const handleStockChange = (id: string, newStock: number) => {
    setLocalProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, newStock), status: newStock === 0 ? 'en_rupture' : 'en_vente' } : p));
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    setLocalProducts(prev => prev.map(p => p.id === id ? { ...p, price: Math.max(0, newPrice) } : p));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleSaveInventory = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('✅ Inventaire sauvegardé avec succès !');
    }, 800);
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [showFlashModal, setShowFlashModal] = useState<Product | null>(null);
  const [flashModalData, setFlashModalData] = useState({ promoPrice: '', quantity: '' });
  const [flashSaleProduct, setFlashSaleProduct] = useState<{name: string, discount: number} | null>(null);

  const openFlashModal = (product: Product) => {
    setShowFlashModal(product);
    setFlashModalData({ 
      promoPrice: Math.round(product.price * 0.5).toString(), 
      quantity: product.stock.toString() 
    });
  };

  const submitFlashSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFlashModal) return;
    
    const originalPrice = showFlashModal.price;
    const promo = parseInt(flashModalData.promoPrice) || originalPrice;
    const discount = Math.round((1 - (promo / originalPrice)) * 100);
    
    setFlashSaleProduct({ name: showFlashModal.name, discount });
    setShowFlashModal(null);
    
    setTimeout(() => {
      setFlashSaleProduct(null);
    }, 4000);
  };

  const [formData, setFormData] = useState({
    name: '',
    categoryId: globalCategories[0].id,
    customCategory: '',
    description: '',
    price: '',
    unit: 'Kg',
    customUnit: '',
    stock: '',
    quality: 'Standard',
  });

  const handleVoiceCommand = () => {
    setIsListening(true);
    // Simuler la dictée et le remplissage
    setTimeout(() => {
      setFormData({
        ...formData,
        name: 'Oignons Galmi de qualité',
        price: '350',
        stock: '500',
        description: 'Récolte fraîche d\'oignons Galmi bien secs et de bonne taille. Prêts pour le groupage.',
        categoryId: globalCategories.find(c => c.name.includes('Légumes'))?.id || globalCategories[0].id,
      });
      setIsListening(false);
      showToast('✅ Saisie vocale terminée et reconnue !');
    }, 3000);
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      showToast('⚠️ Veuillez remplir les champs obligatoires (Nom, Prix, Stock).');
      return;
    }
    const finalCategoryName = formData.categoryId === 'autre' ? formData.customCategory : (globalCategories.find(c => c.id === formData.categoryId)?.name || '');
    const finalUnit = formData.unit === 'Autre' ? formData.customUnit : formData.unit;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: formData.name + (formData.quality === 'Bio' ? ' (Bio)' : ''),
      producerId: 'producer-1',
      producerName: 'Amadou Ba',
      region: 'Kolda',
      farmName: 'Ferme Ba',
      city: 'Kolda',
      price: Number(formData.price),
      currency: 'FCFA',
      unit: finalUnit,
      rating: 0,
      reviewCount: 0,
      views: 0,
      images: ['https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500&auto=format&fit=crop'],
      category: finalCategoryName,
      description: formData.description || 'Description non fournie.',
      stock: Number(formData.stock),
      isAvailable: true,
      isLowStock: false,
      isOrganic: formData.quality === 'Bio',
      delivery: true,
      freeDelivery: false,
      createdAt: new Date().toISOString(),
      status: 'en_vente'
    };

    setLocalProducts([newProduct, ...localProducts]);
    showToast('✅ Produit ajouté avec succès !');
    setShowAddForm(false);
    // Reset form
    setFormData({
      name: '', categoryId: globalCategories[0].id, customCategory: '',
      description: '', price: '', unit: 'Kg', customUnit: '', stock: '', quality: 'Standard'
    });
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {showAddForm ? (
        <div>
          <div className="page-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center' }}>
            <button onClick={() => setShowAddForm(false)} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', background: 'transparent', border: 'none' }}>
              <span style={{ fontSize: 24 }}>←</span>
            </button>
            <h1 style={{ flex: 1, fontSize: 18, margin: 0 }}>Nouveau produit</h1>
            
            {/* BOUTON MICROPHONE */}
            <button 
              onClick={handleVoiceCommand}
              className={isListening ? "pulse-animation" : ""}
              style={{ 
                width: 44, height: 44, borderRadius: 22, 
                background: isListening ? '#EF4444' : 'var(--primary-light)', 
                color: isListening ? '#fff' : 'var(--primary)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', transition: 'all 0.3s ease'
              }}
            >
              <Mic size={20} />
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            {isListening && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 12, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, color: '#EF4444', fontSize: 13, fontWeight: 600 }}>
                <span className="pulse-dot" style={{ width: 10, height: 10, background: '#EF4444', borderRadius: 5 }}></span>
                Écoute en cours... Parlez maintenant. (Simulation)
              </div>
            )}

            <div className="card" style={{ padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Informations générales</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Nom du produit <span style={{color: '#EF4444'}}>*</span></label>
                <select value={formData.name} onChange={e => {
                  const cat = productCatalog.find(p => p.name === e.target.value);
                  setFormData({...formData, name: e.target.value, unit: cat?.unit || 'Kg', categoryId: globalCategories.find(c => c.name === cat?.category)?.id || globalCategories[0].id });
                }} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff' }}>
                  <option value="">Sélectionnez un produit...</option>
                  {catalogCategories.map(cat => (
                    <optgroup key={cat} label={cat}>
                      {productCatalog.filter(p => p.category === cat).map(p => (
                        <option key={p.name} value={p.name}>{p.name} ({p.unit})</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <button type="button" onClick={() => showToast('📩 Demande envoyée à l\'admin pour ajouter un nouveau produit')} style={{ marginTop: 8, fontSize: 12, color: '#3B82F6', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>+ Suggérer un nouveau produit</button>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Catégorie</label>
                <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff' }}>
                  {globalCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  <option value="autre">Autre (Demander à l'admin)</option>
                </select>
                {formData.categoryId === 'autre' && (
                  <div style={{ marginTop: 8, padding: 12, background: '#EFF6FF', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                    <p style={{ fontSize: 12, color: '#1E3A8A', marginBottom: 8, display: 'flex', gap: 6, alignItems: 'center' }}><AlertCircle size={14} /> La nouvelle catégorie devra être validée par un administrateur.</p>
                    <input value={formData.customCategory} onChange={e => setFormData({...formData, customCategory: e.target.value})} placeholder="Nom de la nouvelle catégorie" style={{ width: '100%', padding: '10px 14px', border: '1px solid #93C5FD', borderRadius: 6, fontSize: 13, outline: 'none' }} />
                  </div>
                )}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Label de Qualité</label>
                <select value={formData.quality} onChange={e => setFormData({...formData, quality: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff' }}>
                  <option value="Standard">Standard</option>
                  <option value="Bio">Certifié Bio</option>
                  <option value="Premium/Export">Qualité Premium / Export</option>
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Décrivez votre produit..." style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical' }} />
              </div>
            </div>

            <div className="card" style={{ padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Prix et Stock</h3>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Prix (FCFA) <span style={{color: '#EF4444'}}>*</span></label>
                  <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} type="number" placeholder="0" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none' }} />
                </div>
                <div style={{ width: 140 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Unité de vente</label>
                  <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option value="Kg">Kg</option>
                    <option value="Tonne">Tonne</option>
                    <option value="Litre">Litre</option>
                    <option value="Sac (50kg)">Sac (50kg)</option>
                    <option value="Sac (25kg)">Sac (25kg)</option>
                    <option value="Carton">Carton</option>
                    <option value="Cagette">Cagette</option>
                    <option value="Unité">Unité (Pièce)</option>
                    <option value="Autre">Autre...</option>
                  </select>
                </div>
              </div>
              {formData.unit === 'Autre' && (
                <div style={{ marginBottom: 16, padding: 12, background: '#EFF6FF', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                  <p style={{ fontSize: 12, color: '#1E3A8A', marginBottom: 8, display: 'flex', gap: 6, alignItems: 'center' }}><AlertCircle size={14} /> La nouvelle unité devra être validée.</p>
                  <input value={formData.customUnit} onChange={e => setFormData({...formData, customUnit: e.target.value})} placeholder="Précisez l'unité (ex: Botte, Casier...)" style={{ width: '100%', padding: '10px 14px', border: '1px solid #93C5FD', borderRadius: 6, fontSize: 13, outline: 'none' }} />
                </div>
              )}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Stock initial disponible <span style={{color: '#EF4444'}}>*</span></label>
                <input value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} type="number" placeholder="0" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none' }} />
              </div>
            </div>

            <div className="card" style={{ padding: 20, marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Photos du produit <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>(4 max)</span></h3>
              <div style={{ width: '100%', padding: '30px', border: '2px dashed var(--primary)', borderRadius: 12, textAlign: 'center', background: 'var(--primary-light)', cursor: 'pointer' }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>📸</span>
                <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>Taper pour ajouter des photos</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>JPG ou PNG • 4 photos maximum</p>
              </div>
            </div>

            <button className="btn btn-primary btn-block" onClick={handleAddProduct}>
              Mettre en vente
            </button>
            <button className="btn btn-outline btn-block" style={{ marginTop: 12 }} onClick={() => setShowAddForm(false)}>
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="page-header">
            <h1 style={{ flex: 1 }}>Mes produits</h1>
            <button onClick={() => setShowAddForm(true)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={20} color="#fff" />
            </button>
          </div>
          <div className="filter-pills" style={{ padding: '12px 20px' }}>
            {tabs.map(t => <button key={t.id} className={`filter-pill ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
          </div>
          <div style={{ padding: '0 20px' }}>
            {tab === 'inventaire' ? (
              // VUE INVENTAIRE - GESTION DU STOCK RAPIDE
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Modifiez rapidement vos prix et stocks.</p>
                  <button onClick={handleSaveInventory} className="btn btn-primary btn-sm" disabled={isSaving} style={{ padding: '8px 16px' }}>
                    {isSaving ? 'Enregistrement...' : <><Check size={16} /> Tout Sauvegarder</>}
                  </button>
                </div>
                
                <div style={{ background: 'var(--surface)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', background: 'var(--bg)', padding: '12px 16px', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ flex: 2 }}>PRODUIT</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>PRIX (FCFA)</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>STOCK</div>
                  </div>
                  
                  {filtered.map(product => (
                    <div key={product.id} style={{ display: 'flex', padding: '12px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                      <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={product.images[0]} alt={product.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                        <div style={{ overflow: 'hidden' }}>
                          <p style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{product.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>/{product.unit}</p>
                        </div>
                      </div>
                      <div style={{ flex: 1, padding: '0 8px' }}>
                        <input 
                          type="number" 
                          value={product.price}
                          onChange={e => handlePriceChange(product.id, parseInt(e.target.value) || 0)}
                          style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, outline: 'none', textAlign: 'center' }} 
                        />
                      </div>
                      <div style={{ flex: 1, padding: '0 8px' }}>
                        <input 
                          type="number" 
                          value={product.stock}
                          onChange={e => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                          style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 13, outline: 'none', textAlign: 'center', background: product.stock === 0 ? '#FEF2F2' : '#fff' }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // VUE NORMALE DES PRODUITS
              filtered.map(product => (
                <div key={product.id} className="card" style={{ display: 'flex', gap: 14, padding: 14, marginBottom: 10 }}>
                  <img src={product.images[0]} alt={product.name} style={{ width: 70, height: 70, borderRadius: 10, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{product.name}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>{formatPrice(product.price)} / {product.unit}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Stock: {product.stock} {product.unit}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', gap: 6 }}>
                    <span className="badge" style={{ background: getStatusBgColor(product.status), color: getStatusColor(product.status), fontSize: 11 }}>
                      {getStatusLabel(product.status)}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); openFlashModal(product); }} 
                        style={{ padding: '6px 10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700 }}
                      >
                        <Zap size={14} fill="#EF4444" />
                      </button>
                      <button style={{ padding: 6, background: 'var(--bg)', borderRadius: 8, color: 'var(--text-secondary)' }}>
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* MODAL DE CONFIGURATION VENTE FLASH */}
          {showFlashModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowFlashModal(null)}>
              <div style={{ background: 'var(--surface)', width: '100%', maxWidth: 400, borderRadius: 24, padding: 24 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ background: '#FEF2F2', width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={20} fill="#EF4444" color="#EF4444" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800 }}>Vente Flash</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{showFlashModal.name}</p>
                  </div>
                </div>
                
                <form onSubmit={submitFlashSale}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      <span>Prix Promotionnel (FCFA)</span>
                      <span style={{ color: '#EF4444' }}>Normal: {showFlashModal.price}F</span>
                    </label>
                    <input 
                      type="number" 
                      required
                      value={flashModalData.promoPrice}
                      onChange={e => setFlashModalData({...flashModalData, promoPrice: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', border: '2px solid #FECACA', borderRadius: 8, fontSize: 16, fontWeight: 700, color: '#EF4444', outline: 'none' }} 
                    />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      <span>Quantité allouée</span>
                      <span>Max: {showFlashModal.stock} {showFlashModal.unit}</span>
                    </label>
                    <input 
                      type="number" 
                      required
                      max={showFlashModal.stock}
                      value={flashModalData.quantity}
                      onChange={e => setFlashModalData({...flashModalData, quantity: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none' }} 
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" onClick={() => setShowFlashModal(null)} className="btn btn-outline" style={{ flex: 1 }}>Annuler</button>
                    <button type="submit" className="btn" style={{ flex: 2, background: '#EF4444', color: '#fff', border: 'none' }}>
                      Lancer l'Alerte
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TOAST DE VENTE FLASH */}
          {flashSaleProduct && (
            <div style={{ position: 'fixed', bottom: 100, left: 20, right: 20, background: '#18181B', color: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ background: '#EF4444', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={16} fill="#fff" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Alerte Anti-Gaspi Activée !</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#A1A1AA', lineHeight: 1.4 }}>
                    Le produit <strong style={{ color: '#fff' }}>{flashSaleProduct.name}</strong> a été mis en Vente Flash (-{flashSaleProduct.discount}%). Il est désormais mis en avant sur la page d'accueil des acheteurs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .pulse-dot {
          animation: blink 1s infinite;
        }
      `}} />

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 100, left: 20, right: 20, background: '#18181B', color: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1000, fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{toast}</div>
      )}
    </div>
  );
}
