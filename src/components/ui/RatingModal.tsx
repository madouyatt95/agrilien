'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';

interface RatingModalProps {
  productName: string;
  onSubmit: (rating: number, comment: string) => void;
  onClose: () => void;
}

export default function RatingModal({ productName, onSubmit, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
    setSubmitted(true);
    setTimeout(onClose, 1500);
  };

  if (submitted) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center', maxWidth: 340, width: '100%', animation: 'fadeInUp 0.3s ease' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🎉</p>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Merci !</p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Votre avis a été publié</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 380, width: '100%', animation: 'fadeInUp 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Votre avis</h3>
          <button onClick={onClose} style={{ color: 'var(--text-light)' }}><X size={22} /></button>
        </div>

        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>Comment évaluez-vous <strong>{productName}</strong> ?</p>

        {/* Stars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              onMouseEnter={() => setHoveredRating(i)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(i)}
              style={{ padding: 4, transition: 'transform 0.15s' }}
            >
              <Star
                size={36}
                fill={i <= (hoveredRating || rating) ? '#FBBF24' : 'none'}
                color={i <= (hoveredRating || rating) ? '#FBBF24' : '#D1D5DB'}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          {rating === 0 ? 'Appuyez sur une étoile' : ['', 'Mauvais', 'Moyen', 'Bien', 'Très bien', 'Excellent'][rating]}
        </p>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Partagez votre expérience (optionnel)..."
          rows={3}
          style={{
            width: '100%', padding: 12, border: '1px solid var(--border)',
            borderRadius: 10, fontSize: 14, resize: 'none', outline: 'none',
            marginBottom: 16,
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="btn btn-primary btn-block"
          style={{ opacity: rating === 0 ? 0.5 : 1 }}
        >
          Publier mon avis
        </button>
      </div>
    </div>
  );
}
