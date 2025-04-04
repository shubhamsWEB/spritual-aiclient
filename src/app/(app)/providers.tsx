'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConversationsProvider } from '@/contexts/ConversationsContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ConversationsProvider>
        {children}
      </ConversationsProvider>
    </AuthProvider>
  );
}