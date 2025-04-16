export const splitMessageIntoParts = (message: string): string[] => {
    // Only split bot messages, return user messages as is
    if (!message) return [];
    
    const sentences = message.split(/[.!?]/).filter(sentence => sentence.trim().length > 0);
    const parts: string[] = [];
    let currentPart: string[] = [];
    
    sentences.forEach(sentence => {
      currentPart.push(sentence);
      
      // When we reach 3 sentences, add the part and reset
      if (currentPart.length === 4) {
        parts.push(currentPart.join('.') + '.');
        currentPart = [];
      }
    });
    
    // Add any remaining sentences as the last part
    if (currentPart.length > 0) {
      parts.push(currentPart.join('.') + '.');
    }
    
    return parts.length > 0 ? parts : [message];
  };