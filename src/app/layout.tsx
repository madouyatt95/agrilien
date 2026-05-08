import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/ToastProvider';

export const metadata: Metadata = {
  title: 'AgriLien — Marketplace Agricole du Sénégal',
  description: 'Trouvez les meilleurs produits agricoles frais et locaux. Connectez producteurs et acheteurs au Sénégal.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0B6B32',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AgriLien" />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
