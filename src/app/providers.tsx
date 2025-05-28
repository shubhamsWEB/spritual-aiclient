'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { PaymentProvider } from '@/contexts/PaymentContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <PaymentProvider>
          <CurrencyProvider>
            {children}
          </CurrencyProvider>
        </PaymentProvider>
      </LocationProvider>
    </AuthProvider>
  );
} 