import React from 'react';
import { Message } from '../types';
import { User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className="py-3 fade-in slide-up">
      <div className={`max-w-3xl mx-auto px-4 sm:px-6 flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <User size={18} className="text-gray-700 dark:text-gray-300" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white">AI</span>
            </div>
          )}
        </div>
        <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
          <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
            {isUser ? 'Vous' : 'LoSCriptsX AI'}
          </div>
          <div className={`prose dark:prose-invert ${isUser ? 'ml-auto' : 'mr-auto'}`} style={{ maxWidth: '80%' }}>
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={`text-gray-700 dark:text-gray-300 mb-1 inline-block ${
                isUser ? 'text-white' : ''
              }`}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;