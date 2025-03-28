import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types';
import { sendChatMessage } from '@/services/api';
import { getRandomWelcomeMessage } from '@/services/messages';
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState({
    prompt: 0,
    completion: 0,
    total: 0
  });

  // Initialize with welcome message
  useEffect(() => {
    // Add system message immediately
    setMessages([
      {
        id: uuidv4(),
        text: "Ask me about the spiritual wisdom in the Bhagavad Gita. You can inquire about life's purpose, duty (dharma), devotion (bhakti), knowledge (jnana), action (karma), and more.",
        type: 'system',
        timestamp: Date.now()
      }
    ]);
    
    // Add bot welcome message after 2 seconds
    const timer = setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: uuidv4(),
          text: getRandomWelcomeMessage(),
          type: 'bot',
          timestamp: Date.now()
        }
      ]);
    }, 1500);
    
    // Clean up timeout if component unmounts
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      text: messageText,
      type: 'user',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await sendChatMessage(messageText);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Unknown error occurred');
      }
      
      // Format source references
      const sourceRefs: string[] = [];
      if (response.data.sources && response.data.sources.length > 0) {
        response.data.sources.forEach((source: any) => {
          if (source.metadata && source.metadata.chapter) {
            if (source.metadata.verse) {
              sourceRefs.push(`Chapter ${source.metadata.chapter}, Verse ${source.metadata.verse}`);
            } else {
              sourceRefs.push(`Chapter ${source.metadata.chapter}`);
            }
          } else if (source.metadata && source.metadata.paragraph_id !== undefined) {
            sourceRefs.push(`Paragraph ${source.metadata.paragraph_id}`);
          }
        });
      }
      const tokensUsed = response.data.metadata.tokenUsage;
      setTokens(prev => ({
        ...prev,
        prompt: prev.prompt + tokensUsed.prompt_tokens,
        completion: prev.completion + tokensUsed.completion_tokens,
        total: prev.total + tokensUsed.prompt_tokens + tokensUsed.completion_tokens
      }));
      // Add bot response
      const botMessage: ChatMessage = {
        id: uuidv4(),
        text: response.data.answer,
        type: 'bot',
        sources: sourceRefs.length > 0 ? sourceRefs : undefined,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        text: 'I apologize, but I encountered an error processing your question. Please try again.',
        type: 'bot',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return {
    messages,
    isLoading, 
    error,
    sendMessage,
    tokens
  };
} 