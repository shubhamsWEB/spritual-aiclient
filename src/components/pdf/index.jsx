'use client';

import React, { useState, useEffect, useCallback } from 'react';

const BhagavadGitaPdfVisualizer = () => {
  // All useState hooks must be called in the same order every time
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [highlightRects, setHighlightRects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // States for PDF.js components
  const [pdfLibrary, setPdfLibrary] = useState(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  // Load react-pdf on the client side only
  useEffect(() => {
    const loadPdf = async () => {
      try {
        // Dynamically import react-pdf
        const reactPdf = await import('react-pdf');
        
        // Configure the worker
        reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        
        // Store the entire library
        setPdfLibrary(reactPdf);
        setPdfLoaded(true);
      } catch (error) {
        console.error('Failed to load PDF library:', error);
        setError('Failed to load PDF viewer. Please check console for details.');
      }
    };
    
    loadPdf();
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  }, []);

  const parseQuery = useCallback((query) => {
    // Parse queries like "Chapter 1 Text 10"
    const chapterMatch = query.match(/chapter\s+(\d+)/i);
    const textMatch = query.match(/text\s+(\d+)/i);
    
    return {
      chapter: chapterMatch ? parseInt(chapterMatch[1]) : null,
      text: textMatch ? parseInt(textMatch[1]) : null,
    };
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const { chapter, text } = parseQuery(searchQuery);
      
      // Simulate finding the text in the PDF
      // In a real implementation, you would search through the PDF text content
      const foundPage = chapter === 1 && text === 10 ? 13 : 
                        chapter === 1 && text === 1 ? 2 :
                        chapter === 2 && text === 1 ? 18 : 1;
      
      setSearchResults([{
        page: foundPage,
        highlight: { x: 100, y: 300, width: 400, height: 50 } 
      }]);
      
      // Navigate to the found page
      setPageNumber(foundPage);
      
      // Set highlight rectangles
      setHighlightRects([{ x: 100, y: 300, width: 400, height: 50 }]);
      
      setLoading(false);
    } catch (err) {
      setError('Search failed. Please try again.');
      setLoading(false);
    }
  }, [searchQuery, parseQuery]);

  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Reset states
      setSearchResults([]);
      setHighlightRects([]);
      setPageNumber(1);
      setLoading(true);
    }
  }, []);

  const renderAllPages = useCallback(() => {
    if (!pdfLibrary?.Document || !pdfLibrary?.Page || !file) return null;
    
    return (
      <pdfLibrary.Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(err) => {
          console.error("PDF load error:", err);
          setError("Error loading PDF. Check console for details.");
        }}
        className="shadow-lg"
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div key={`page_${index + 1}`} className="relative mb-4">
            <pdfLibrary.Page 
              pageNumber={index + 1} 
              renderTextLayer={true}
              renderAnnotationLayer={true}
              scale={1.2}
            />
            {searchResults.some(result => result.page === index + 1) && 
              highlightRects.map((rect, rectIndex) => (
                <div
                  key={rectIndex}
                  style={{
                    position: 'absolute',
                    left: `${rect.x}px`,
                    top: `${rect.y}px`,
                    width: `${rect.width}px`,
                    height: `${rect.height}px`,
                    backgroundColor: 'rgba(255, 255, 0, 0.3)',
                    pointerEvents: 'none',
                    border: '2px solid rgba(255, 200, 0, 0.7)',
                    borderRadius: '4px',
                    zIndex: 10
                  }}
                />
              ))
            }
          </div>
        ))}
      </pdfLibrary.Document>
    );
  }, [pdfLibrary, file, numPages, onDocumentLoadSuccess, searchResults, highlightRects]);

  // Extract Document and Page from pdfLibrary
  const Document = pdfLibrary?.Document;
  const Page = pdfLibrary?.Page;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Bhagavad Gita PDF Visualizer</h1>
          <div className="flex w-full md:w-auto">
            <input
              type="text"
              placeholder="e.g., Chapter 1 Text 10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="p-2 rounded-l bg-white text-gray-800 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-900 hover:bg-indigo-800 p-2 rounded-r text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row p-4">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0 md:mr-4">
          <h2 className="text-xl font-semibold mb-4">Options</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload PDF
            </label>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          
          {numPages && (
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Page {pageNumber} of {numPages}
              </p>
              <div className="flex items-center">
                <button
                  onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                  className="bg-indigo-600 text-white p-1 rounded-l disabled:bg-gray-300"
                >
                  ←
                </button>
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageNumber}
                  onChange={(e) => setPageNumber(Math.min(Math.max(1, parseInt(e.target.value) || 1), numPages))}
                  className="w-16 text-center p-1 border border-gray-300"
                />
                <button
                  onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                  disabled={pageNumber >= numPages}
                  className="bg-indigo-600 text-white p-1 rounded-r disabled:bg-gray-300"
                >
                  →
                </button>
              </div>
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Search Results</h3>
              <ul className="space-y-2">
                {searchResults.map((result, index) => (
                  <li key={index} className="p-2 bg-indigo-50 rounded hover:bg-indigo-100 cursor-pointer" onClick={() => setPageNumber(result.page)}>
                    Found on page {result.page}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* PDF Viewer */}
        <div className="flex-grow flex justify-center overflow-auto bg-gray-100 rounded-lg shadow-inner relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">{error}</p>
            </div>
          ) : file && Document && Page ? (
            <div className="relative">
              {renderAllPages()}
            </div>
          ) : !pdfLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF viewer...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl">Please upload a PDF file to begin</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-3 border-t text-center text-gray-600 text-sm">
        <p>Built with React PDF Viewer - Search and highlight text in the Bhagavad Gita PDF</p>
      </footer>
    </div>
  );
};

export default BhagavadGitaPdfVisualizer;