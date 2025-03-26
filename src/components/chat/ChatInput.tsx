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
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-purple-50 p-2 border-t border-amber-100">
      <div className="flex justify-between w-full">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about spiritual wisdom..."
          className="flex-grow p-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[40px] max-h-[180px] resize-none text-amber-900 bg-white"
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
        className="flex-shrink-0 bg-[#973B00] hover:bg-[#BA4D00] text-white font-bold rounded-full"
        variant="primary"
        size="md"
        aria-label={isLoading ? "Thinking" : "Send message"}
      >
        {isLoading ? 
          <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" /> : 
          <FiSend className="w-4 h-4" />
        }
      </Button>
    </form>
  );
} 