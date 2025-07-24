import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  setChannels, 
  setConversations, 
  setActiveChat,
  setCurrentChannel,
  setCurrentConversation 
} from '../../../features/chat/chatSlice';
import type { RootState } from '../../../store';
import type { Channel, Conversation } from '../../../features/chat/chatSlice';
import { useWorkspaceParams } from '../../../hooks/useWorkspace/useWorkspaceParams';

export default function ChatSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workspaceId } = useWorkspaceParams();
  
  // If no workspace ID, default to a fallback
  const wsId = workspaceId || 'default';

  const {
    channels,
    conversations,
    activeChat,
    currentWorkspace
  } = useSelector((state: RootState) => ({
    channels: state.chat.channels,
    conversations: state.chat.conversations,
    activeChat: state.chat.activeChat,
    currentWorkspace: state.workspace.currentWorkspace
  }));

  // Mock data for now - in real app, this would come from API or Socket events
  useEffect(() => {
    // Mock channels
    const mockChannels: Channel[] = [
      {
        id: 'general',
        name: 'عام',
        description: 'القناة العامة للفريق',
        type: 'public',
        workspaceId: currentWorkspace?.id || 'workspace1',
        createdAt: new Date().toISOString(),
        members: [
          { id: 'user1', name: 'أحمد محمد', role: 'admin' },
          { id: 'user2', name: 'فاطمة علي', role: 'member' }
        ]
      },
      {
        id: 'development',
        name: 'التطوير',
        description: 'قناة فريق التطوير',
        type: 'public',
        workspaceId: currentWorkspace?.id || 'workspace1',
        createdAt: new Date().toISOString(),
        members: [
          { id: 'user1', name: 'أحمد محمد', role: 'admin' }
        ]
      },
      {
        id: 'design',
        name: 'التصميم',
        description: 'قناة فريق التصميم',
        type: 'private',
        workspaceId: currentWorkspace?.id || 'workspace1',
        createdAt: new Date().toISOString(),
        members: [
          { id: 'user2', name: 'فاطمة علي', role: 'member' }
        ]
      }
    ];

    // Mock conversations
    const mockConversations: Conversation[] = [
      {
        id: 'conv1',
        participants: [
          { id: 'user1', name: 'أحمد محمد', avatar: undefined },
          { id: 'user2', name: 'فاطمة علي', avatar: undefined }
        ],
        unreadCount: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastMessage: {
          id: 'msg1',
          content: 'مرحباً، كيف الحال؟',
          type: 'text',
          sender: { id: 'user2', name: 'فاطمة علي' },
          conversationId: 'conv1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isEdited: false
        }
      },
      {
        id: 'conv2',
        participants: [
          { id: 'user1', name: 'أحمد محمد', avatar: undefined },
          { id: 'user3', name: 'محمد سالم', avatar: undefined }
        ],
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    dispatch(setChannels(mockChannels));
    dispatch(setConversations(mockConversations));
  }, [dispatch, currentWorkspace]);

  const handleChannelClick = (channel: Channel) => {
    dispatch(setActiveChat({ type: 'channel', id: channel.id }));
    dispatch(setCurrentChannel(channel));
    navigate(`/workspace/${wsId}/chat/channel/${channel.id}`);
  };

  const handleConversationClick = (conversation: Conversation) => {
    dispatch(setActiveChat({ type: 'dm', id: conversation.id }));
    dispatch(setCurrentConversation(conversation));
    navigate(`/workspace/${wsId}/chat/dm/${conversation.id}`);
  };

  const isChannelActive = (channelId: string) => {
    return activeChat?.type === 'channel' && activeChat.id === channelId;
  };

  const isConversationActive = (conversationId: string) => {
    return activeChat?.type === 'dm' && activeChat.id === conversationId;
  };

  const formatLastMessageTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 3600);

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return messageTime.toLocaleDateString('ar-EG', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col">
      {/* Workspace Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-semibold">
          {currentWorkspace?.name || 'Worksy'}
        </h1>
        <p className="text-sm text-gray-300">
          المحادثات والقنوات
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Channels Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              القنوات
            </h2>
            <button className="text-gray-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => handleChannelClick(channel)}
                className={`w-full text-right px-3 py-2 rounded-md text-sm transition-colors ${
                  isChannelActive(channel.id)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-gray-400">
                      {channel.type === 'private' ? '🔒' : '#'}
                    </span>
                    <span>{channel.name}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
              الرسائل المباشرة
            </h2>
            <button className="text-gray-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-1">
            {conversations.map((conversation) => {
              const otherParticipants = conversation.participants.filter(p => p.id !== 'user1'); // Current user
              const displayName = otherParticipants.map(p => p.name).join(', ');
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                  className={`w-full text-right px-3 py-2 rounded-md text-sm transition-colors ${
                    isConversationActive(conversation.id)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="truncate">{displayName}</span>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  {conversation.lastMessage && (
                    <div className="mt-1 text-xs text-gray-400 truncate text-right">
                      <span>{conversation.lastMessage.content}</span>
                      <span className="mx-2">•</span>
                      <span>{formatLastMessageTime(conversation.lastMessage.createdAt)}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Status */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
            أ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              أحمد محمد
            </p>
            <p className="text-xs text-gray-400">
              متصل
            </p>
          </div>
          <button className="text-gray-400 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
