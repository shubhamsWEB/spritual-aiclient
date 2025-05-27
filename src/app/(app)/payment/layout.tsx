'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PaymentLayoutProps {
  children: React.ReactNode;
}

function PaymentErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Payment layout error:', error);
      setErrorDetails(error.message || 'Unknown error occurred');
      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection in payment layout:', event.reason);
      setErrorDetails(event.reason?.message || 'Promise rejection occurred');
      setHasError(true);
    };

    // Catch React errors
    const handleReactError = (error: Error, errorInfo: any) => {
      console.error('React error in payment layout:', error, errorInfo);
      setErrorDetails(error.message || 'React error occurred');
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-center text-red-600">Payment Error</h1>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 text-center">
              There was an error processing your payment page. This might be due to invalid URL parameters.
            </p>
            
            {process.env.NODE_ENV === 'development' && errorDetails && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md text-xs overflow-auto max-h-40 w-full">
                <h3 className="font-semibold mb-2">Error Details:</h3>
                <pre className="whitespace-pre-wrap">{errorDetails}</pre>
              </div>
            )}
            
            <div className="flex flex-col w-full space-y-3">
              <button 
                onClick={() => {
                  try {
                    router.push('/checkout');
                  } catch {
                    window.location.href = '/checkout';
                  }
                }} 
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Go to Checkout
              </button>
              <button 
                onClick={() => {
                  try {
                    router.push('/');
                  } catch {
                    window.location.href = '/';
                  }
                }} 
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              >
                Back to Home
              </button>
              <button 
                onClick={() => {
                  setHasError(false);
                  setErrorDetails('');
                }} 
                className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function PaymentLayout({ children }: PaymentLayoutProps) {
  return (
    <PaymentErrorBoundary>
      {children}
    </PaymentErrorBoundary>
  );
} 