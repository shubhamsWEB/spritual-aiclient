import React from 'react';
import Link from 'next/link';

const Header = ({ 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  pdfDoc, 
  loading, 
  searchLoading 
}) => {
  return (
    <header className="bg-amber-50 text-white p-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold mb-4 md:mb-0 text-[#973B00] logo-font">GITA GUIDE</h1>
        </Link>
        <div className="flex w-full md:w-auto">
          <input
            type="text"
            placeholder="e.g., Chapter 1 Verse 10 or any text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="p-2 rounded-l bg-white text-[#973B00] w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#973B00]"
            disabled={!pdfDoc || loading || searchLoading}
          />
          <button
            onClick={handleSearch}
            disabled={!pdfDoc || loading || searchLoading || !searchQuery.trim()}
            className="bg-[#973B00] hover:bg-[#BA4D00] p-2 rounded-r text-white focus:outline-none focus:ring-2 focus:ring-[#973B00] disabled:bg-[#973B00] disabled:cursor-not-allowed"
          >
            {searchLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching
              </span>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 