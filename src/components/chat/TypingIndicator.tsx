import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="inline-flex items-center bg-amber-50 border-l-4 border-amber-600 rounded-lg p-2 sm:p-3 max-w-[80%] sm:max-w-[60%] animate-fadeIn border-t border-r border-b border-amber-200">
      <p className="text-amber-800 mr-2 font-serif text-xs sm:text-sm">Divine wisdom flowing</p>
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  );
}