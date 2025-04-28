'use client';

import React, { createContext, useContext, useState } from 'react';

type PaymentMethod = 'razorpay' | 'paypal';

interface PaymentMethodContextType {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
}

const PaymentMethodContext = createContext<PaymentMethodContextType | undefined>(undefined);

export function PaymentMethodProvider({ children }: { children: React.ReactNode }) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');

  return (
    <PaymentMethodContext.Provider value={{ paymentMethod, setPaymentMethod }}>
      {children}
    </PaymentMethodContext.Provider>
  );
}

export function usePaymentMethod() {
  const context = useContext(PaymentMethodContext);
  if (context === undefined) {
    throw new Error('usePaymentMethod must be used within a PaymentMethodProvider');
  }
  return context;
} 