'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConversationsProvider } from '@/contexts/ConversationsContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { PaymentMethodProvider } from '@/contexts/PaymentMethodContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ConversationsProvider>
        <PaymentProvider>
          <PaymentMethodProvider>
            <CurrencyProvider>
              {children}
            </CurrencyProvider>
          </PaymentMethodProvider>
        </PaymentProvider>
      </ConversationsProvider>
    </AuthProvider>
  );
}