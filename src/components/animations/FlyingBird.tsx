import React from 'react';
import Image from 'next/image';

interface FlyingBirdProps {
  delay?: string;
  size?: 'small' | 'medium' | 'large';
  top?: string;
  className?: string;
  direction?: 'ltr' | 'rtl';
}

export default function FlyingBird({ 
  delay = '0s', 
  size = 'medium',
  top = '10%',
  className = '',
  direction = 'ltr'
}: FlyingBirdProps) {
  const sizeClass = size === 'small' ? 'flying-bird-small' : 
                   size === 'large' ? 'flying-bird-large' : 'flying-bird-random';
  
  // Add direction-specific class
  const directionClass = `flying-bird-${direction}`;
  
  // Add custom animation style directly
  const customAnimationStyle = `
    @keyframes fly-bird-custom-${direction} {
      0% { 
        transform: translateX(${direction === 'ltr' ? '-120vw' : '120vw'}) translateY(10vh) scale(0.6) rotate(${direction === 'ltr' ? '5deg' : '-5deg'});
        opacity: 0;
      }
      5% {
        opacity: 1;
      }
      15% { 
        transform: translateX(${direction === 'ltr' ? '-70vw' : '70vw'}) translateY(18vh) scale(0.7) rotate(${direction === 'ltr' ? '-4deg' : '4deg'});
        opacity: 1;
      }
      30% { 
        transform: translateX(${direction === 'ltr' ? '-40vw' : '40vw'}) translateY(8vh) scale(0.75) rotate(${direction === 'ltr' ? '8deg' : '-8deg'});
      }
      45% { 
        transform: translateX(${direction === 'ltr' ? '-10vw' : '10vw'}) translateY(15vh) scale(0.8) rotate(${direction === 'ltr' ? '-6deg' : '6deg'});
      }
      60% { 
        transform: translateX(${direction === 'ltr' ? '20vw' : '-20vw'}) translateY(5vh) scale(0.85) rotate(${direction === 'ltr' ? '7deg' : '-7deg'});
      }
      75% { 
        transform: translateX(${direction === 'ltr' ? '50vw' : '-50vw'}) translateY(20vh) scale(0.8) rotate(${direction === 'ltr' ? '-5deg' : '5deg'});
      }
      90% { 
        transform: translateX(${direction === 'ltr' ? '80vw' : '-80vw'}) translateY(12vh) scale(0.7) rotate(${direction === 'ltr' ? '4deg' : '-4deg'});
      }
      100% { 
        transform: translateX(${direction === 'ltr' ? '120vw' : '-120vw'}) translateY(15vh) scale(0.6) rotate(${direction === 'ltr' ? '-3deg' : '3deg'});
        opacity: 0;
      }
    }
  `;
  
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customAnimationStyle }} />
      <div 
        className={`flying-bird ${sizeClass} ${className}`}
        style={{ 
          top,
          animationDelay: delay,
          animationPlayState: 'running',
          animationFillMode: 'forwards',
          animation: `fly-bird-custom-${direction} ${size === 'small' ? '15s' : (size === 'large' ? '25s' : '20s')} linear infinite`,
          position: 'absolute',
          zIndex: 10,
          pointerEvents: 'none',
          width: '100%',
          height: '100vh'
        }}
      >
        <Image
          src="/images/flying-bird.svg"
          alt="Flying Bird"
          width={size === 'small' ? 40 : (size === 'large' ? 80 : 60)}
          height={size === 'small' ? 30 : (size === 'large' ? 60 : 45)}
          className={`object-contain ${direction === 'rtl' ? 'transform -scale-x-100' : ''}`}
          priority
        />
      </div>
    </>
  );
} 