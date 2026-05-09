// Catalogue officiel des produits AgriLien
// Le producteur ne peut ajouter que des produits de cette liste
// Pour un nouveau produit, il doit en faire la demande à l'admin

export interface CatalogProduct {
  name: string;
  category: string;
  unit: string;
}

export const productCatalog: CatalogProduct[] = [
  // Fruits & Légumes
  { name: 'Mangues Kent', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Mangues Keitt', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Tomates Roma', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Tomates Cerises', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Oignons Rosés', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Oignons Violets', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Pommes de terre', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Chou vert', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Chou pommé', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Aubergines', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Piment vert', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Piment rouge', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Carottes', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Concombres', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Pastèques', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Melons', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Bananes plantain', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Bananes douces', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Papayes', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Citrons', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Gombos', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Laitue', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Persil', category: 'Fruits & Légumes', unit: 'Botte' },
  { name: 'Menthe', category: 'Fruits & Légumes', unit: 'Botte' },
  { name: 'Bissap (Hibiscus)', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Ditakh', category: 'Fruits & Légumes', unit: 'Kg' },
  { name: 'Madd', category: 'Fruits & Légumes', unit: 'Kg' },

  // Céréales & Grains
  { name: 'Riz Local Étuvé', category: 'Céréales & Grains', unit: 'Kg' },
  { name: 'Riz Paddy', category: 'Céréales & Grains', unit: 'Kg' },
  { name: 'Mil Souna', category: 'Céréales & Grains', unit: 'Kg' },
  { name: 'Mil Sanio', category: 'Céréales & Grains', unit: 'Kg' },
  { name: 'Sorgho', category: 'Céréales & Grains', unit: 'Kg' },
  { name: 'Maïs', category: 'Céréales & Grains', unit: 'Kg' },
  { name: 'Fonio', category: 'Céréales & Grains', unit: 'Kg' },
  { name: 'Arachide coque', category: 'Céréales & Grains', unit: 'Kg' },
  { name: 'Arachide décortiquée', category: 'Céréales & Grains', unit: 'Kg' },
  { name: 'Niébé (Haricot)', category: 'Céréales & Grains', unit: 'Kg' },

  // Tubercules & Racines
  { name: 'Manioc frais', category: 'Tubercules & Racines', unit: 'Kg' },
  { name: 'Patate douce', category: 'Tubercules & Racines', unit: 'Kg' },
  { name: 'Igname', category: 'Tubercules & Racines', unit: 'Kg' },
  { name: 'Gingembre frais', category: 'Tubercules & Racines', unit: 'Kg' },

  // Produits Transformés
  { name: 'Huile d\'arachide', category: 'Produits Transformés', unit: 'Litre' },
  { name: 'Beurre de karité', category: 'Produits Transformés', unit: 'Kg' },
  { name: 'Pâte d\'arachide', category: 'Produits Transformés', unit: 'Kg' },
  { name: 'Couscous de mil', category: 'Produits Transformés', unit: 'Kg' },
  { name: 'Noix de cajou', category: 'Produits Transformés', unit: 'Kg' },
  { name: 'Poissons séchés', category: 'Produits Transformés', unit: 'Kg' },
  { name: 'Miel de Casamance', category: 'Produits Transformés', unit: 'Litre' },
  { name: 'Jus de bouye', category: 'Produits Transformés', unit: 'Litre' },
  { name: 'Jus de bissap', category: 'Produits Transformés', unit: 'Litre' },

  // Élevage
  { name: 'Poulet fermier', category: 'Volaille', unit: 'Unité' },
  { name: 'Œufs fermiers', category: 'Volaille', unit: 'Plateau (30)' },
  { name: 'Lait frais', category: 'Produits Laitiers', unit: 'Litre' },
  { name: 'Lait caillé', category: 'Produits Laitiers', unit: 'Litre' },
  { name: 'Bœuf sur pied', category: 'Bétail Bovin', unit: 'Tête' },
  { name: 'Mouton', category: 'Bétail Ovin', unit: 'Tête' },
  { name: 'Chèvre', category: 'Bétail Caprin', unit: 'Tête' },
];

export const specialties = [
  'Maraîchage',
  'Arboriculture',
  'Riziculture',
  'Élevage bovin',
  'Aviculture',
  'Apiculture',
  'Pêche',
  'Produits laitiers',
  'Céréales',
  'Tubercules',
  'Transformation',
  'Horticulture',
];

export const catalogCategories = [...new Set(productCatalog.map(p => p.category))];
