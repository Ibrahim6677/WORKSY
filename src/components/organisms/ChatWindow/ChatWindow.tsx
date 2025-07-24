import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useChatSocket } from '../../../hooks/useChat/useChatSocket';
import type { RootState } from '../../../store';
import type { Message } from '../../../features/chat/chatSlice';

interface ChatWindowProps {
  chatId: string;
  chatType: 'channel' | 'dm';
}

export default function ChatWindow({ chatId, chatType }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    fetchChannelMessages,
    sendChannelMessage,
    fetchDMMessages,
    sendDMMessage,
    joinChannel,
    joinDM,
    startTyping,
    stopTyping,
    startDMTyping,
    stopDMTyping,
    editMessage,
    deleteMessage
  } = useChatSocket();

  const { 
    messages, 
    loading, 
    sendingMessage, 
    error, 
    typingUsers,
    currentChannel,
    currentConversation,
    activeChat
  } = useSelector((state: RootState) => ({
    messages: state.chat.messages[chatId] || [],
    loading: state.chat.loading,
    sendingMessage: state.chat.sendingMessage,
    error: state.chat.error,
    typingUsers: state.chat.typingUsers[chatId] || [],
    currentChannel: state.chat.currentChannel,
    currentConversation: state.chat.currentConversation,
    activeChat: state.chat.activeChat
  }));

  // Join channel/DM and fetch messages on mount
  useEffect(() => {
    if (chatType === 'channel') {
      joinChannel(chatId);
      fetchChannelMessages(chatId);
    } else if (chatType === 'dm') {
      joinDM(chatId);
      fetchDMMessages(chatId);
    }
  }, [chatId, chatType, joinChannel, joinDM, fetchChannelMessages, fetchDMMessages]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      if (chatType === 'channel') {
        startTyping(chatId);
      } else {
        startDMTyping(chatId);
      }
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (chatType === 'channel') {
        stopTyping(chatId);
      } else {
        stopDMTyping(chatId);
      }
    }, 2000);
  };

  // Handle sending messages
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;

    if (chatType === 'channel') {
      sendChannelMessage(chatId, newMessage);
    } else {
      sendDMMessage(chatId, newMessage);
    }

    setNewMessage('');
    
    // Stop typing
    if (isTyping) {
      setIsTyping(false);
      if (chatType === 'channel') {
        stopTyping(chatId);
      } else {
        stopDMTyping(chatId);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  // Handle message editing
  const handleEditMessage = (messageId: string, newContent: string) => {
    editMessage(messageId, newContent);
  };

  // Handle message deletion
  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      deleteMessage(messageId);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get chat title
  const getChatTitle = () => {
    if (chatType === 'channel') {
      return currentChannel?.name || 'Channel';
    } else {
      return currentConversation?.participants
        .map(p => p.name)
        .join(', ') || 'Direct Message';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {getChatTitle()}
        </h2>
        {chatType === 'channel' && currentChannel?.description && (
          <p className="text-sm text-gray-600 mt-1">
            {currentChannel.description}
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-4 rounded">
          {error}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>لا توجد رسائل بعد</p>
            <p className="text-sm">ابدأ المحادثة بكتابة رسالة!</p>
          </div>
        ) : (
          messages.map((message: Message) => (
            <div key={message.id} className="flex space-x-3 rtl:space-x-reverse">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.sender.avatar ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={message.sender.avatar}
                    alt={message.sender.name}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {message.sender.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <h4 className="text-sm font-medium text-gray-900">
                    {message.sender.name}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.createdAt)}
                  </span>
                  {message.isEdited && (
                    <span className="text-xs text-gray-400">(تم التعديل)</span>
                  )}
                </div>
                
                <div className="mt-1">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  {/* Reply to message */}
                  {message.replyTo && (
                    <div className="mt-2 p-2 bg-gray-50 border-l-4 border-gray-300 rounded text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">{message.replyTo.sender.name}:</span>{' '}
                        {message.replyTo.content}
                      </p>
                    </div>
                  )}

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-50 p-2 rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <a
                            href={attachment.url}
                            download={attachment.name}
                            className="text-blue-600 hover:text-blue-500 text-sm"
                          >
                            تحميل
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Actions */}
                <div className="mt-2 flex space-x-2 rtl:space-x-reverse text-xs">
                  <button
                    onClick={() => handleEditMessage(message.id, prompt('تعديل الرسالة:', message.content) || message.content)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 italic">
            {typingUsers.length === 1
              ? `شخص واحد يكتب...`
              : `${typingUsers.length} أشخاص يكتبون...`}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-4 rtl:space-x-reverse">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="اكتب رسالة..."
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={sendingMessage}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || sendingMessage}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingMessage ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'إرسال'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
