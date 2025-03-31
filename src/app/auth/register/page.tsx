'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const { register, isAuthenticated, loginWithGoogle } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Form validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const result = await register(email, password, name);
      
      if (result.success) {
        if (result.message) {
          // If registration requires email confirmation
          setSuccess(result.message);
        } else {
          // If registration is immediate, redirect to chat
          router.replace('/chat');
        }
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const result = await loginWithGoogle();
      
      if (!result.success) {
        setError(result.message || 'Google sign up failed');
        setIsSubmitting(false);
      }
      // No need to handle success case here as it will redirect to Google's OAuth page
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const showEmailRegistration = () => {
    setShowManualForm(true);
  };

  return (
    <div className="bg-amber-50 flex items-center justify-center p-4 m-auto">
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
          <h2 className="text-3xl font-serif text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600">Join us on a spiritual journey</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 rounded-md p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-800 rounded-md p-3 mb-6 text-sm">
            {success}
          </div>
        )}

        {!showManualForm ? (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FcGoogle className="text-2xl" />
              Sign up with Google
            </button>
            
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-gray-300 absolute w-full"></div>
              <div className="bg-white px-4 text-sm text-gray-500 relative">
                or
              </div>
            </div>
            
            <button
              type="button"
              onClick={showEmailRegistration}
              className="w-full bg-[#973B00] hover:bg-[#BA4D00] text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Sign up with Email
            </button>
            
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#973B00] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                Full Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-[#973B00]"
                placeholder="Your name"
              />
            </div>

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
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-[#973B00]"
                placeholder="Create a password"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-[#973B00]"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#973B00] hover:bg-[#BA4D00] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="w-full mt-4 border border-gray-300 bg-white text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Options
            </button>

            <div className="text-center mt-8">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#973B00] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}