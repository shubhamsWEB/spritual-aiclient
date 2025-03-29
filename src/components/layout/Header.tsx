'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-amber-50 shadow-sm p-2 sm:p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg sm:text-2xl font-serif text-[#973B00] logo-font">GITA GUIDE</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-[#973B00]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-6 items-center">
            <li>
              <Link 
                href="/" 
                className="text-[#973B00] hover:text-[#BA4D00]"
              >
                HOME
              </Link>
            </li>
            <li>
              <Link 
                href="/chat" 
                className="text-[#973B00] hover:text-[#BA4D00]"
              >
                START CHAT
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    href="/profile" 
                    className="text-[#973B00] hover:text-[#BA4D00]"
                  >
                    PROFILE
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={logout}
                    className="text-[#973B00] hover:text-[#BA4D00] bg-transparent border border-[#973B00] rounded-full px-4 py-1"
                  >
                    SIGN OUT
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    href="/auth/login" 
                    className="text-[#973B00] hover:text-[#BA4D00] bg-transparent border border-[#973B00] rounded-full px-4 py-1"
                  >
                    SIGN IN
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/auth/register" 
                    className="text-white bg-[#973B00] hover:bg-[#BA4D00] rounded-full px-4 py-1 transition-colors"
                  >
                    JOIN
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="md:hidden mt-4 border-t border-gray-200 pt-4">
          <ul className="flex flex-col gap-4">
            <li>
              <Link 
                href="/" 
                className="text-[#973B00] hover:text-[#BA4D00] block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link 
                href="/chat" 
                className="text-[#973B00] hover:text-[#BA4D00] block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                START CHAT
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    href="/profile" 
                    className="text-[#973B00] hover:text-[#BA4D00] block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    PROFILE
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-[#973B00] hover:text-[#BA4D00] block py-2 w-full text-left"
                  >
                    SIGN OUT
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    href="/auth/login" 
                    className="text-[#973B00] hover:text-[#BA4D00] block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    SIGN IN
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/auth/register" 
                    className="text-[#973B00] hover:text-[#BA4D00] block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    JOIN
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}