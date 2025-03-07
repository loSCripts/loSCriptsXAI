import React, { useRef, useEffect } from 'react';
import { Conversation } from '../types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Bot } from 'lucide-react';

interface ChatContainerProps {
  conversation: Conversation;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  conversation, 
  onSendMessage,
  isLoading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className={`flex-1 ${conversation.messages.length === 0 ? 'flex items-center justify-center' : ''}`}>
          <div className={`w-full max-w-4xl mx-auto ${conversation.messages.length > 0 ? 'py-8' : ''}`}>
            {conversation.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 text-center fade-in slide-up">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mb-4 pulse-on-hover shadow-lg">
                  <Bot size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 dark:text-white">Comment puis-je vous aider aujourd'hui?</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Je suis LoSCriptsX AI, une IA futuriste conçue pour répondre à vos questions et vous assister dans vos tâches.
                </p>
              </div>
            ) : (
              <>
                {conversation.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="py-5 bg-gray-50 dark:bg-gray-800 fade-in">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-md">
                          <Bot size={16} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                          LoSCriptsX AI
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-100"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl mx-auto pb-6">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatContainer;