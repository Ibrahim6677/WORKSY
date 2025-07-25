import React, { useState } from "react";
import ChatHeader from "../../components/organisms/WorkspaceHeaders/ChatHeader";

type CallLayoutProps = {
  children: React.ReactNode;
  showHeader?: boolean;
  onOpenThreadSidebar?: () => void;
};

const CallLayout: React.FC<CallLayoutProps> = ({ 
  children, 
  showHeader = true,
  onOpenThreadSidebar 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      {showHeader && (
        <header>
          <ChatHeader
            onOpenThreadSidebar={onOpenThreadSidebar || (() => {})}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </header>
      )}
      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default CallLayout;