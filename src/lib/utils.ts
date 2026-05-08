// ============================================================
// AGRILIEN — Utility functions
// ============================================================

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export function formatPricePerUnit(price: number, unit: string): string {
  return formatPrice(price) + ' / ' + unit;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return formatDate(dateStr);
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    en_attente: 'En attente',
    confirmee: 'Confirmée',
    en_preparation: 'En préparation',
    livree: 'Livrée',
    annulee: 'Annulée',
    en_vente: 'En vente',
    en_rupture: 'En rupture',
    brouillon: 'Brouillon',
    ouvert: 'Ouvert',
    en_cours: 'En cours',
    resolu: 'Résolu',
    ferme: 'Fermé',
    complete: 'Complété',
    echoue: 'Échoué',
    traite: 'Traité',
    refuse: 'Refusé',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    en_attente: '#F97316',
    confirmee: '#0B6B32',
    en_preparation: '#3B82F6',
    livree: '#22C55E',
    annulee: '#EF4444',
    en_vente: '#22C55E',
    en_rupture: '#EF4444',
    brouillon: '#6B7280',
    ouvert: '#F97316',
    en_cours: '#3B82F6',
    resolu: '#22C55E',
    ferme: '#6B7280',
  };
  return colors[status] || '#6B7280';
}

export function getStatusBgColor(status: string): string {
  const colors: Record<string, string> = {
    en_attente: '#FFF7ED',
    confirmee: '#EAF7EF',
    en_preparation: '#EFF6FF',
    livree: '#F0FDF4',
    annulee: '#FEF2F2',
    en_vente: '#F0FDF4',
    en_rupture: '#FEF2F2',
    brouillon: '#F3F4F6',
  };
  return colors[status] || '#F3F4F6';
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}

export function generateOrderNumber(): string {
  return '#CMD-' + Math.floor(1000 + Math.random() * 9000);
}

/**
 * Fetches the user's real GPS coordinates and attempts to reverse geocode
 * using OpenStreetMap Nominatim API to return a city/region name.
 */
export async function getCurrentLocation(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error("La géolocalisation n'est pas supportée par votre navigateur."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding via OpenStreetMap Nominatim
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (!response.ok) throw new Error("Erreur réseau");
          const data = await response.json();
          
          // Try to extract city, town, or state
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state || "Position inconnue";
          resolve(city);
        } catch (error) {
          console.warn("Erreur reverse geocoding:", error);
          resolve(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`); // Fallback to raw coordinates
        }
      },
      (error) => {
        let msg = "Erreur de géolocalisation.";
        if (error.code === 1) msg = "Accès à la position refusé.";
        else if (error.code === 2) msg = "Position indisponible.";
        else if (error.code === 3) msg = "Délai d'attente dépassé.";
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}
