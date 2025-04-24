'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConversationsProvider } from '@/contexts/ConversationsContext';
import { PaymentProvider } from '@/contexts/PaymentContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ConversationsProvider>
        <PaymentProvider>
          {children}
        </PaymentProvider>
      </ConversationsProvider>
    </AuthProvider>
  );
}