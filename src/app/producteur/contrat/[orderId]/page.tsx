'use client';

import { useParams, useRouter } from 'next/navigation';
import { orders } from '@/data/mock-orders';
import { producerUser } from '@/data/mock-users';
import { ChevronLeft, Printer, Download } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import AgriLienLogo from '@/components/ui/Logo';

export default function ContractPage() {
  const params = useParams();
  const router = useRouter();
  const order = orders.find(o => o.id === params.orderId) || orders[0];
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const contractNumber = `CTR-${order.orderNumber.replace('#CMD-', '')}`;

  return (
    <div style={{ background: '#F3F4F6', minHeight: '100vh' }}>
      {/* Action Bar (hidden on print) */}
      <div className="no-print" style={{ background: '#111827', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => router.back()} style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          <ChevronLeft size={20} /> Retour
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => window.print()}
            style={{ background: '#fff', color: '#111827', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Printer size={16} /> Imprimer / PDF
          </button>
        </div>
      </div>

      {/* Contract Document */}
      <div id="contract" style={{ maxWidth: 700, margin: '20px auto', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <div style={{ padding: '32px 40px', borderBottom: '3px solid #0B6B32' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <AgriLienLogo size="lg" />
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: '#6B7280' }}>Contrat N°</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{contractNumber}</p>
            </div>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, textAlign: 'center', color: '#111827', marginBottom: 4 }}>
            BORDEREAU DE VENTE AGRICOLE
          </h1>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#6B7280' }}>
            Établi le {today} via la plateforme AgriLien
          </p>
        </div>

        <div style={{ padding: '28px 40px' }}>
          {/* Parties */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
            <div style={{ padding: 16, background: '#F0FDF4', borderRadius: 12, border: '1px solid #DCFCE7' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#065F46', textTransform: 'uppercase', marginBottom: 8 }}>Le Vendeur (Producteur)</p>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{producerUser.name}</p>
              <p style={{ fontSize: 13, color: '#374151' }}>{producerUser.farmName}</p>
              <p style={{ fontSize: 13, color: '#374151' }}>{producerUser.city}, {producerUser.region}</p>
              <p style={{ fontSize: 13, color: '#374151' }}>Tél : {producerUser.phone}</p>
            </div>
            <div style={{ padding: 16, background: '#EFF6FF', borderRadius: 12, border: '1px solid #DBEAFE' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', marginBottom: 8 }}>L&apos;Acheteur</p>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{order.buyerName}</p>
              <p style={{ fontSize: 13, color: '#374151' }}>{order.deliveryAddress}</p>
              <p style={{ fontSize: 13, color: '#374151' }}>Réf. commande : {order.orderNumber}</p>
            </div>
          </div>

          {/* Produits */}
          <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: 12 }}>Détail des marchandises</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, fontWeight: 700, borderBottom: '2px solid #E5E7EB' }}>Produit</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 12, fontWeight: 700, borderBottom: '2px solid #E5E7EB' }}>Qté</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, fontWeight: 700, borderBottom: '2px solid #E5E7EB' }}>P.U.</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 12, fontWeight: 700, borderBottom: '2px solid #E5E7EB' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 600 }}>{item.productName}</td>
                  <td style={{ padding: '10px 12px', fontSize: 14, textAlign: 'center' }}>{item.quantity} {item.unit}</td>
                  <td style={{ padding: '10px 12px', fontSize: 14, textAlign: 'right' }}>{formatPrice(item.unitPrice)}</td>
                  <td style={{ padding: '10px 12px', fontSize: 14, fontWeight: 700, textAlign: 'right' }}>{formatPrice(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, fontSize: 14 }}>Sous-total</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, fontSize: 14 }}>{formatPrice(order.subtotal)}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ padding: '6px 12px', textAlign: 'right', fontSize: 13, color: '#6B7280' }}>Livraison</td>
                <td style={{ padding: '6px 12px', textAlign: 'right', fontSize: 13, color: '#6B7280' }}>{order.deliveryFee === 0 ? 'Gratuite' : formatPrice(order.deliveryFee)}</td>
              </tr>
              <tr style={{ borderTop: '2px solid #111827' }}>
                <td colSpan={3} style={{ padding: '12px', textAlign: 'right', fontWeight: 800, fontSize: 16 }}>TOTAL TTC</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, fontSize: 18, color: '#0B6B32' }}>{formatPrice(order.total)}</td>
              </tr>
            </tfoot>
          </table>

          {/* Clauses */}
          <div style={{ background: '#FFFBEB', borderRadius: 12, padding: 16, marginBottom: 24, border: '1px solid #FEF3C7' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#92400E', marginBottom: 8 }}>CONDITIONS DE PAIEMENT — SÉQUESTRE PAYDUNYA</h4>
            <ul style={{ fontSize: 12, color: '#78350F', lineHeight: 1.7, paddingLeft: 16, margin: 0 }}>
              <li>Le montant total est bloqué sur le compte séquestre PayDunya dès validation de la commande.</li>
              <li>Les fonds seront libérés au profit du Vendeur uniquement après confirmation de réception par l&apos;Acheteur.</li>
              <li>En cas de litige, les fonds restent en séquestre jusqu&apos;à résolution par le service AgriLien.</li>
              <li>Délai de livraison convenu : 48 à 72 heures ouvrées.</li>
            </ul>
          </div>

          {/* Signatures */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 32 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 }}>Signature du Vendeur</p>
              <div style={{ height: 60, borderBottom: '1px solid #D1D5DB' }}></div>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{producerUser.name}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 }}>Signature de l&apos;Acheteur</p>
              <div style={{ height: 60, borderBottom: '1px solid #D1D5DB' }}></div>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>{order.buyerName}</p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
            <p style={{ fontSize: 11, color: '#9CA3AF' }}>
              Document généré automatiquement par AgriLien — Plateforme Agricole du Sénégal
            </p>
            <p style={{ fontSize: 11, color: '#9CA3AF' }}>
              www.agrilien.sn • support@agrilien.sn • +221 33 800 00 00
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          #contract { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
}
