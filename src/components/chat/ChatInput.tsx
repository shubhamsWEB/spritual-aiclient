import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import { FiSend } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isDisabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  onSendMessage, 
  isLoading, 
  isDisabled = false,
  placeholder
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !isDisabled) {
      onSendMessage(message);
      setMessage('');
      // Focus the textarea after sending
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-50 to-purple-50 p-2 sm:p-3 border-t border-amber-100">
      <div className="flex justify-between w-full">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isDisabled 
            ? "Please sign in to continue..." 
            : placeholder || "Ask about spiritual wisdom..."}
          className={`flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 min-h-[36px] max-h-[120px] resize-none text-sm
            ${isDisabled 
              ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'border-amber-200 focus:ring-amber-500 text-amber-900 bg-white'}`}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          aria-label="Message input"
          id="chatInput"
          disabled={isDisabled}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !message.trim() || isDisabled}
        className={`flex-shrink-0 font-bold rounded-full p-2 sm:p-3
          ${isDisabled 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-[#973B00] hover:bg-[#BA4D00] text-white'}`}
        variant="primary"
        size="sm"
        aria-label={isDisabled ? "Sign in to continue" : isLoading ? "Thinking" : "Send message"}
      >
        {isLoading ? 
          <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" /> : 
          <FiSend className="w-3 h-3 sm:w-4 sm:h-4" />
        }
      </Button>
    </form>
  );
}