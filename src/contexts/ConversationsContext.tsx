'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Conversation } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { getConversations, getConversationsMessages, deleteConversation as apiDeleteConversation } from '@/services/api';
interface ConversationsContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  addConversation: (title?: string) => string;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  addMessageToConversation: (conversationId: string, message: any) => void;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  fetchConversationMessages: (conversationId: string) => Promise<void>;
  activeConversationMessages: any[];
  setActiveConversationMessages: (messages: any[]) => void;
  registerBackendConversation: (id: string, title: string) => string;
  removeConversation: (id: string) => void;
  deleteConversation: (id: string) => Promise<boolean>;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [activeConversationMessages, setActiveConversationMessages] = useState<any[]>([]);
  const { isAuthenticated } = useAuth();

  // Fetch conversations when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    } else {
      setIsLoadingConversations(false);
      setConversations([]);
      setCurrentConversationId(null);
    }
  }, [isAuthenticated]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (currentConversationId) {
      fetchConversationMessages(currentConversationId);
    }
  }, [currentConversationId]);

  const fetchConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const response = await getConversations();
      
      if (response?.success && response.data.conversations) {
        setConversations(response.data.conversations);
        
        // Set current conversation to the most recent one if any exist
        if (response.data.conversations.length > 0) {
          // setCurrentConversationId(response.data.conversations[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const addConversation = (title?: string) => {
    const newId = uuidv4();
    const newConversation: Conversation = {
      id: newId,
      title: title || 'New Conversation',
      lastMessageTime: Date.now(),
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
    return newId;
  };

  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, ...updates } : conv
      )
    );
  };

  const addMessageToConversation = (conversationId: string, message: any) => {
    if (conversationId === currentConversationId) {
      setActiveConversationMessages(prev => [...prev, message]);
    }
    
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: message.text.substring(0, 50) + (message.text.length > 50 ? '...' : ''),
            lastMessageTime: message.timestamp
          };
        }
        return conv;
      })
    );
  };

  const fetchConversationMessages = async (conversationId: string) => {
    try {
      setIsLoadingMessages(true);
      const response = await getConversationsMessages(conversationId);
      
      if (response?.success && response.data.messages) {
        setActiveConversationMessages(response.data.messages);
        
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId ? { 
              ...conv, 
              lastMessage: response.data.messages.length > 0 
                ? response.data.messages[response.data.messages.length - 1].text.substring(0, 50) + 
                  (response.data.messages[response.data.messages.length - 1].text.length > 50 ? '...' : '')
                : conv.lastMessage,
              lastMessageTime: response.data.messages.length > 0 
                ? response.data.messages[response.data.messages.length - 1].timestamp 
                : conv.lastMessageTime
            } : conv
          )
        );
      }
    } catch (error) {
      console.error('Failed to fetch conversation messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const registerBackendConversation = (id: string, title: string) => {
    const newConversation: Conversation = {
      id,
      title: title || 'New Conversation',
      lastMessageTime: Date.now(),
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(id);
    return id;
  };

  const removeConversation = (id: string) => {
    setConversations(prevConversations => 
      prevConversations.filter(conversation => conversation.id !== id)
    );
    
    // If the current conversation is being removed, set currentConversationId to null
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      const response = await apiDeleteConversation(id);
      if (response?.success) {
        removeConversation(id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      return false;
    }
  };

  const value = {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    addConversation,
    updateConversation,
    addMessageToConversation,
    isLoadingConversations,
    isLoadingMessages,
    fetchConversationMessages,
    activeConversationMessages,
    setActiveConversationMessages,
    registerBackendConversation,
    removeConversation,
    deleteConversation
  };

  return <ConversationsContext.Provider value={value}>{children}</ConversationsContext.Provider>;
}

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationsProvider');
  }
  return context;
}; 