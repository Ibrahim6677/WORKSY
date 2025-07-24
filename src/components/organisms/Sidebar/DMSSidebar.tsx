import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getWorkspaceMembers } from '../../../services/api/workspace/workspaceApi';
import { getConversations, createConversation } from '../../../services/api/chat/chatApi';
import type { RootState } from '../../../store';
import type { WorkspaceMember } from '../../../services/api/workspace/workspaceApi';
import type { Conversation } from '../../../services/api/chat/chatApi';

interface Member {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  email?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  hasConversation?: boolean;
}

interface DMSSidebarProps {
  onSelectMember: (member: Member) => void;
  selectedMember?: Member | null;
}

const DMSSidebar: React.FC<DMSSidebarProps> = ({ onSelectMember, selectedMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { currentWorkspace } = useSelector((state: RootState) => ({
    currentWorkspace: state.workspace?.currentWorkspace
  }));

  // Fetch workspace members and conversations
  useEffect(() => {
    const fetchData = async () => {
      if (!currentWorkspace?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch workspace members and conversations in parallel
        const [workspaceMembers, dmConversations] = await Promise.all([
          getWorkspaceMembers(currentWorkspace.id),
          getConversations(currentWorkspace.id)
        ]);
        
        // Convert workspace members to Member format
        const convertedMembers: Member[] = workspaceMembers.map((member: WorkspaceMember) => ({
          id: member.id,
          name: member.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6629DE&color=fff`,
          email: member.email,
          isOnline: Math.random() > 0.5, // Random online status - you can replace with real data
        }));
        
        // Add conversation data to members
        const membersWithConversations = convertedMembers.map((member) => {
          const conversation = dmConversations.find((conv) => 
            conv.participants.some((p) => p.id === member.id)
          );
          
          return {
            ...member,
            lastMessage: conversation?.lastMessage?.content,
            lastMessageTime: conversation?.lastMessage?.createdAt,
            unreadCount: conversation?.unreadCount || 0,
            hasConversation: !!conversation
          };
        });
        
        setMembers(membersWithConversations);
        setConversations(dmConversations);
      } catch (err) {
        console.error('Error fetching DM data:', err);
        setError('فشل في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentWorkspace?.id]);

  // Create new conversation
  const handleCreateConversation = async (memberId: string) => {
    if (!currentWorkspace?.id) return;
    
    try {
      setError(null);
      const newConversation = await createConversation(currentWorkspace.id, [memberId]);
      setConversations(prev => [...prev, newConversation]);
      
      // Find the member and trigger selection
      const member = members.find(m => m.id === memberId);
      if (member) {
        onSelectMember(member);
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('فشل في إنشاء المحادثة');
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-64 bg-gray-50 h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B46C1]"></div>
        <p className="mt-2 text-sm text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 bg-gray-50 h-full flex flex-col items-center justify-center">
        <p className="text-sm text-red-600 text-center px-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm text-[#6B46C1] hover:underline"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-50 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">الرسائل المباشرة</h2>
          <button 
            className="p-1 hover:bg-gray-200 rounded-md transition-colors"
            title="إنشاء محادثة جديدة"
            onClick={() => {
              // يمكنك إضافة modal لاختيار عضو جديد هنا
              console.log('Create new conversation');
            }}
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في الأعضاء..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Members Count */}
      <div className="px-4 py-2 text-sm text-gray-600">
        جميع الأعضاء ({filteredMembers.length})
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto">
        {filteredMembers.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            <p className="text-sm">لا توجد نتائج للبحث</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => onSelectMember(member)}
              className={`flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                selectedMember?.id === member.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {member.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
                {member.unreadCount && member.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {member.unreadCount > 9 ? '9+' : member.unreadCount}
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {member.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {member.lastMessageTime && (
                      <span className="text-xs text-gray-400">
                        {new Date(member.lastMessageTime).toLocaleTimeString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                    {!member.hasConversation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateConversation(member.id);
                        }}
                        className="text-blue-500 hover:text-blue-700 text-xs p-1"
                        title="إنشاء محادثة"
                      >
                        رسالة
                      </button>
                    )}
                  </div>
                </div>
                {member.lastMessage && (
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {member.lastMessage}
                  </p>
                )}
                {!member.lastMessage && member.email && (
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {member.email}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with member count */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          {filteredMembers.filter(m => m.isOnline).length} عضو متصل • {conversations.length} محادثة
        </div>
      </div>
    </div>
  );
};

export default DMSSidebar;
