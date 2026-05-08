'use client';
export default function AdminContenuPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Gestion du contenu</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {[
          { title: 'Bannières accueil', count: 3, desc: 'Gérez les bannières promotionnelles de la page d\'accueil' },
          { title: 'Pages statiques', count: 5, desc: 'CGU, Politique de confidentialité, FAQ, À propos, Contact' },
          { title: 'Catégories', count: 10, desc: 'Gérez les catégories de produits et leurs icônes' },
          { title: 'Notifications push', count: 12, desc: 'Gérez les notifications envoyées aux utilisateurs' },
        ].map((item, i) => (
          <div key={i} className="card card-padded" style={{ cursor: 'pointer' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{item.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{item.desc}</p>
            <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{item.count} éléments</span>
          </div>
        ))}
      </div>
    </div>
  );
}
