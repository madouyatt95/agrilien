/* eslint-disable @next/next/no-img-element */
export default function AgriLienLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: { h: 48 }, md: { h: 60 }, lg: { h: 90 } };
  const s = sizes[size];

  return (
    <img
      src="/agrilien-logo.jpg"
      alt="AgriLien"
      style={{ height: s.h, width: 'auto', objectFit: 'contain', display: 'block' }}
    />
  );
}
