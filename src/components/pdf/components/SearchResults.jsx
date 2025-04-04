import React from 'react';

const SearchResults = ({ 
  searchResults, 
  searchQuery, 
  activeHighlight, 
  setActiveHighlight 
}) => {
  if (searchResults.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No search results to display.</p>
        <p className="text-sm mt-2">Try searching for a chapter or verse using the search box above.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
      <ul className="space-y-2">
        {searchResults.map((result, index) => (
          <li 
            key={index} 
            className={`p-2 rounded hover:bg-indigo-100 cursor-pointer ${
              activeHighlight === index ? 'bg-indigo-100 border-l-4 border-indigo-600' : 'bg-indigo-50'
            }`}
            onClick={() => {
              setActiveHighlight(index);
              const pageElement = document.getElementById(`page-${result.page}`);
              if (pageElement) {
                pageElement.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the found page
                pageElement.classList.add('search-highlight');
                setTimeout(() => {
                  pageElement.classList.remove('search-highlight');
                }, 2000);
              }
            }}
          >
            <p className="font-medium flex items-center">
              <span className="inline-block bg-[#973B00] text-white text-xs font-bold mr-2 px-2 py-1 rounded">
                Page {result.page}
              </span>
              <span className="text-sm">
                {result.score > 80 ? "Exact Match" : result.score > 50 ? "Good Match" : "Partial Match"}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-3">
              {result.text.split(new RegExp(`(${searchQuery.split(' ').join('|')})`, 'gi')).map((part, i) => {
                const isMatch = searchQuery.split(' ').some(term => 
                  part.toLowerCase() === term.toLowerCase()
                );
                return isMatch 
                  ? <span key={i} className="bg-yellow-200 font-medium">{part}</span> 
                  : <span key={i}>{part}</span>;
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults; 