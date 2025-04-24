'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMenuReady, setIsMenuReady] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsAnimating(true);
      // Wait for animation to complete before hiding the menu
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsMenuOpen(true);
      // Small delay to ensure DOM is ready before starting the animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsMenuReady(true);
        });
      });
    }
  };

  // Reset menu ready state when menu is closed
  useEffect(() => {
    if (!isMenuOpen) {
      setIsMenuReady(false);
    }
  }, [isMenuOpen]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-amber-50 shadow-sm p-2 sm:p-4 sticky top-0 z-50">
      <div className="container px-4 sm:px-0 mx-auto flex justify-between items-center">
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
        <Link href="/" className="flex items-center gap-1">
        <Image 
            src="/logo.png" 
            alt="Gita Speaks Logo" 
            width={40} 
            height={40} 
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <span className="text-lg sm:text-2xl font-serif text-[#973B00] logo-font">GITA SPEAKS</span>
        </Link>
        
        
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
            <li>
              <Link 
                href="/pricing" 
                className="text-[#973B00] hover:text-[#BA4D00]"
              >
                PRICING
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
      
      {/* Mobile navigation - improved animation */}
      {(isMenuOpen || isAnimating) && (
        <div className="fixed inset-0 bg-transparent bg-opacity-40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ease-in-out"
             style={{ opacity: isMenuReady || isAnimating ? 1 : 0 }}
             onClick={toggleMenu}>
          <nav 
            className={`absolute left-0 top-0 h-full w-3/4 max-w-xs bg-amber-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
              (isMenuReady && !isAnimating) ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center border-b border-amber-200">
              <span className="text-lg font-serif text-[#973B00] logo-font">GITA SPEAKS</span>
              <button 
                onClick={toggleMenu}
                aria-label="Close menu"
                className="text-[#973B00]"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="flex flex-col p-4">
              <li>
                <Link 
                  href="/" 
                  className="text-[#973B00] hover:text-[#BA4D00] block py-3 border-b border-amber-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  HOME
                </Link>
              </li>
              <li>
                <Link 
                  href="/chat" 
                  className="text-[#973B00] hover:text-[#BA4D00] block py-3 border-b border-amber-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  START CHAT
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="text-[#973B00] hover:text-[#BA4D00] block py-3 border-b border-amber-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  PRICING
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      href="/profile" 
                      className="text-[#973B00] hover:text-[#BA4D00] block py-3 border-b border-amber-100"
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
                      className="text-[#973B00] hover:text-[#BA4D00] block w-full text-center border border-[#973B00] rounded-lg px-2 py-1 mt-2"
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
                      className="text-[#973B00] hover:text-[#BA4D00] block w-full text-center border border-[#973B00] rounded-lg px-2 py-1 mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      SIGN IN
                    </Link>
                  </li>
                  <li className="mt-4">
                    <Link 
                      href="/auth/register" 
                      className="text-white bg-[#973B00] hover:bg-[#BA4D00] block py-2 px-2 rounded-lg text-center font-medium transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      JOIN
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}