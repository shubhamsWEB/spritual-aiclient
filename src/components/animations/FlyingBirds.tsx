import React from 'react';
import FlyingBird from './FlyingBird';

interface FlyingBirdsProps {
  count?: number;
  className?: string;
}

export default function FlyingBirds({ count = 3, className = '' }: FlyingBirdsProps) {
  return (
    <div className={`flying-birds-container relative w-full h-full ${className}`}>
      {Array.from({ length: count }).map((_, index) => {
        // Create variation in bird placement and timing
        const size = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as 'small' | 'medium' | 'large';
        const top = `${10 + Math.random() * 60}%`;
        const delay = `${index * 0.5 + Math.random() * 2}s`;
        
        // Generate random direction - either left-to-right or right-to-left
        const direction = Math.random() > 0.5 ? 'ltr' : 'rtl';
        
        return (
          <FlyingBird 
            key={index}
            size={size}
            top={top}
            delay={delay}
            direction={direction}
          />
        );
      })}
    </div>
  );
} 