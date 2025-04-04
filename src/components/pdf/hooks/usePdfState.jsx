import { useState, useCallback } from 'react';

export const usePdfState = () => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageTextContents, setPageTextContents] = useState([]);
  const [pageCanvases, setPageCanvases] = useState([]);

  // Extract text content from all pages
  const extractTextContent = async (pdfDoc) => {
    const textContents = [];
    
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      try {
        const page = await pdfDoc.getPage(i);
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
  
  // Render all pages
  const renderAllPages = useCallback(async (doc) => {
    const pdfToRender = doc || pdfDoc;
    if (!pdfToRender) return;
    
    try {
      const canvases = [];
      
      // Extract text content from all pages first
      const textContents = await extractTextContent(pdfToRender);
      setPageTextContents(textContents);
      
      // Render each page
      for (let i = 1; i <= pdfToRender.numPages; i++) {
        const page = await pdfToRender.getPage(i);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Set canvas dimensions to match the PDF page with a responsive scale factor
        // Use a smaller scale for mobile devices
        const isMobile = window.innerWidth < 768;
        const scale = isMobile ? 1 : 1.3;
        
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Add data attribute for page number
        canvas.dataset.pageNumber = i;
        canvas.className = 'mx-auto shadow-lg bg-white mb-4';
        
        canvases.push(canvas);
      }
      
      setPageCanvases(canvases);
    } catch (err) {
      console.error('Error rendering pages:', err);
      setError('Failed to render the PDF pages.');
    }
  }, [pdfDoc]);

  // Load PDF.js library
  const loadPdfJs = useCallback(async () => {
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
      loadDefaultPdf();
      
      // Add CSS styles for the search highlight effect
      const style = document.createElement('style');
      style.textContent = `
        @keyframes searchHighlight {
          0% { box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2); }
          50% { box-shadow: 0 0 0 8px rgba(79, 70, 229, 0.4); }
          100% { box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2); }
        }
        
        .search-highlight {
          animation: searchHighlight 2s ease;
        }
        
        .search-result-highlight {
          background-color: rgba(255, 255, 0, 0.4);
          padding: 2px 0;
          border-radius: 2px;
        }
        
        .search-result-active {
          background-color: rgba(255, 165, 0, 0.6);
          padding: 2px 0;
          border-radius: 2px;
        }
      `;
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
  }, []);
  
  // Function to load the default PDF
  const loadDefaultPdf = async () => {
    setError(null);
    setNumPages(null);
    setPdfDoc(null);
    setPageTextContents([]);
    setPageCanvases([]);
    
    setLoading(true);
    
    try {
      // Check if PDF.js is loaded
      if (!window.pdfjsLib) {
        throw new Error('PDF.js library not loaded yet. Please try again.');
      }
      
      // Load the default PDF
      const loadingTask = window.pdfjsLib.getDocument('/bhagavad_gita.pdf');
      const pdf = await loadingTask.promise;
      
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      
      // Render pages immediately after loading the PDF
      await renderAllPages(pdf);
      setLoading(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load the Bhagavad Gita PDF. Please refresh the page or try again later.');
      setLoading(false);
    }
  };

  return {
    pdfDoc,
    numPages,
    loading,
    error,
    setError,
    pageTextContents,
    pageCanvases,
    renderAllPages,
    loadPdfJs
  };
}; 