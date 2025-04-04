import React from 'react';
import ChaptersList from './ChaptersList';
import SearchResults from './SearchResults';

const Sidebar = ({
  pdfDoc,
  numPages,
  loading,
  searchLoading,
  searchResults,
  activeTab,
  setActiveTab,
  expandedChapters,
  setExpandedChapters,
  gitaStructure,
  activeHighlight,
  setActiveHighlight,
  searchQuery,
  setSearchQuery,
  searchGitaReference,
  pdfContainerRef,
  setSearchResults,
  setSearchLoading
}) => {
  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0 md:mr-4 flex flex-col overflow-hidden">
      <div className="mb-4">
        <p className="text-gray-700 text-sm font-bold mb-2">
          Bhagavad Gita PDF
        </p>
        <p className="text-xs text-gray-500">
          This viewer is displaying the Bhagavad Gita PDF from our collection.
        </p>
      </div>
      
      {pdfDoc && numPages && (
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            Total Pages: {numPages}
          </p>
          <div className="flex items-center">
            <button
              onClick={() => {
                const container = pdfContainerRef.current;
                if (container) container.scrollTop = 0;
              }}
              disabled={loading || searchLoading}
              className="bg-[#973B00] text-white px-3 py-1 rounded mr-2 disabled:bg-gray-300"
            >
              Top
            </button>
            <button
              onClick={() => {
                // Jump to a specific page by ID
                const pageNumber = prompt('Enter page number to jump to:');
                const pageNum = parseInt(pageNumber);
                if (pageNum && pageNum >= 1 && pageNum <= numPages) {
                  const pageElement = document.getElementById(`page-${pageNum}`);
                  if (pageElement) {
                    pageElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              disabled={loading || searchLoading}
              className="bg-[#973B00] text-white px-3 py-1 rounded disabled:bg-gray-300"
            >
              Jump to Page
            </button>
          </div>
        </div>
      )}
      
      {/* Tab Navigation for Search Results and Chapters */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'chapters' 
                ? 'border-b-2 border-[#973B00] text-[#973B00]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Chapters & Verses
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'search' 
                ? 'border-b-2 border-[#973B00] text-[#973B00]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Search Results {searchResults.length > 0 ? `(${searchResults.length})` : ''}
          </button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      <div className="overflow-y-auto flex-grow">
        {activeTab === 'chapters' && (
          <ChaptersList 
            gitaStructure={gitaStructure}
            expandedChapters={expandedChapters}
            setExpandedChapters={setExpandedChapters}
            setSearchQuery={setSearchQuery}
            searchGitaReference={searchGitaReference}
            setSearchResults={setSearchResults}
            setSearchLoading={setSearchLoading}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === 'search' && (
          <SearchResults 
            searchResults={searchResults}
            searchQuery={searchQuery}
            activeHighlight={activeHighlight}
            setActiveHighlight={setActiveHighlight}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar; 