import React, { useState } from 'react';

const StarRating = ({ rating = 0, interactive = false, onRate, size = 18 }) => {
  const [hovered, setHovered] = useState(0);
  const display = hovered || rating;

  return (
    <div style={{ display: 'inline-flex', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i}
          width={size} height={size} viewBox="0 0 24 24"
          fill={i <= display ? '#f4a261' : 'none'}
          stroke={i <= display ? '#f4a261' : 'rgba(244,162,97,0.3)'}
          strokeWidth="2"
          style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 0.15s' }}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate && onRate(i)}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
