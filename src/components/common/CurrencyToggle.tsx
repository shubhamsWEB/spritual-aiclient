import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm border border-amber-100">
      <button
        onClick={() => setCurrency('USD')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          currency === 'USD'
            ? 'bg-[#973B00] text-white'
            : 'text-[#973B00] hover:bg-amber-50'
        }`}
      >
        USD
      </button>
      <button
        onClick={() => setCurrency('INR')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          currency === 'INR'
            ? 'bg-[#973B00] text-white'
            : 'text-[#973B00] hover:bg-amber-50'
        }`}
      >
        INR
      </button>
    </div>
  );
} 