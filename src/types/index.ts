export interface ChatMessage {
  id: string;
  text: string;
  type: 'user' | 'bot' | 'system';
  sources?: string[];
  timestamp: number;
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