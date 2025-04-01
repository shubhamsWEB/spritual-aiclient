'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

// Create a separate component that uses useSearchParams
function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManualLogin, setShowManualLogin] = useState(false);
  const { login, isAuthenticated, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect_to') || '/chat';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/chat');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.message || 'Invalid email or password');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Pass the redirect path to the Google login function
      const result = await loginWithGoogle(redirectPath);
      
      if (!result.success) {
        setError(result.message || 'Google login failed');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-auto bg-amber-50 flex justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-4 border border-amber-100">
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <Image
                src="/images/peacock-feather.svg"
                alt="Peacock Feather"
                fill
                className="object-contain peacock-feather"
              />
            </div>
          </div>
          <h2 className="text-3xl font-serif text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your spiritual journey</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 rounded-md p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {!showManualLogin ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FcGoogle className="text-2xl" />
              Sign in with Google
            </button>
            
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-gray-300 absolute w-full"></div>
              <div className="bg-white px-4 text-sm text-gray-500 relative">
                or
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setShowManualLogin(true)}
              className="w-full bg-[#973B00] hover:bg-[#BA4D00] text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Sign in with Email
            </button>
            
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-[#973B00] hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-[#973B00]"
                placeholder="Your email"
                required
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-[#973B00] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-[#973B00]"
                placeholder="Your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#973B00] hover:bg-[#BA4D00] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
            
            <button
              type="button"
              onClick={() => setShowManualLogin(false)}
              className="w-full mt-4 border border-gray-300 bg-white text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to login options
            </button>

            <div className="text-center mt-8">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-[#973B00] hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Main component that wraps the content with Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-auto bg-amber-50 flex justify-center p-4">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}