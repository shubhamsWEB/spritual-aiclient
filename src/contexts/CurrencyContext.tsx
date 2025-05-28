'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: number;
  formatPrice: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [exchangeRate, setExchangeRate] = useState<number>(40); // 1 USD = 40 INR (approximate for our pricing)

  useEffect(() => {
    // Detect user's location and set default currency
    async function detectUserLocation() {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country === 'IN') {
          setCurrency('INR');
        }
      } catch (error) {
        console.error('Error detecting location:', error);
      }
    }

    detectUserLocation();
  }, []);

  const formatPrice = (amount: number): string => {
    const formatter = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    if (currency === 'INR') {
      // For INR, we use fixed prices instead of direct conversion
      if (amount === 4.99) return formatter.format(199);
      if (amount === 49.99) return formatter.format(1999);
      return formatter.format(amount * exchangeRate);
    }
    return formatter.format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
} 