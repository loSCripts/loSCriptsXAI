import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatContainer from './components/ChatContainer';
import { Conversation, Message } from './types';
import { generateId, getAIResponse, createNewConversation, getConversationTitle } from './utils';
import PerspectiveGrid from './components/PerspectiveGrid';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const savedConversations = localStorage.getItem('conversations');
    return savedConversations 
      ? JSON.parse(savedConversations, (key, value) => {
          if (key === 'timestamp' || key === 'createdAt') {
            return new Date(value);
          }
          return value;
        })
      : [createNewConversation()];
  });
  
  const [activeConversationId, setActiveConversationId] = useState<string>(() => {
    return conversations[0]?.id || '';
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);

  // Get the active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNewConversation = () => {
    const newConversation = createNewConversation(conversations);
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversationId(conversation.id);
  };

  const handleDeleteConversation = (id: string) => {
    const newConversations = conversations.filter(c => c.id !== id);
    setConversations(newConversations);
    
    // If the active conversation is deleted, select the first one or create a new one
    if (id === activeConversationId) {
      if (newConversations.length > 0) {
        setActiveConversationId(newConversations[0].id);
      } else {
        const newConversation = createNewConversation();
        setConversations([newConversation]);
        setActiveConversationId(newConversation.id);
      }
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    
    setConversations(
      conversations.map(c => 
        c.id === id 
          ? { ...c, title: newTitle.trim() }
          : c
      )
    );
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversation) return;

    // Create user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Update conversation with user message
    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, userMessage],
    };

    // If this is the first message, update the conversation title
    if (activeConversation.messages.length === 0) {
      updatedConversation.title = getConversationTitle([userMessage]);
    }

    // Update conversations state
    setConversations(
      conversations.map(c => (c.id === activeConversationId ? updatedConversation : c))
    );

    // Generate AI response
    setIsLoading(true);
    try {
      const aiResponseContent = await getAIResponse(content);
      
      // Create AI message
      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: aiResponseContent,
        timestamp: new Date(),
      };

      // Update conversation with AI message
      setConversations(
        conversations.map(c => 
          c.id === activeConversationId 
            ? {
                ...c,
                messages: [...updatedConversation.messages, aiMessage],
              }
            : c
        )
      );
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`h-screen flex bg-white dark:bg-gray-900 transition-colors duration-200`}>
      <PerspectiveGrid darkMode={darkMode} />
      <Sidebar 
        conversations={conversations}
        activeConversation={activeConversation}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onReorderConversations={setConversations}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isMenuCollapsed={isMenuCollapsed}
        setIsMenuCollapsed={setIsMenuCollapsed}
      />
      <div 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isMenuCollapsed ? 'md:ml-0' : 'md:ml-64'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {activeConversation && (
            <ChatContainer 
              conversation={activeConversation}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;