'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMenuReady, setIsMenuReady] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsMenuOpen(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsMenuReady(true);
        });
      });
    }
  };

  useEffect(() => {
    if (!isMenuOpen) {
      setIsMenuReady(false);
    }
  }, [isMenuOpen]);

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
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md' 
          : 'bg-amber-50'
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
          >
            <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-300">
              <Image 
                src="/logo.png" 
                alt="Gita Speaks Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-serif text-[#973B00] logo-font group-hover:text-[#BA4D00] transition-colors">
              GITA SPEAKS
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {[
                { href: '/', label: 'HOME' },
                { href: '/about-us', label: 'ABOUT US' },
                { href: '/chat', label: 'START CHAT' },
                { href: '/pricing', label: 'PRICING' },
                { href: '/contact-us', label: 'CONTACT US' },
              ].map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="relative text-[#973B00] hover:text-[#BA4D00] font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#BA4D00] after:transition-all hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      href="/profile"
                      className="flex items-center gap-2 text-[#973B00] hover:text-[#BA4D00] transition-colors"
                    >
                      <FiUser size={18} />
                      <span>PROFILE</span>
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={logout}
                      className="flex items-center gap-2 text-[#973B00] hover:text-[#BA4D00] border border-[#973B00] hover:border-[#BA4D00] rounded-full px-4 py-1.5 transition-all duration-300"
                    >
                      <FiLogOut size={18} />
                      <span>SIGN OUT</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/auth/login"
                      className="flex items-center gap-2 text-[#973B00] hover:text-[#BA4D00] border border-[#973B00] hover:border-[#BA4D00] rounded-full px-4 py-1.5 transition-all duration-300"
                    >
                      <FiLogIn size={18} />
                      <span>SIGN IN</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/auth/register"
                      className="flex items-center gap-2 text-white bg-[#973B00] hover:bg-[#BA4D00] rounded-full px-4 py-1.5 transition-all duration-300"
                    >
                      <FiUserPlus size={18} />
                      <span>JOIN</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-[#973B00] hover:text-[#BA4D00] transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {(isMenuOpen || isAnimating) && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          style={{ opacity: isMenuReady || isAnimating ? 1 : 0 }}
          onClick={toggleMenu}
        >
          <nav 
            className={`absolute left-0 top-0 h-full w-3/4 max-w-xs bg-white transform transition-transform duration-300 ${
              (isMenuReady && !isAnimating) ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image 
                    src="/logo.png" 
                    alt="Gita Speaks Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-serif text-[#973B00] logo-font">GITA SPEAKS</span>
              </div>
            </div>
            
            <ul className="p-4 space-y-2">
              {[
                { href: '/', label: 'HOME' },
                { href: '/about-us', label: 'ABOUT US' },
                { href: '/chat', label: 'START CHAT' },
                { href: '/pricing', label: 'PRICING' },
                { href: '/contact-us', label: 'CONTACT US' },
              ].map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="block px-4 py-3 text-[#973B00] hover:text-[#BA4D00] hover:bg-amber-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <div className="border-t border-amber-100 my-4"></div>

              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-3 text-[#973B00] hover:text-[#BA4D00] hover:bg-amber-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser size={18} />
                      <span>PROFILE</span>
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-[#973B00] hover:text-[#BA4D00] hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <FiLogOut size={18} />
                      <span>SIGN OUT</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/auth/login"
                      className="flex items-center gap-2 px-4 py-3 text-[#973B00] hover:text-[#BA4D00] hover:bg-amber-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiLogIn size={18} />
                      <span>SIGN IN</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/auth/register"
                      className="flex items-center gap-2 px-4 py-3 text-white bg-[#973B00] hover:bg-[#BA4D00] rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUserPlus size={18} />
                      <span>JOIN</span>
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