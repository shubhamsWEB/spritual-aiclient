'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';

const NAVIGATION_ITEMS = [
  { href: '/', label: 'HOME' },
  { href: '/about-us', label: 'ABOUT US' },
  { href: '/chat', label: 'START CHAT' },
  { href: '/pricing', label: 'PRICING' },
  // { href: '/contact-us', label: 'CONTACT US' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const Logo = () => (
    <Link href="/" className="flex items-center gap-2 group">
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
  );

  const AuthButtons = ({ isMobile = false }) => {
    const baseStyles = isMobile
      ? "flex items-center gap-2 w-full px-4 py-3 rounded-lg transition-colors"
      : "flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300";

    const handleClick = (action?: () => void) => {
      if (isMobile) setIsMenuOpen(false);
      if (action) action();
    };

    return isAuthenticated ? (
      <>
        <li>
          <Link 
            href="/profile"
            className={`${baseStyles} text-[#973B00] hover:text-[#BA4D00] ${isMobile ? 'hover:bg-amber-50' : ''}`}
            onClick={() => handleClick()}
          >
            <FiUser size={18} />
            <span>PROFILE</span>
          </Link>
        </li>
        <li>
          <button 
            onClick={() => handleClick(logout)}
            className={`${baseStyles} text-[#973B00] hover:text-[#BA4D00] ${
              isMobile ? 'hover:bg-amber-50' : 'border border-[#973B00] hover:border-[#BA4D00]'
            }`}
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
            className={`${baseStyles} text-[#973B00] hover:text-[#BA4D00] ${
              isMobile ? 'hover:bg-amber-50' : 'border border-[#973B00] hover:border-[#BA4D00]'
            }`}
            onClick={() => handleClick()}
          >
            <FiLogIn size={18} />
            <span>SIGN IN</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/auth/register"
            className={`${baseStyles} text-white bg-[#973B00] hover:bg-[#BA4D00]`}
            onClick={() => handleClick()}
          >
            <FiUserPlus size={18} />
            <span>JOIN</span>
          </Link>
        </li>
      </>
    );
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-amber-50'
        }`}
      >
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center h-20">
            <Logo />
            
            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex items-center gap-8">
                {NAVIGATION_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className="relative text-[#973B00] hover:text-[#BA4D00] font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#BA4D00] after:transition-all hover:after:w-full"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <AuthButtons />
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-[#973B00] hover:text-[#BA4D00] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden transition-all duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div 
          className={`fixed left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-amber-100">
              <Logo />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <ul className="p-4 space-y-2">
                {NAVIGATION_ITEMS.map((item) => (
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
                <div className="border-t border-amber-100 my-4" />
                <AuthButtons isMobile />
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-20" />
    </>
  );
}