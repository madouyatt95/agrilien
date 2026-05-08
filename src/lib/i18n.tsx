'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

type Locale = 'fr' | 'wo';

const translations: Record<Locale, Record<string, string>> = {
  fr: {
    home: 'Accueil',
    search: 'Recherche',
    categories: 'Catégories',
    cart: 'Panier',
    profile: 'Profil',
    hello: 'Bonjour',
    whatAreYouLooking: 'Que cherchez-vous aujourd\'hui ?',
    searchPlaceholder: 'Rechercher un produit, une exploitation...',
    discover: 'Découvrir',
    popularCategories: 'Catégories populaires',
    seeAll: 'Voir tout',
    dealsOfTheDay: '🔥 Offres du jour',
    bestSellers: 'Meilleures ventes',
    recommended: 'Produits recommandés',
    available: 'Disponible',
    lowStock: 'Stock limité',
    outOfStock: 'En rupture',
    addToCart: 'Ajouter au panier',
    myOrders: 'Mes commandes',
    myFavorites: 'Mes favoris',
    myReviews: 'Mes avis',
    messages: 'Messages',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    organic: 'Bio',
    freeDelivery: 'Livraison gratuite',
    filters: 'Filtres',
    reset: 'Réinitialiser',
    results: 'résultats',
    sortBy: 'Trier par',
    priceAsc: 'Prix ↑',
    priceDesc: 'Prix ↓',
    popularity: 'Popularité',
    bestRating: 'Meilleure note',
    promotions: 'Promotions',
    checkout: 'Valider la commande',
    payment: 'Paiement',
    delivery: 'Livraison',
    total: 'Total',
    subtotal: 'Sous-total',
    confirmOrder: 'Confirmer le paiement',
    orderConfirmed: 'Commande confirmée !',
    trackOrder: 'Suivre ma commande',
    backToHome: 'Retour à l\'accueil',
    language: 'Langue',
  },
  wo: {
    home: 'Kër',
    search: 'Wut',
    categories: 'Ngir yi',
    cart: 'Saritam',
    profile: 'Sama profil',
    hello: 'Nanga def',
    whatAreYouLooking: 'Lu ngay wut tey ?',
    searchPlaceholder: 'Wut benn ngir...',
    discover: 'Xool',
    popularCategories: 'Ngir yi gën a dal',
    seeAll: 'Xool yépp',
    dealsOfTheDay: '🔥 Njëg bu tey',
    bestSellers: 'Yi gën a jaay',
    recommended: 'Ñu la digal',
    available: 'Am na',
    lowStock: 'Doy nañu tuuti',
    outOfStock: 'Amul',
    addToCart: 'Teg ci saritam',
    myOrders: 'Sama commandes',
    myFavorites: 'Yi may bëgg',
    myReviews: 'Sama avis yi',
    messages: 'Bataaxal yi',
    settings: 'Paramètres',
    logout: 'Génn',
    organic: 'Bio',
    freeDelivery: 'Livraison gratuite',
    filters: 'Filtres',
    reset: 'Delloo',
    results: 'résultats',
    sortBy: 'Trier',
    priceAsc: 'Njëg ↑',
    priceDesc: 'Njëg ↓',
    popularity: 'Popularité',
    bestRating: 'Note bu baax',
    promotions: 'Promotions',
    checkout: 'Dëggal commande bi',
    payment: 'Fey',
    delivery: 'Yóbbu',
    total: 'Tollu',
    subtotal: 'Sous-total',
    confirmOrder: 'Dëggal fey bi',
    orderConfirmed: 'Commande bi dëgg na !',
    trackOrder: 'Topp commande bi',
    backToHome: 'Dellu ci kër gi',
    language: 'Làkk',
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'fr', setLocale: () => {}, t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');

  useEffect(() => {
    const stored = localStorage.getItem('agrilien_locale') as Locale;
    if (stored === 'fr' || stored === 'wo') setLocaleState(stored);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('agrilien_locale', l);
  }, []);

  const t = useCallback((key: string) => translations[locale][key] || key, [locale]);

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useTranslation() { return useContext(I18nContext); }
