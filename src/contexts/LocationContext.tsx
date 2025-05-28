'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isUserFromIndia } from '@/utils/geolocation';

interface LocationContextType {
  isIndia: boolean | null;
  isLoading: boolean;
  error: Error | null;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [isIndia, setIsIndia] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const detectLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Detecting user location...');
      const result = await isUserFromIndia();
      console.log(`User location detected: ${result ? 'India' : 'Non-India'}`);
      setIsIndia(result);
    } catch (err) {
      console.error('Error detecting location:', err);
      setError(err instanceof Error ? err : new Error('Failed to detect location'));
      // Default to non-India for payment processing if detection fails
      setIsIndia(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Detect location on initial load
  useEffect(() => {
    detectLocation();
  }, []);

  // Function to manually refresh location if needed
  const refreshLocation = async () => {
    await detectLocation();
  };

  const value = {
    isIndia,
    isLoading,
    error,
    refreshLocation
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
} 