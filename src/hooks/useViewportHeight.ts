import { useState, useEffect } from 'react';

export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [headerHeight, setHeaderHeight] = useState(64); // Default header height

  useEffect(() => {
    // Function to update viewport height
    const updateHeight = () => {
      // Use window.innerHeight for the viewport height
      setViewportHeight(window.innerHeight);
      
      // Get actual header height if header exists
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.clientHeight);
      }
    };

    // Set initial height
    updateHeight();

    // Update height on resize
    window.addEventListener('resize', updateHeight);
    
    // Also update on orientation change for mobile devices
    window.addEventListener('orientationchange', updateHeight);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return { viewportHeight, headerHeight };
} 