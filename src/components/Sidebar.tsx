import React, { useState, useRef, useEffect } from 'react';
import { Conversation } from '../types';
import { formatDate, reorderConversations } from '../utils';
import { Plus, Trash2, Moon, Sun, Menu, X, Edit2, Check, MoreVertical, Search, GripVertical, MoveHorizontal } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface SidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onReorderConversations: (conversations: Conversation[]) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isMenuCollapsed: boolean;
  setIsMenuCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  onReorderConversations,
  darkMode,
  toggleDarkMode,
  isMenuCollapsed,
  setIsMenuCollapsed,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !sidebarRef.current) return;
      const newWidth = Math.max(256, Math.min(400, e.clientX));
      sidebarRef.current.style.width = `${newWidth}px`;
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Filtrer les conversations en fonction de la recherche
  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDropdownClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const startEditing = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
    setActiveDropdown(null);
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.select();
      }
    }, 10);
  };

  const saveTitle = () => {
    if (editingId) {
      onRenameConversation(editingId, editTitle);
      setEditingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveTitle();
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteConversation(id);
    setActiveDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (editingId && editInputRef.current && !editInputRef.current.contains(e.target as Node)) {
        saveTitle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingId, editTitle]);

  return (
    <>
      {/* Menu toggle button that changes icon based on menu state */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-200 dark:bg-purple-900 text-gray-800 dark:text-purple-200 transition-all duration-200 hover:scale-105 hover:bg-gray-300 dark:hover:bg-purple-800"
        onClick={() => {
          if (window.innerWidth >= 768) {
            setIsMenuCollapsed(!isMenuCollapsed);
          } else {
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }
        }}
      >
        {isMenuCollapsed || !isMobileMenuOpen ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-100 dark:bg-gray-900 flex flex-col border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-40
          ${isMenuCollapsed ? 'md:-translate-x-full' : 'md:translate-x-0'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          w-72 md:w-64
        `}
      >
        {/* Poignée de redimensionnement - visible uniquement sur desktop */}
        {!isMobileMenuOpen && !isMenuCollapsed && (
          <div 
            className="absolute -right-3.5 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center cursor-col-resize bg-gray-100 dark:bg-gray-900"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
            }}
          >
            <div className="w-3.5 h-16 flex items-center justify-center hover:bg-purple-500/20 shadow-sm hover:shadow-md transition-all duration-200">
              <MoveHorizontal size={18} className="text-gray-400 hover:text-purple-500 transition-colors duration-200" />
            </div>
          </div>
        )}
        <div className="p-4 pl-16 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="header-text text-xl font-bold dark:text-white">LoSCriptsX AI</h1>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          >
            {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          </button>
        </div>

        <button 
          onClick={onNewConversation}
          className="mx-4 mt-4 mb-3 flex items-center justify-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 dark:text-white pulse-on-hover"
        >
          <Plus size={16} />
          <span>Nouvelle conversation</span>
        </button>

        {/* Barre de recherche */}
        <div className="px-4 py-3">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center"
              >
                <X size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-3">
          <DragDropContext 
            onDragEnd={(result) => {
              if (!result.destination) return;
              const newConversations = reorderConversations(
                filteredConversations,
                result.source.index,
                result.destination.index
              );
              onReorderConversations(newConversations);
            }}
          >
            <Droppable droppableId="conversations">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {filteredConversations.map((conversation, index) => (
                    <Draggable 
                      key={conversation.id} 
                      draggableId={conversation.id} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative p-3 mx-2 my-1 rounded-md cursor-pointer transition-all duration-200 fade-in group
                            ${activeConversation?.id === conversation.id 
                              ? 'bg-gray-200 dark:bg-gray-700' 
                              : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                            }
                            ${activeConversation?.id === conversation.id ? 'glow-on-active' : ''}
                            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-purple-500 ring-opacity-50' : ''}
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              {...provided.dragHandleProps}
                              className="p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 cursor-grab active:cursor-grabbing touch-manipulation"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                touchAction: 'none',
                                WebkitTouchCallout: 'none',
                                WebkitUserSelect: 'none',
                                userSelect: 'none'
                              }}
                            >
                              <GripVertical size={20} className="text-gray-400" />
                            </div>
                            <div 
                              className="flex-1"
                              onClick={() => {
                                if (editingId !== conversation.id) {
                                  onSelectConversation(conversation);
                                }
                              }}
                            >
                              {editingId === conversation.id ? (
                                <div className="flex items-center">
                                  <input
                                    ref={editInputRef}
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full px-2 py-1 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      saveTitle();
                                    }}
                                    className="ml-2 text-green-500 hover:text-green-600 transition-colors"
                                  >
                                    <Check size={16} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span className="font-medium truncate dark:text-white block">
                                    {conversation.title}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                    {formatDate(conversation.createdAt)}
                                  </span>
                                </>
                              )}
                            </div>
                            
                            {!editingId && activeConversation?.id === conversation.id && (
                              <div className="relative" ref={dropdownRef}>
                                <button
                                  onClick={(e) => handleDropdownClick(e, conversation.id)}
                                  className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                                >
                                  <MoreVertical size={16} />
                                </button>
                                
                                {activeDropdown === conversation.id && (
                                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                                    <button
                                      onClick={(e) => startEditing(e, conversation.id, conversation.title)}
                                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                      <Edit2 size={14} />
                                      Renommer
                                    </button>
                                    <button
                                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                      <Trash2 size={14} />
                                      Supprimer
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      {/* <img src="path/to/old/logo.png" alt="Logo" className="h-8 border-l-6 border-gray-500 dark:border-gray-400" /> */}
    </>
  );
};

export default Sidebar;