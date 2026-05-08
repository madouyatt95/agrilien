'use client';

import { useState } from 'react';
import { products } from '@/data/mock-products';
import { formatPrice, getStatusLabel, getStatusColor, getStatusBgColor } from '@/lib/utils';
import { Plus, Minus, Edit2, AlertCircle } from 'lucide-react';
import { categories as globalCategories } from '@/data/mock-categories';
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

  const [showAddForm, setShowAddForm] = useState(false);
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

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      alert("Veuillez remplir les champs obligatoires (Nom, Prix, Stock).");
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
    alert('Produit ajouté avec succès !');
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg)', zIndex: 100, overflowY: 'auto', paddingBottom: 80 }}>
          <div className="page-header" style={{ position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10 }}>
            <button onClick={() => setShowAddForm(false)}>✕</button>
            <h1>Nouveau produit</h1>
            <div style={{ width: 24 }} />
          </div>
          
          <div style={{ padding: 20 }}>
            <div className="card" style={{ padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Informations générales</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Nom du produit <span style={{color: '#EF4444'}}>*</span></label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="ex: Mangues Kent" style={{ width: '100%', padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none' }} />
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
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Photos du produit</h3>
              <div style={{ width: '100%', padding: '30px', border: '2px dashed var(--primary)', borderRadius: 12, textAlign: 'center', background: 'var(--primary-light)', cursor: 'pointer' }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>📸</span>
                <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>Taper pour ajouter des photos</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Format JPG ou PNG</p>
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
              // VUE INVENTAIRE - GESTION DU STOCK
              filtered.map(product => (
                <div key={product.id} className="card" style={{ padding: 14, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={product.images[0]} alt={product.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{product.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{product.unit}</p>
                      </div>
                    </div>
                    <span className="badge" style={{ background: getStatusBgColor(product.status), color: getStatusColor(product.status), fontSize: 10 }}>
                      {getStatusLabel(product.status)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', padding: 10, borderRadius: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Stock actuel</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={16} />
                      </button>
                      <span style={{ fontWeight: 800, fontSize: 16, minWidth: 30, textAlign: 'center' }}>{product.stock}</span>
                      <button style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
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
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span className="badge" style={{ background: getStatusBgColor(product.status), color: getStatusColor(product.status), fontSize: 11 }}>
                      {getStatusLabel(product.status)}
                    </span>
                    <button style={{ padding: 6, background: 'var(--bg)', borderRadius: 8, color: 'var(--text-secondary)' }}>
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
