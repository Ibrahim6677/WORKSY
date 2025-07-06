import React from "react";
import ChatHeader from "../../components/organisms/WorkspaceHeaders/ChatHeader";

type CallLayoutProps = {
  children: React.ReactNode;
};

const CallLayout: React.FC<CallLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      {/* هيدر المكالمة */}
      <header className="shadow-sm bg-white z-10">
        <ChatHeader />
      </header>
      {/* محتوى المكالمة */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-4">
        {children}
      </main>
    </div>
  );
};

export default CallLayout;