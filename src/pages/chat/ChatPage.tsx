import React, { Suspense, lazy } from "react";
import LoadingPage from "../loadingPage";
import GeneralChat from "../../components/organisms/ChatWindow/GeneralChat";
import ChatHeader from "../../components/organisms/WorkspaceHeaders/ChatHeader";
import ThreadSidebar from "../../components/organisms/Sidebar/ThreadSidebar";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

type ChannelsLayoutContext = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  isMobile: boolean;
};

const ChatPage = () => {
  const [threadOpen, setThreadOpen] = useState(false);
  const { sidebarOpen, setSidebarOpen, isMobile } = useOutletContext<ChannelsLayoutContext>();

  // إذا السايدبار مفتوح على الموبايل، غطي الصفحة بـ overlay
  return (
    <div className={`flex flex-col h-screen bg-[#FAFAFA] relative`}>
        <ChatHeader
            onOpenThreadSidebar={() => setThreadOpen(true)}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        />
      {/* Overlay when sidebar is open on mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex flex-1 min-h-0">
        <div className={threadOpen ? "flex-1 min-w-0" : "flex-1 min-w-0"}>
          <GeneralChat />
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
