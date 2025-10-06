import React, { useState } from 'react';
import { StarIcon } from '../icons/Icons';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, readOnly = false, className }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rate: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(rate);
    }
  };

  const handleMouseEnter = (rate: number) => {
    if (!readOnly) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const displayRating = hoverRating || rating;
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
            className={`text-yellow-400 disabled:cursor-default focus:outline-none ${readOnly ? '' : 'cursor-pointer transition-transform duration-150 hover:scale-110'}`}
            aria-label={`Rate ${star} stars`}
          >
            <StarIcon 
              className="w-5 h-5"
              fill={star <= displayRating ? 'currentColor' : 'none'}
              stroke={star <= displayRating ? 'currentColor' : 'currentColor'}
            />
          </button>
        );
      })}
    </div>
  );
};