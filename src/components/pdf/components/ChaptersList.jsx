import React from 'react';

const ChaptersList = ({
  gitaStructure,
  expandedChapters,
  setExpandedChapters,
  setSearchQuery,
  searchGitaReference,
  setSearchResults,
  setSearchLoading,
  setActiveTab
}) => {
  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
      {gitaStructure.map((chapter) => (
        <div key={chapter.chapter} className="mb-2">
          <button
            onClick={() => {
              setExpandedChapters(prev => ({
                ...prev,
                [chapter.chapter]: !prev[chapter.chapter]
              }));
              
              // Navigate to chapter start page
              const pageElement = document.getElementById(`page-${chapter.startPage}`);
              if (pageElement) {
                pageElement.scrollIntoView({ behavior: 'smooth' });
                pageElement.classList.add('search-highlight');
                setTimeout(() => {
                  pageElement.classList.remove('search-highlight');
                }, 2000);
              }
            }}
            className="flex items-center justify-between w-full text-left p-2 bg-amber-50 hover:bg-amber-100 rounded text-[#973B00] font-medium"
          >
            <span>Chapter {chapter.chapter}: {chapter.name}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${expandedChapters[chapter.chapter] ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Verses list - shown when chapter is expanded */}
          {expandedChapters[chapter.chapter] && (
            <div className="pl-4 mt-1 space-y-1">
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: chapter.verses }, (_, i) => i + 1).map((verse) => (
                  <button
                    key={verse}
                    onClick={() => {
                      // Search for this specific verse
                      setSearchQuery(`${chapter.chapter}.${verse}`);
                      const gitaReference = {
                        isGitaReference: true,
                        chapter: chapter.chapter,
                        verse: verse
                      };
                      
                      setSearchLoading(true);
                      setSearchResults([]);
                      
                      try {
                        const results = searchGitaReference(gitaReference.chapter, gitaReference.verse);
                        
                        // If results found, navigate to the first one
                        if (results.length > 0) {
                          setSearchResults(results.slice(0, 20));
                          setActiveTab('search'); // Switch to search results tab
                          setTimeout(() => {
                            const pageElement = document.getElementById(`page-${results[0].page}`);
                            if (pageElement) {
                              pageElement.scrollIntoView({ behavior: 'smooth' });
                              pageElement.classList.add('search-highlight');
                              setTimeout(() => {
                                pageElement.classList.remove('search-highlight');
                              }, 2000);
                            }
                          }, 100);
                        } else {
                          // If no exact match, navigate to chapter start page
                          const pageElement = document.getElementById(`page-${chapter.startPage}`);
                          if (pageElement) {
                            pageElement.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                      } catch (err) {
                        console.error('Search error:', err);
                      } finally {
                        setSearchLoading(false);
                      }
                    }}
                    className="p-1 text-sm bg-white hover:bg-indigo-50 border border-gray-200 rounded text-gray-700"
                  >
                    {verse}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChaptersList; 