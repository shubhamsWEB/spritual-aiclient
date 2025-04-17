import React, { useState } from 'react';
import { useConversations } from '@/contexts/ConversationsContext';
import { FiPlus, FiMessageSquare, FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import styles from './ConversationsSidebar.module.css';

interface ConversationsSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}

export default function ConversationsSidebar({ 
  isOpen, 
  onToggle, 
  onNewChat,
  onSelectConversation 
}: ConversationsSidebarProps) {
  const { 
    conversations, 
    currentConversationId, 
    isLoadingConversations,
    deleteConversation
  } = useConversations();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Handle conversation selection
  const handleSelectConversation = (id: string) => {
    onSelectConversation(id);
  };

  // Handle delete button click
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent conversation selection
    setShowDeleteConfirm(id);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent conversation selection
    setDeletingId(id);
    const success = await deleteConversation(id);
    if (success) {
      setShowDeleteConfirm(null);
    }
    setDeletingId(null);
  };

  // Cancel delete operation
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent conversation selection
    setShowDeleteConfirm(null);
  };

  return (
    <div className={`h-full flex flex-col bg-white border-r border-amber-100 shadow-md ${isOpen ? 'md:w-auto w-full' : 'w-0'}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-gradient-to-r from-[#973B00] to-[#BA4D00] text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif">Your Conversations</h2>
          <p className="text-xs text-amber-100 mt-1">Chat history</p>
        </div>
        <button 
          onClick={onToggle}
          className="md:hidden text-white"
          aria-label="Close sidebar"
        >
          <FiChevronLeft size={24} />
        </button>
      </div>

      {/* New chat button */}
      <div className="flex-shrink-0 p-3 border-b border-amber-100">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-[#973B00] hover:bg-[#BA4D00] text-white py-2 px-4 rounded-lg transition-colors border border-[#973B00]"
        >
          <FiPlus size={18} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingConversations ? (
          <div className="p-4 text-center text-gray-500">
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          <ul className="divide-y divide-amber-100">
            {conversations.map(conversation => (
              <li key={conversation.id}>
                <button
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`w-full text-left p-3 hover:bg-amber-50 transition-colors ${
                    currentConversationId === conversation.id ? 'bg-amber-100' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <FiMessageSquare size={18} className="text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 overflow-hidden text-ellipsis line-clamp-2">
                        {conversation.title}
                      </h3>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-500 overflow-hidden text-ellipsis line-clamp-2">
                          {conversation.lastMessage}
                        </p>
                      )}
                      {conversation.lastMessageTime && (
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: true })}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {showDeleteConfirm === conversation.id ? (
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={(e) => handleConfirmDelete(e, conversation.id)}
                            className="p-1 text-red-500 rounded hover:bg-red-50"
                            aria-label="Confirm delete"
                            disabled={deletingId === conversation.id}
                          >
                            {deletingId === conversation.id ? (
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              "✓"
                            )}
                          </button>
                          <button 
                            onClick={handleCancelDelete}
                            className="p-1 text-gray-500 rounded hover:bg-gray-100"
                            aria-label="Cancel delete"
                            disabled={deletingId === conversation.id}
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => handleDeleteClick(e, conversation.id)}
                          className="p-1 text-gray-400 rounded hover:bg-gray-100 hover:text-red-500"
                          aria-label="Delete conversation"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 