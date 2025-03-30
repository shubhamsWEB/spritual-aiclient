// src/app/auth/hash-callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { setCookie } from '@/utils/cookies';

export default function HashCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to extract data from URL hash
    const getHashParams = () => {
      const hash = window.location.hash.substring(1);
      return hash.split('&').reduce((params, pair) => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
        return params;
      }, {} as Record<string, string>);
    };

    try {
      // Extract token from hash
      const hashParams = getHashParams();
      const token = hashParams.access_token;
      
      if (!token) {
        setError('No authentication token received');
        setIsLoading(false);
        return;
      }
      
      // Store token in cookie
      setCookie('authToken', token);
      
      // Redirect to chat page
      router.push('/chat');
    } catch (err: any) {
      console.error('Hash callback error:', err);
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <Image
              src="/images/peacock-feather.svg"
              alt="Loading"
              fill
              className="object-contain animate-pulse"
            />
          </div>
          <h2 className="text-2xl font-serif text-gray-800 mb-4">Completing your sign in</h2>
          <p className="text-gray-600">Please wait while we authenticate you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <Image
                src="/images/peacock-feather.svg"
                alt="Error"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-serif text-gray-800 mb-4">Authentication Failed</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-[#973B00] hover:bg-[#BA4D00] text-white font-bold py-2 px-6 rounded-full"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null; // When loading, return nothing (will redirect when done)
}