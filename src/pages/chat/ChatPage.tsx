import React, { Suspense, lazy } from "react";
import LoadingPage from "../loadingPage";
import GeneralChat from "../../components/organisms/ChatWindow/GeneralChat";
import WorkspaceHeader from "../../components/organisms/WorkspaceHeaders/ChatHeader";
import ThreadSidebar from "../../components/organisms/Sidebar/ThreadSidebar";
import { useState } from "react";

const ChatPage = () => {
  const [threadOpen, setThreadOpen] = useState(false);
  return (
    <div className="flex flex-col h-screen bg-[#FAFAFA]">
      <WorkspaceHeader onOpenThreadSidebar={() => setThreadOpen(true)} />
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
