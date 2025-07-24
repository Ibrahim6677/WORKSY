import React, { useState, useEffect } from 'react';
import DMSSidebar from './Sidebar/DMSSidebar';
import ChatWindow from './ChatWindow/ChatWindow';
import { GoArrowLeft } from 'react-icons/go';

interface Member {
  id: string; // Changed to match DMSSidebar
  name: string;
  avatar: string;
  isOnline?: boolean;
  email?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  hasConversation?: boolean;
}

const DirectMessagesContainer: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024;
      setIsMobile(newIsMobile);
      
      // Auto-open sidebar on desktop only if not already set
      if (!newIsMobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    // Close sidebar on mobile when member is selected
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile - floating over content */}
      {isMobile && sidebarOpen && (
        <>
          {/* Invisible overlay to catch outside clicks */}
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="fixed top-0 left-0 z-40 w-72 sm:w-64 h-full max-w-[85vw]">
            <div className="w-full h-full bg-white border-r shadow-lg">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-2xl p-1 rounded hover:bg-gray-200 transition z-10"
                title="إغلاق القائمة"
              >
                <GoArrowLeft />
              </button>
              <DMSSidebar 
                onSelectMember={handleSelectMember}
                selectedMember={selectedMember}
              />
            </div>
          </div>
        </>
      )}
      
      {/* Sidebar for desktop */}
      {!isMobile && (
        <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-0"} bg-white border-r shadow overflow-hidden`}>
          {sidebarOpen && (
            <DMSSidebar 
              onSelectMember={handleSelectMember}
              selectedMember={selectedMember}
            />
          )}
        </div>
      )}
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with toggle button for mobile */}
        {isMobile && (
          <div className="flex items-center p-4 bg-white border-b">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-2xl p-2 rounded hover:bg-gray-200 transition"
              title="فتح الرسائل المباشرة"
            >
              <GoArrowLeft className="rotate-180" />
            </button>
            <h1 className="mr-4 text-lg font-semibold">الرسائل المباشرة</h1>
          </div>
        )}
        
        <div className="flex-1">
          {selectedMember ? (
            <ChatWindow 
              chatId={selectedMember.id} 
              chatType="dm" 
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  مرحباً بك في الرسائل المباشرة
                </h2>
                <p className="text-gray-600">
                  اختر عضو من الشريط الجانبي لبدء المحادثة
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom toggle button for mobile */}
        {isMobile && (
          <div className="fixed bottom-4 left-4 z-20">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
              title={sidebarOpen ? "إخفاء الرسائل المباشرة" : "إظهار الرسائل المباشرة"}
            >
              <GoArrowLeft className={`text-xl transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessagesContainer;
