import ChatWindow from "../../components/organisms/ChatWindow/ChatWindow";
import ChatHeader from "../../components/organisms/WorkspaceHeaders/ChatHeader";
import ThreadSidebar from "../../components/organisms/Sidebar/ThreadSidebar";
import { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

type ChannelsLayoutContext = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isMobile: boolean;
};

const ChatPage = () => {
  const [threadOpen, setThreadOpen] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useOutletContext<ChannelsLayoutContext>();
  const { channelId } = useParams<{ channelId: string }>();

  // إذا السايدبار مفتوح على الموبايل، لا نحتاج overlay
  return (
    <div className={`flex flex-col h-screen bg-[#FAFAFA] relative`}>
        <ChatHeader
            onOpenThreadSidebar={() => setThreadOpen(true)}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />
      {/* Removed overlay - let content show through */}
      <div className="flex flex-1 min-h-0">
        <div className={threadOpen ? "flex-1 min-w-0" : "flex-1 min-w-0"}>
          {channelId ? (
            <ChatWindow chatId={channelId} chatType="channel" />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  مرحباً بك في Worksy
                </h2>
                <p className="text-gray-600">
                  اختر قناة من الشريط الجانبي لبدء المحادثة
                </p>
              </div>
            </div>
          )}
        </div>
        {threadOpen && (
          <div className="w-[400px] h-full border-l border-gray-200 bg-white flex flex-col">
            <ThreadSidebar onClose={() => setThreadOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
