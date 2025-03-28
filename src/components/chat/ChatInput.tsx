import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import { FiSend } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
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
          placeholder="Ask about spiritual wisdom..."
          className="flex-grow p-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[36px] max-h-[120px] resize-none text-amber-900 bg-white text-sm"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          aria-label="Message input"
          id="chatInput"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="flex-shrink-0 bg-[#973B00] hover:bg-[#BA4D00] text-white font-bold rounded-full p-2 sm:p-3"
        variant="primary"
        size="sm"
        aria-label={isLoading ? "Thinking" : "Send message"}
      >
        {isLoading ? 
          <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" /> : 
          <FiSend className="w-3 h-3 sm:w-4 sm:h-4" />
        }
      </Button>
    </form>
  );
}