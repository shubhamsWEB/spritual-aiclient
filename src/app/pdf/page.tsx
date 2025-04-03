'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false to avoid server-side rendering issues
const BhagavadGitaPdfVisualizer = dynamic(
  () => import('../../components/pdf'),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
    </div>
  }
);

export default function PDFPage() {
  return (
    <div className="h-screen">
      <BhagavadGitaPdfVisualizer />
    </div>
  );
}