'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PdfContent from './components/PdfContent';
import { usePdfState } from './hooks/usePdfState';
import { useSearch } from './hooks/useSearch';
import { gitaStructure } from './data/gitaStructure';

const PdfViewer = () => {
  const {
    pdfDoc, 
    numPages, 
    loading, 
    error, 
    setError,
    pageTextContents, 
    pageCanvases, 
    renderAllPages,
    loadPdfJs
  } = usePdfState();

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    searchLoading,
    setSearchLoading,
    activeHighlight,
    setActiveHighlight,
    handleSearch,
    searchGitaReference,
    parseGitaReference
  } = useSearch(pdfDoc, pageTextContents);

  const [activeTab, setActiveTab] = useState('chapters');
  const [expandedChapters, setExpandedChapters] = useState({});
  const pdfContainerRef = useRef(null);

  // Load PDF.js library
  useEffect(() => {
    loadPdfJs();
  }, [loadPdfJs]);

  // Add window resize handler to adjust PDF scale
  useEffect(() => {
    const handleResize = () => {
      if (pdfDoc) {
        // Re-render pages with appropriate scale when window is resized
        renderAllPages(pdfDoc);
      }
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pdfDoc, renderAllPages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        pdfDoc={pdfDoc}
        loading={loading}
        searchLoading={searchLoading}
      />

      <main className="flex-grow flex flex-col md:flex-row p-4 overflow-hidden">
        <Sidebar
          pdfDoc={pdfDoc}
          numPages={numPages}
          loading={loading}
          searchLoading={searchLoading}
          searchResults={searchResults}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          expandedChapters={expandedChapters}
          setExpandedChapters={setExpandedChapters}
          gitaStructure={gitaStructure}
          activeHighlight={activeHighlight}
          setActiveHighlight={setActiveHighlight}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchGitaReference={searchGitaReference}
          pdfContainerRef={pdfContainerRef}
          setSearchResults={setSearchResults}
          setSearchLoading={setSearchLoading}
        />

        <PdfContent
          pdfContainerRef={pdfContainerRef}
          loading={loading}
          error={error}
          setError={setError}
          pdfDoc={pdfDoc}
          pageCanvases={pageCanvases}
        />
      </main>
    </div>
  );
};

export default PdfViewer; 