'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
export default function PaymentFailurePage() {
  const router = useRouter();

  const handleTryAgain = () => {
    router.push('/checkout');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-red-600">Payment Failed</h1>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <p className="text-gray-600 text-center">
            Your payment could not be processed. Please try again or contact support if the issue persists.
          </p>
          
          <div className="flex flex-col w-full space-y-3">
            <button 
              onClick={handleTryAgain} 
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Try Again
            </button>
            <button 
              onClick={handleBackToHome} 
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 