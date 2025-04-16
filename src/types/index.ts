export interface ChatMessage {
  id: string;
  text: string;
  type: 'user' | 'bot' | 'system';
  sources?: any[];
  timestamp: number;
  isNew?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTime?: number;
  messages: ChatMessage[];
}

export interface ChatResponse {
  success: boolean;
  data: {
    answer: string;
    conversationId?: string;
    sources?: {
      metadata: {
        chapter?: number;
        verse?: number;
        paragraph_id?: number;
      }
    }[];
    metadata?: {
      tokenUsage?: {
        prompt_tokens: number;
        completion_tokens: number;
      }
    }
  };
  error?: {
    message: string;
  };
}

export interface Message {
  id: string;
  text: string;
  type: 'user' | 'bot';
  timestamp: number;
  sources?: {
    metadata: {
      chapter?: number;
      verse?: number;
      paragraph_id?: number;
    }
  }[];
} 