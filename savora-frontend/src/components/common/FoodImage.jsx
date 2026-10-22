import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

export default function FoodImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-cream text-orange/60 ${className}`}
      >
        <UtensilsCrossed size={36} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}