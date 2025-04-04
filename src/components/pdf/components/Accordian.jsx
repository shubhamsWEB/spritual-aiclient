import React, { useState, useEffect, useRef } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import styles from './style.module.css';

/**
 * AccordionItem Component
 * Represents a single chapter accordion with verses nested inside
 */
const AccordionItem = ({ chapter, isExpanded, toggleExpansion, onNavigate }) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const hasVerses = chapter.verses && chapter.verses.length > 0;

  // Measure content height when expanded state or content changes
  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setContentHeight(isExpanded ? scrollHeight : 0);
    }
  }, [isExpanded, hasVerses, chapter.verses?.length]);

  return (
    <div className={styles.accordionItem}>
      {/* Accordion Header */}
      <div 
        className={`${styles.accordionHeader} ${isExpanded ? styles.accordionHeaderActive : ''}`}
        onClick={() => toggleExpansion(chapter.chapterNumber)}
      >
        <button
          className={styles.accordionTitle}
          onClick={(e) => {
            e.stopPropagation(); // Prevent accordion toggle
            onNavigate(chapter);
          }}
        >
          {chapter.title}
        </button>
        <span className={`${styles.accordionChevron} ${isExpanded ? styles.accordionChevronActive : ''}`}>
          <FiChevronRight size={16} />
        </span>
      </div>
      
      {/* Accordion Content with smooth animation */}
      <div 
        className={styles.accordionContent}
        style={{ maxHeight: contentHeight }}
      >
        <div ref={contentRef} className={styles.accordionContentInner}>
          {hasVerses ? (
            <>
              <p className={styles.verseCount}>Verses: {chapter.verses.length}</p>
              <div className={styles.versesGrid}>
                {chapter.verses.map((verse, verseIdx) => (
                  <button
                    key={verseIdx}
                    onClick={() => onNavigate(verse)}
                    className={styles.verseButton}
                    title={verse.title}
                  >
                    {verse.verseNumber || '?'}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.noVerses}>
              No verses found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * BookmarksAccordion Component
 * Renders the full chapters and verses accordion navigation
 */
const BookmarksAccordion = ({ bookmarks, expandedItems, toggleBookmarkExpansion, navigateToBookmark, renderPage, pdfDoc }) => {
  // Navigate to a bookmark
  const handleNavigate = (bookmark) => {
    if (bookmark.pageNumber) {
      renderPage(pdfDoc, bookmark.pageNumber);
    } else {
      navigateToBookmark(bookmark);
    }
  };

  return (
    <div className={styles.accordionContainer}>
      {bookmarks.map((chapter, idx) => (
        <AccordionItem
          key={idx}
          chapter={chapter}
          isExpanded={expandedItems[chapter.chapterNumber] || false}
          toggleExpansion={toggleBookmarkExpansion}
          onNavigate={handleNavigate}
        />
      ))}
    </div>
  );
};

export default BookmarksAccordion;