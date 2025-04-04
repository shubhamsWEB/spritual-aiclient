'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

// Dynamically import the PdfViewer component to prevent server-side rendering issues
const PdfViewer = dynamic(
  () => import('../../../components/pdf/PdfViewer'),
  { 
    ssr: false,
    loading: () => <LoadingScreen />
  }
);

// Loading screen component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-amber-50">
    <div className="text-center p-8">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="w-20 h-20 border-4 border-amber-200 border-t-[#973B00] rounded-full animate-spin"></div>
      </div>
      <h2 className="text-2xl font-serif text-[#973B00] mb-4">Loading Bhagavad Gita</h2>
      <p className="text-gray-600">Preparing the sacred text for your spiritual journey...</p>
    </div>
  </div>
);

export default function PDFPage() {
  return (
    <div className="h-screen flex flex-col bg-amber-50">
      {/* Top navigation bar */}
      <div className="bg-[#973B00] text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white hover:text-amber-200 transition-colors"
          >
            <FiArrowLeft size={18} />
            <span className="font-medium">Back to Home</span>
          </Link>
          <h1 className="text-xl font-serif font-bold hidden sm:block">Bhagavad Gita Explorer</h1>
          <Link 
            href="/chat" 
            className="flex items-center text-white bg-amber-700 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors"
          >
            <span>Ask About the Gita</span>
          </Link>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div className="flex-grow">
        <PdfViewer />
      </div>
    </div>
  );
}