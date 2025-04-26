'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </AuthProvider>
  );
} 