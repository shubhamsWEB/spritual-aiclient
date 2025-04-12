import React, { useEffect, useRef } from 'react';
import FlyingBird from './FlyingBird';

interface FlyingBirdsProps {
  count?: number;
  className?: string;
  enableSound?: boolean;
}

export default function FlyingBirds({ 
  count = 4, 
  className = '',
  enableSound = false 
}: FlyingBirdsProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Example of using multiple chirp sounds
  const chirpSounds = [
    '/audio/birds-chirping.mp3',
    '/audio/birds-chirping-1.mp3',
    '/audio/birds-chirping-2.mp3',
  ];
  
  // Function to play chirping sound at random intervals
  useEffect(() => {
    if (!enableSound) return;
    
    // Play chirping sounds at random intervals
    const playRandomChirp = () => {
      if (audioRef.current) {
        // Select random chirp sound
        const randomChirp = chirpSounds[Math.floor(Math.random() * chirpSounds.length)];
        audioRef.current.src = randomChirp;
        audioRef.current.volume = 0.15;
        audioRef.current.play().catch(err => {
          console.log("Audio play was prevented:", err);
        });
      }
      
      // Schedule next chirp at random interval (between 1-5 seconds)
      const nextChirpDelay = 1000 + Math.random() * 4000;
      setTimeout(playRandomChirp, nextChirpDelay);
    };
    
    // Start the random chirping
    const initialDelay = 1000 + Math.random() * 2000;
    const timerId = setTimeout(playRandomChirp, initialDelay);
    
    // Clean up on unmount
    return () => {
      clearTimeout(timerId);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [enableSound]);
  
  return (
    <div className={`flying-birds-container relative w-full h-full ${className}`}>
      {/* Audio element for bird chirping */}
      {enableSound && (
        <audio 
          ref={audioRef} 
          src="/audio/birds-chirping.mp3" // You'll need to add this audio file to your public folder
          preload="auto"
        />
      )}
      
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