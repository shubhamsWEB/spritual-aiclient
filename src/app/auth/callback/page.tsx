'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { setCookie } from '@/utils/cookies';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get code from URL parameters
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        if (error) {
          setError(decodeURIComponent(error));
          setIsLoading(false);
          return;
        }
        
        if (!code) {
          setError('No authentication code received');
          setIsLoading(false);
          return;
        }
        
        // Exchange code for session
        const response = await fetch(`/api/auth/callback?code=${code}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to authenticate');
        }
        
        // Store token in cookie
        if (data.token) {
          setCookie('authToken', data.token);
          
          // Redirect to home or a specified redirect URL
          const redirectTo = searchParams.get('redirect_to') || '/chat';
          router.push(redirectTo);
        } else {
          throw new Error('No authentication token received');
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        setIsLoading(false);
      }
    }
    
    handleCallback();
  }, [router, searchParams]);

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