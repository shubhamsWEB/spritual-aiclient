import { useState, useCallback } from 'react';

export const useSearch = (pdfDoc, pageTextContents) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(null);

  // Parse search query for Bhagavad Gita reference (e.g., "1.1" for Chapter 1, Verse 1)
  const parseGitaReference = (query) => {
    // Check for chapter.verse format (e.g., "1.1", "2.45", etc.)
    const gitaRefRegex = /^(\d+)\.(\d+)$/;
    const match = query.trim().match(gitaRefRegex);
    
    if (match) {
      return {
        isGitaReference: true,
        chapter: parseInt(match[1]),
        verse: parseInt(match[2])
      };
    }
    
    // Check for "Chapter X Verse Y" format
    const textRefRegex = /chapter\s+(\d+)\s+verse\s+(\d+)/i;
    const textMatch = query.trim().match(textRefRegex);
    
    if (textMatch) {
      return {
        isGitaReference: true,
        chapter: parseInt(textMatch[1]),
        verse: parseInt(textMatch[2])
      };
    }
    
    return { isGitaReference: false };
  };

  // Search for specific Gita reference
  const searchGitaReference = useCallback((chapter, verse) => {
    if (!pageTextContents.length) return [];
    
    const results = [];
    const searchPattern = new RegExp(`chapter\\s*${chapter}.*verse\\s*${verse}|${chapter}\\.${verse}`, 'i');
    
    pageTextContents.forEach(page => {
      if (searchPattern.test(page.text)) {
        // Calculate a relevance score based on how closely this matches what we're looking for
        const score = page.text.toLowerCase().includes(`chapter ${chapter}`) && 
                     page.text.toLowerCase().includes(`verse ${verse}`) ? 
                     100 : 80;
        
        results.push({
          page: page.pageNum,
          text: page.text.substring(0, 300) + '...',
          score: score
        });
      }
    });
    
    // Sort by relevance score (highest first)
    return results.sort((a, b) => b.score - a.score);
  }, [pageTextContents]);

  // General text search function
  const searchText = useCallback((query) => {
    if (!pageTextContents.length || !query.trim()) return [];
    
    const results = [];
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    pageTextContents.forEach(page => {
      const pageTextLower = page.text.toLowerCase();
      let matchFound = false;
      let score = 0;
      
      // Check for exact phrase match first (highest score)
      if (pageTextLower.includes(query.toLowerCase())) {
        matchFound = true;
        score = 100;
      } else {
        // Check for individual terms
        const termMatches = searchTerms.filter(term => pageTextLower.includes(term));
        if (termMatches.length > 0) {
          matchFound = true;
          // Score based on percentage of terms matched
          score = Math.round((termMatches.length / searchTerms.length) * 80);
        }
      }
      
      if (matchFound) {
        // Find the position of the match to extract relevant context
        let matchPosition = pageTextLower.indexOf(query.toLowerCase());
        if (matchPosition === -1) {
          // If exact phrase not found, use the first term that matches
          for (const term of searchTerms) {
            const pos = pageTextLower.indexOf(term);
            if (pos !== -1) {
              matchPosition = pos;
              break;
            }
          }
        }
        
        // Extract text around the match position
        let startPos = Math.max(0, matchPosition - 100);
        let endPos = Math.min(page.text.length, matchPosition + 200);
        
        // Adjust to not cut words
        while (startPos > 0 && page.text[startPos] !== ' ') startPos--;
        while (endPos < page.text.length && page.text[endPos] !== ' ') endPos++;
        
        let extractedText = page.text.substring(startPos, endPos);
        if (startPos > 0) extractedText = '...' + extractedText;
        if (endPos < page.text.length) extractedText += '...';
        
        results.push({
          page: page.pageNum,
          text: extractedText,
          score: score
        });
      }
    });
    
    // Sort by relevance score (highest first)
    return results.sort((a, b) => b.score - a.score);
  }, [pageTextContents]);

  // Main search handler
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim() || !pdfDoc || !pageTextContents.length) return;
    
    setSearchLoading(true);
    setSearchResults([]);
    setActiveHighlight(null);
    
    try {
      // Check if the search query is a Gita reference
      const gitaReference = parseGitaReference(searchQuery);
      
      let results = [];
      if (gitaReference.isGitaReference) {
        // Search for specific chapter and verse
        results = searchGitaReference(gitaReference.chapter, gitaReference.verse);
      } else {
        // General text search
        results = searchText(searchQuery);
      }
      
      // Limit results to prevent performance issues
      setSearchResults(results.slice(0, 50));
      
      // If results found, navigate to the first one
      if (results.length > 0) {
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
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery, pdfDoc, pageTextContents, searchGitaReference, searchText]);

  return {
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
  };
}; 