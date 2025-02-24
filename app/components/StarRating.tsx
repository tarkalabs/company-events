'use client';

import React from 'react';

export interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, readonly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onRate?.(star)}
          disabled={readonly}
          className={`
            ${readonly ? 'cursor-default' : 'cursor-pointer'}
            transition-colors
            ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}
            hover:${star <= rating ? 'text-yellow-500' : 'text-gray-500'}
          `}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating; 