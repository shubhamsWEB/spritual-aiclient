'use client';

import React from 'react';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import PricingSection from './PricingSection';

export default function PricingWrapper() {
  return (
    <CurrencyProvider>
      <PricingSection />
    </CurrencyProvider>
  );
} 