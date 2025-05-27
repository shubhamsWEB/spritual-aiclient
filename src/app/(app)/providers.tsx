'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConversationsProvider } from '@/contexts/ConversationsContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { PaymentProvider } from '@/contexts/PaymentContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ConversationsProvider>
        <LocationProvider>
          <PaymentProvider>
            {children}
          </PaymentProvider>
        </LocationProvider>
      </ConversationsProvider>
    </AuthProvider>
  );
}