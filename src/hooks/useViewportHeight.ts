import { useState, useEffect } from 'react';

export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    // Function to update measurements
    const updateMeasurements = () => {
      setViewportHeight(window.innerHeight);
      const headerElement = document.querySelector('header');
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    };

    // Initial measurement
    updateMeasurements();

    // Update on resize
    window.addEventListener('resize', updateMeasurements);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateMeasurements);
  }, []);

  return { viewportHeight, headerHeight };
} 