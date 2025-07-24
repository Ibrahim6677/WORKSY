import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket/useSocket';

interface ChatWindowProps {
  channelId?: string;
  conversationId?: string;
  type: 'channel' | 'dm';
}

export default function ChatWindow({ channelId, conversationId, type }: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const {
    joinChannel,
    joinDM,
    sendMessage,
    sendDMMessage,
    startTyping,
    stopTyping,
    startDMTyping,
    stopDMTyping,
    onNewMessage,
    onDMMessage,
    onUserTyping,
    onUserStoppedTyping,
    addReaction
  } = useSocket();

  // Join channel/DM on mount
  useEffect(() => {
    if (type === 'channel' && channelId) {
      joinChannel(channelId);
    } else if (type === 'dm' && conversationId) {
      joinDM(conversationId);
    }
  }, [channelId, conversationId, type, joinChannel, joinDM]);

  // Listen for new messages
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (type === 'channel') {
      cleanup = onNewMessage((message) => {
        if (message.channelId === channelId) {
          setMessages(prev => [...prev, message]);
        }
      });
    } else if (type === 'dm') {
      cleanup = onDMMessage((message) => {
        if (message.conversationId === conversationId) {
          setMessages(prev => [...prev, message]);
        }
      });
    }

    return cleanup;
  }, [channelId, conversationId, type, onNewMessage, onDMMessage]);

  // Listen for typing indicators
  useEffect(() => {
    const cleanupTyping = onUserTyping((data) => {
      setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
    });

    const cleanupStoppedTyping = onUserStoppedTyping((data) => {
      setTypingUsers(prev => prev.filter(id => id !== data.userId));
    });

    return () => {
      cleanupTyping();
      cleanupStoppedTyping();
    };
  }, [onUserTyping, onUserStoppedTyping]);

  // Handle sending messages
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    if (type === 'channel' && channelId) {
      sendMessage(channelId, newMessage);
    } else if (type === 'dm' && conversationId) {
      sendDMMessage(conversationId, newMessage);
    }

    setNewMessage('');
  };

  // Handle typing
  const handleTyping = () => {
    if (type === 'channel' && channelId) {
      startTyping(channelId);
    } else if (type === 'dm' && conversationId) {
      startDMTyping(conversationId);
    }

    // Auto stop typing after 3 seconds
    setTimeout(() => {
      if (type === 'channel' && channelId) {
        stopTyping(channelId);
      } else if (type === 'dm' && conversationId) {
        stopDMTyping(conversationId);
      }
    }, 3000);
  };

  // Handle reactions
  const handleReaction = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="bg-white p-3 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <img 
                src={message.sender.avatar || '/default-avatar.png'} 
                alt={message.sender.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold">{message.sender.name}</span>
              <span className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
            
            <p className="text-gray-800">{message.content}</p>
            
            {/* Reaction buttons */}
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => handleReaction(message.id, '👍')}
                className="text-sm text-gray-500 hover:text-blue-500"
              >
                👍
              </button>
              <button 
                onClick={() => handleReaction(message.id, '❤️')}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                ❤️
              </button>
              <button 
                onClick={() => handleReaction(message.id, '😂')}
                className="text-sm text-gray-500 hover:text-yellow-500"
              >
                😂
              </button>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 italic">
            {typingUsers.length === 1 
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.length} people are typing...`
            }
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              } else {
                handleTyping();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6629DE]"
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#6629DE] text-white px-4 py-2 rounded-lg hover:bg-[#5520CC] transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
