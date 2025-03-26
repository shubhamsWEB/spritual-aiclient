export interface ChatMessage {
  id: string;
  text: string;
  type: 'user' | 'bot' | 'system';
  sources?: string[];
  timestamp: number;
}

export interface ChatResponse {
  success: boolean;
  data: {
    answer: string;
    sources?: {
      metadata: {
        chapter?: number;
        verse?: number;
        paragraph_id?: number;
      }
    }[];
  };
  error?: {
    message: string;
  };
} 