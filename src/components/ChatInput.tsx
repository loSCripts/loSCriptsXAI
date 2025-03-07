import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
    } catch (err) {
      console.error('Erreur lors de l\'accès au microphone:', err);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <form onSubmit={handleSubmit} className={`relative h-[120px] bg-white dark:bg-gray-800 p-0 rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.15),0_4px_6px_-4px_rgba(0,0,0,0.1)] dark:shadow-lg border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-purple-500 dark:focus-within:ring-purple-400`}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrivez votre message..."
          className="absolute top-0 left-0 w-full h-full resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-4 focus:outline-none"
          style={{ lineHeight: '1.5' }}
          disabled={isLoading}
        />
        
        <button
          type={message.trim() ? "submit" : "button"}
          onClick={message.trim() ? undefined : isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex-shrink-0 transition-all duration-200 flex items-center justify-center ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
          } ${
            message.trim() 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {message.trim() ? (
            <Send size={20} className="text-white rotate-[-45deg]" />
          ) : (
            <Mic size={20} className="text-white" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;