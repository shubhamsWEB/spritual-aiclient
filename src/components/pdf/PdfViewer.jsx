import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown, FiX, FiBook, FiMenu, FiMaximize, FiMinimize } from 'react-icons/fi';
import BookmarksAccordion from './components/Accordian';

// Optional: Define a custom CSS class for the accordion animation
const accordionStyles = `
  .accordion-content {
    transition: height 0.3s ease-in-out;
    overflow: hidden;
  }
  
  .accordion-header-active {
    background-color: #fef3c7;
    border-left: 3px solid #973B00;
  }
  
  .accordion-chevron {
    transition: transform 0.3s ease;
  }
  
  .accordion-chevron-active {
    transform: rotate(90deg);
  }
  
  /* Fix for page scrolling */
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }
`;

const PdfViewer = () => {
  // State Management
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageTextContents, setPageTextContents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(calculateScale());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [activeTab, setActiveTab] = useState('bookmarks');
  
  // State for PDF bookmarks
  const [bookmarks, setBookmarks] = useState([]);
  
  const pdfContainerRef = useRef(null);

  // Helper function to calculate appropriate scale based on screen width
  function calculateScale() {
    const width = window.innerWidth;
    
    if (width < 640) { // Mobile screens
      return 0.5;
    } else if (width < 768) { // Small tablets
      return 0.65;
    } else if (width < 1024) { // Larger tablets
      return 0.75;
    } else {
      return 0.85; // Desktop (original scale)
    }
  }
  
  // Add resize listener to update scale when window is resized
  useEffect(() => {
    const handleResize = () => {
      setScale(calculateScale());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load PDF.js library
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        // We need to load PDF.js script dynamically
        const pdfJsScript = document.createElement('script');
        pdfJsScript.src = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
        pdfJsScript.async = true;
        
        // Create a promise that resolves when the script is loaded
        const scriptLoadPromise = new Promise((resolve, reject) => {
          pdfJsScript.onload = resolve;
          pdfJsScript.onerror = reject;
        });
        
        document.body.appendChild(pdfJsScript);
        
        // Wait for the script to load
        await scriptLoadPromise;
        
        // Initialize PDF.js worker
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
          
        // Now that PDF.js is loaded, load the PDF
        loadPdf();
        
        // Add custom accordion styles
        const style = document.createElement('style');
        style.textContent = accordionStyles;
        document.head.appendChild(style);
        
        // Cleanup
        return () => {
          document.body.removeChild(pdfJsScript);
          document.head.removeChild(style);
        };
      } catch (err) {
        console.error('Failed to load PDF.js:', err);
        setError('Failed to load PDF viewer library. Please try again later.');
      }
    };
    
    loadPdfJs();
  }, []);

  // Load PDF
  const loadPdf = async () => {
    setError(null);
    setNumPages(null);
    setPdfDoc(null);
    setPageTextContents([]);
    setBookmarks([]);
    
    setLoading(true);
    
    try {
      // Check if PDF.js is loaded
      if (!window.pdfjsLib) {
        throw new Error('PDF.js library not loaded yet. Please try again.');
      }
      
      // Load the PDF
      const loadingTask = window.pdfjsLib.getDocument('/bhagavad_gita.pdf');
      const pdf = await loadingTask.promise;
      
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      
      // Extract text content from all pages
      const textContents = await extractTextContent(pdf);
      setPageTextContents(textContents);
      
      // Extract bookmarks/outline from PDF
      try {
        const outline = await pdf.getOutline();
        if (outline && outline.length > 0) {
          console.log('PDF Bookmarks:', outline);
          
          // Process the outline to get structured bookmarks
          const processedOutline = await processOutline(pdf, outline);
          setBookmarks(processedOutline);
        } else {
          console.warn('No bookmarks found in PDF');
        }
      } catch (outlineErr) {
        console.error('Error extracting bookmarks:', outlineErr);
      }
      
      // Render current page
      await renderPage(pdf, currentPage);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load the Bhagavad Gita PDF. Please refresh the page or try again later.');
      setLoading(false);
    }
  };

  // Process PDF outline (bookmarks) to resolve page numbers and extract chapter/verse info
  const processOutline = async (pdf, outline) => {
    const processEntry = async (entry) => {
      // Create a copy of the entry to avoid mutating the original
      const processedEntry = { ...entry };
      
      // Parse title to extract chapter and verse information
      let title = entry.title || '';
      
      // Extract chapter information
      const chapterRegex = /Chapter\s+(\d+)(?:[^\d]+(.+))?/i;
      const chapterMatch = title.match(chapterRegex);
      
      if (chapterMatch) {
        processedEntry.isChapter = true;
        processedEntry.chapterNumber = parseInt(chapterMatch[1]);
        processedEntry.chapterTitle = chapterMatch[2] || '';
        processedEntry.type = 'chapter';
      }
      
      // Extract verse information
      const verseRegex = /Verse\s+(\d+)/i;
      const verseMatch = title.match(verseRegex);
      
      if (verseMatch) {
        processedEntry.isVerse = true;
        processedEntry.verseNumber = parseInt(verseMatch[1]);
        processedEntry.type = 'verse';
      }
      
      // Resolve the destination to a page number
      try {
        if (entry.dest) {
          if (typeof entry.dest === 'string') {
            // Named destination that needs resolution
            try {
              const destination = await pdf.getDestination(entry.dest);
              if (destination) {
                const ref = destination[0]; // First element is the page reference
                const pageNumber = await pdf.getPageIndex(ref);
                processedEntry.pageNumber = pageNumber + 1; // +1 because PDF.js uses 0-based indexing
              }
            } catch (err) {
              console.error('Error resolving named destination:', err);
            }
          } else if (Array.isArray(entry.dest)) {
            // Direct destination array
            try {
              const ref = entry.dest[0]; // First element is the page reference
              const pageNumber = await pdf.getPageIndex(ref);
              processedEntry.pageNumber = pageNumber + 1; // +1 because PDF.js uses 0-based indexing
            } catch (err) {
              console.error('Error resolving array destination:', err);
            }
          }
        } else if (entry.url) {
          // Handle URL-based destinations (if any)
          processedEntry.isExternalLink = true;
        }
      } catch (destErr) {
        console.error('Error processing destination:', destErr);
      }
      
      // Process children recursively
      if (entry.items && entry.items.length > 0) {
        const processedItems = [];
        for (const item of entry.items) {
          const processedItem = await processEntry(item);
          processedItems.push(processedItem);
        }
        processedEntry.items = processedItems;
      } else {
        processedEntry.items = [];
      }
      
      return processedEntry;
    };
    
    // Process all root-level entries
    const result = [];
    for (const entry of outline) {
      const processedEntry = await processEntry(entry);
      result.push(processedEntry);
    }
    
    return result;
  };

  // Extract text content from all pages
  const extractTextContent = async (pdf) => {
    const textContents = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const strings = textContent.items.map(item => item.str);
        const pageText = strings.join(' ');
        
        textContents.push({
          pageNum: i,
          text: pageText,
          items: textContent.items
        });
      } catch (err) {
        console.error(`Error extracting text from page ${i}:`, err);
      }
    }
    
    return textContents;
  };

  // Render specific page
  const renderPage = async (doc, pageNumber) => {
    try {
      const page = await doc.getPage(pageNumber);
      
      // Calculate viewport to fit within container width
      const containerWidth = pdfContainerRef.current ? pdfContainerRef.current.clientWidth - 32 : window.innerWidth - 32; // Accounting for padding
      const viewport = page.getViewport({ scale: 1.0 }); // Get original viewport
      
      // Calculate scale to fit width, but with a minimum scale
      const widthScale = containerWidth / viewport.width;
      
      // Set minimum scale for mobile to ensure readability
      const minimumScale = window.innerWidth < 640 ? 0.7 : 0.5;
      
      // Use the most appropriate scale:
      // - User's chosen scale if it's larger than minimum
      // - Width-fitting scale if it works well
      // - Minimum scale as a fallback
      const finalScale = Math.max(minimumScale, Math.min(scale, widthScale));
      
      // Create adjusted viewport with calculated scale
      const scaledViewport = page.getViewport({ scale: finalScale });
      
      // Create a canvas for the page
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      
      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };
      
      await page.render(renderContext).promise;
      
      // Add data attribute for page number
      canvas.dataset.pageNumber = pageNumber;
      // Add overflow-x-auto to parent container to allow horizontal scrolling if needed
      canvas.className = 'mx-auto shadow-lg bg-white';
      
      // Clear existing canvases and add the new one
      const container = document.getElementById('pdf-content');
      if (container) {
        container.innerHTML = '';
        container.appendChild(canvas);
        // Ensure parent container allows horizontal scrolling if needed
        container.className = 'w-full overflow-x-auto';
      }
      
      // Update current page
      setCurrentPage(pageNumber);
      
      // Scroll to top of container
      if (pdfContainerRef.current) {
        pdfContainerRef.current.scrollTop = 0;
      }
    } catch (err) {
      console.error('Error rendering page:', err);
      setError('Failed to render the PDF page.');
    }
  };

  // Navigate to bookmark
  const navigateToBookmark = (bookmark) => {
    // If we have a resolved page number, use it directly
    if (bookmark.pageNumber) {
      renderPage(pdfDoc, bookmark.pageNumber);
      return;
    }
    
    // Otherwise try to resolve the destination
    try {
      // If bookmark has explicit destination, try to resolve it
      if (bookmark.dest) {
        navigateToDestination(bookmark.dest);
      } else if (bookmark.url) {
        // Handle external URLs if needed
        window.open(bookmark.url, '_blank');
      } else {
        console.warn('Bookmark has no valid destination or page number:', bookmark);
      }
    } catch (err) {
      console.error('Error navigating to bookmark:', err);
    }
  };

  // Navigate to a specific destination in the PDF (for bookmarks)
  const navigateToDestination = async (dest) => {
    if (!pdfDoc || !dest) return;
    
    try {
      let pageNumber = null;
      
      if (typeof dest === 'string') {
        // Named destination
        const destArray = await pdfDoc.getDestination(dest);
        if (destArray && destArray.length > 0) {
          const ref = destArray[0]; // First element is the page reference
          pageNumber = await pdfDoc.getPageIndex(ref);
          pageNumber += 1; // +1 because PDF.js uses 0-based indexing
        }
      } else if (Array.isArray(dest)) {
        // Explicit destination array
        const ref = dest[0]; // First element is the page reference
        pageNumber = await pdfDoc.getPageIndex(ref);
        pageNumber += 1; // +1 because PDF.js uses 0-based indexing
      }
      
      if (pageNumber) {
        renderPage(pdfDoc, pageNumber);
      } else {
        console.warn('Could not resolve destination to a page number:', dest);
      }
    } catch (err) {
      console.error('Error navigating to destination:', err, dest);
    }
  };

  // Navigate to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      renderPage(pdfDoc, currentPage - 1);
    }
  };

  // Navigate to next page
  const nextPage = () => {
    if (pdfDoc && currentPage < pdfDoc.numPages) {
      renderPage(pdfDoc, currentPage + 1);
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    const element = document.documentElement;
    
    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return; // Skip if user is typing in an input field
      
      if (e.key === 'ArrowLeft') {
        prevPage();
      } else if (e.key === 'ArrowRight') {
        nextPage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage]);

  // Re-render page when scale changes
  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(pdfDoc, currentPage);
    }
  }, [scale]);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toggle bookmark expansion with animation handling
  const toggleBookmarkExpansion = (chapterNum) => {
    setExpandedItems(prev => ({
      ...prev,
      [chapterNum]: !prev[chapterNum]
    }));
  };

  // Organize bookmarks by chapter and verses
  const organizedBookmarks = React.useMemo(() => {
    // Group by chapters
    const chapterMap = new Map();
    
    // Helper to recursively find chapters and verses in the bookmark tree
    const processBookmarks = (bookmarks, parentChapter = null) => {
      bookmarks.forEach(bookmark => {
        if (bookmark.isChapter) {
          // This is a chapter
          const chapterNum = bookmark.chapterNumber;
          chapterMap.set(chapterNum, {
            ...bookmark,
            verses: [],
            // Add any existing verses if we've seen this chapter before
            ...(chapterMap.get(chapterNum) || {})
          });
          
          // Process children with this chapter as parent
          if (bookmark.items && bookmark.items.length > 0) {
            processBookmarks(bookmark.items, chapterNum);
          }
        } else if (bookmark.isVerse && parentChapter) {
          // This is a verse belonging to a parent chapter
          const chapter = chapterMap.get(parentChapter);
          if (chapter) {
            chapter.verses.push(bookmark);
          }
        } else if (bookmark.items && bookmark.items.length > 0) {
          // Process any children
          processBookmarks(bookmark.items, parentChapter);
        }
      });
    };
    
    processBookmarks(bookmarks);
    
    // Convert map to array and sort by chapter number
    return Array.from(chapterMap.entries())
      .map(([key, value]) => ({
        ...value,
        chapterNumber: key,
        // Sort verses by verse number
        verses: value.verses.sort((a, b) => (a.verseNumber || 0) - (b.verseNumber || 0))
      }))
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }, [bookmarks]);


  return (
    <div className="h-full w-screen flex flex-col bg-amber-50 overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden h-[500px]">
        {/* Sidebar */}
        <aside 
          className={`bg-white shadow-md z-10 transition-all duration-300 ${
            isSidebarOpen ? 'w-64 md:w-80 opacity-100' : 'w-12 opacity-100'
          } overflow-hidden h-full relative`}
        >
          <div className={`p-4 h-full flex flex-col ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#973B00]">Bhagavad Gita</h2>
              <p className="text-sm text-gray-600">{numPages ? `${numPages} pages` : 'Loading...'}</p>
            </div>
            
            {/* Bookmarks Content */}
            <div className="overflow-y-auto flex-grow h-[500px]">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin h-6 w-6 border-2 border-[#973B00] border-t-transparent rounded-full"></div>
                  <span className="ml-2 text-gray-600">Loading bookmarks...</span>
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No bookmarks found in PDF.</p>
                  <p className="text-sm mt-2">The PDF may not contain bookmark metadata.</p>
                </div>
              ) : organizedBookmarks.length > 0 ? (
                // Using the improved accordion component
                <BookmarksAccordion
                  bookmarks={organizedBookmarks}
                  expandedItems={expandedItems}
                  toggleBookmarkExpansion={toggleBookmarkExpansion}
                  navigateToBookmark={navigateToBookmark}
                  renderPage={renderPage}
                  pdfDoc={pdfDoc}
                />
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((bookmark, index) => (
                    <div key={index} className={`ml-[calc(8px*${bookmark.level})]`}>
                      <button
                        onClick={() => {
                          toggleBookmarkExpansion(index);
                          navigateToBookmark(bookmark);
                        }}
                        className={`text-sm p-2 w-full text-left hover:bg-amber-50 rounded-md transition-colors flex items-center justify-between ${
                          bookmark.isChapter ? 'font-medium text-[#973B00]' : ''
                        }`}
                      >
                        <span className="truncate text-[#973B00]">{bookmark.title}</span>
                        {bookmark.items && bookmark.items.length > 0 && (
                          <span className={`transform transition-transform text-[#973B00] ${expandedItems[index] ? 'rotate-90' : ''}`}>
                            <FiChevronRight size={16} />
                          </span>
                        )}
                      </button>
                      
                      {expandedItems[index] && bookmark.items && bookmark.items.length > 0 && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-amber-200 pl-2">
                          {bookmark.items.map((subBookmark, subIndex) => (
                            <button
                              key={`${index}-${subIndex}`}
                              onClick={() => navigateToBookmark(subBookmark)}
                              className={`text-sm p-1 w-full text-left hover:bg-amber-50 rounded-md transition-colors text-amber-500 ${
                                subBookmark.isVerse ? 'text-gray-700' : ''
                              }`}
                            >
                              {subBookmark.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar toggle button attached to the sidebar */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`absolute top-4 ${isSidebarOpen ? 'right-2 translate-x-1/2' : 'right-1'} transform p-3 bg-white rounded-full shadow-lg border border-[#973B00] text-[#973B00] hover:bg-amber-50 transition-colors z-20`}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <FiChevronLeft size={22} /> : <FiChevronRight size={22} />}
          </button>
        </aside>

        {/* PDF Content Area */}
        <div 
          ref={pdfContainerRef}
          className="flex-1 overflow-y-auto bg-gray-100 p-4 relative h-full"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full w-full">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#973B00] mb-4"></div>
                <p className="text-gray-700">Loading Bhagavad Gita PDF...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-md">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-600 font-medium text-lg mb-2">Error</p>
                <p className="text-gray-600">{error}</p>
                <button 
                  onClick={() => loadPdf()} 
                  className="mt-4 bg-[#973B00] text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full w-full flex flex-col items-center relative overflow-hidden">
              {/* PDF Content */}
              <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full mx-auto overflow-y-auto" style={{ maxHeight: "calc(100vh - 100px)" }}>
                <div className="mb-2 flex justify-between items-center">
                  <span className="bg-[#973B00] text-white py-1 px-3 rounded text-sm font-medium">
                    Page {currentPage} of {numPages}
                  </span>
                  
                  <div className="flex items-center">
                    <button 
                      onClick={() => setScale(Math.max(0.8, scale - 0.1))}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      title="Zoom out"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <span className="text-xs mx-1 text-[#973B00]">{Math.round(scale * 100)}%</span>
                    
                    <button 
                      onClick={() => setScale(Math.min(2, scale + 0.1))}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      title="Zoom in"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={toggleFullscreen}
                      className="ml-2 p-1 text-gray-600 hover:bg-gray-100 rounded"
                      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                      {isFullscreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
                    </button>
                  </div>
                </div>
                
                <div id="pdf-content" className="w-full overflow-x-auto flex justify-center"></div>
              </div>
              
              {/* PDF Page Navigation */}
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg py-2 px-4 flex items-center z-10">
                <button
                  onClick={prevPage}
                  disabled={currentPage <= 1}
                  className="p-1 text-[#973B00] hover:bg-amber-100 rounded-full disabled:opacity-30 transition-colors mr-2"
                  title="Previous page"
                >
                  <FiChevronLeft size={24} />
                </button>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage >= numPages}
                  className="p-1 text-[#973B00] hover:bg-amber-100 rounded-full disabled:opacity-30 transition-colors"
                  title="Next page"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;