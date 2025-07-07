import React from "react";
import ChatHeader from "../../components/organisms/WorkspaceHeaders/ChatHeader";

type CallLayoutProps = {
  children: React.ReactNode;
  showHeader?: boolean;
};

const CallLayout: React.FC<CallLayoutProps> = ({ children, showHeader = true }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      {/* هيدر المكالمة */}
      {showHeader && (
        <header>
          <ChatHeader />
        </header>
      )}
      {/* محتوى المكالمة */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default CallLayout;