'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { PaymentMethodProvider } from '@/contexts/PaymentMethodContext';
import { PaymentProvider } from '@/contexts/PaymentContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <PaymentMethodProvider>
          <PaymentProvider>
            {children}
          </PaymentProvider>
        </PaymentMethodProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
} 