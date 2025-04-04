import React from 'react';

const PdfContent = ({
  pdfContainerRef,
  loading,
  error,
  setError,
  pdfDoc,
  pageCanvases
}) => {
  return (
    <div 
      ref={pdfContainerRef}
      className="flex-grow bg-gray-100 rounded-lg shadow-inner relative overflow-auto flex justify-center"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mb-4"></div>
            <p className="text-gray-700">Loading Bhagavad Gita PDF...</p>
          </div>
        </div>
      )}
      
      {error && !loading && (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center p-6 max-w-md">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-600 font-medium text-lg mb-2">Error</p>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      
      {!pdfDoc && !error && !loading && (
        <div className="flex flex-col items-center justify-center h-full w-full text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl mb-2">Loading Bhagavad Gita PDF</p>
          <p className="text-sm text-gray-400 mb-4">Please wait while we prepare the document</p>
        </div>
      )}
      
      <div className="p-4 w-full" id="pdf-container">
        {!error && pageCanvases.length > 0 && (
          <div className="pdf-pages flex flex-col items-center">
            {pageCanvases.map((canvas, index) => (
              <div key={index} className="page-container mb-8 w-[100%] sm:w-[60%]" id={`page-${index + 1}`}>
                <div className="page-number bg-[#973B00] text-white py-1 px-3 rounded-t text-sm font-medium inline-block">
                  Page {index + 1}
                </div>
                <div 
                  className="canvas-container overflow-hidden"
                  ref={el => {
                    if (el) {
                      // Clear any existing content first
                      el.innerHTML = '';
                      if (canvas) {
                        // Make sure canvas is responsive
                        canvas.style.maxWidth = '100%';
                        canvas.style.height = 'auto';
                        el.appendChild(canvas);
                      }
                    }
                  }}
                ></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfContent; 