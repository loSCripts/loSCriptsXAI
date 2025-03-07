import { Conversation, Message } from './types';

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format date to display in conversation list
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Get conversation title from first message or use default
export const getConversationTitle = (messages: Message[]): string => {
  if (messages.length === 0) return 'Nouvelle conversation';
  
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'Nouvelle conversation';
  
  const title = firstUserMessage.content.slice(0, 30);
  return title.length < firstUserMessage.content.length ? `${title}...` : title;
};

// Mock AI response
export const getAIResponse = async (message: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = [
    "Je suis une IA futuriste conçue pour vous aider. Comment puis-je vous assister aujourd'hui?",
    "Votre question est intéressante. Laissez-moi y réfléchir un instant...",
    "D'après mes analyses, je peux vous proposer plusieurs solutions à ce problème.",
    "Je n'ai pas toutes les informations nécessaires pour répondre avec précision. Pourriez-vous me donner plus de détails?",
    "Cette technologie est encore en développement, mais je peux vous donner un aperçu de son fonctionnement actuel.",
    "Excellente question! Voici ce que je peux vous dire à ce sujet...",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Create a new conversation
export const createNewConversation = (existingConversations: Conversation[] = []): Conversation => {
  // Trouver le plus grand numéro de conversation existant
  const conversationNumbers = existingConversations
    .map(conv => {
      const match = conv.title.match(/^Conversation (\d+)$/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => !isNaN(num));

  const nextNumber = conversationNumbers.length > 0 
    ? Math.max(...conversationNumbers) + 1 
    : 1;

  return {
    id: generateId(),
    title: `Conversation ${nextNumber}`,
    messages: [],
    createdAt: new Date(),
    order: existingConversations.length,
  };
};

// Réorganiser les conversations
export const reorderConversations = (conversations: Conversation[], startIndex: number, endIndex: number): Conversation[] => {
  const result = Array.from(conversations);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  
  // Mettre à jour l'ordre de toutes les conversations
  return result.map((conv, index) => ({
    ...conv,
    order: index
  }));
};