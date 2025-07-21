import React, { Suspense, lazy, useState, useEffect } from "react";
import LoadingPage from "../../pages/loadingPage";
import { Outlet } from 'react-router-dom'
import { GoArrowRight } from "react-icons/go";

const ChannelsSidebar = lazy(() => import("../../components/organisms/Sidebar/ChannelsSidebar"));

const ChannelsLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isMobile, sidebarOpen]);

  const handleSidebarNavigate = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen">
      {/* Overlay sidebar for mobile */}
      {isMobile && (
        <div className={`fixed inset-0 z-40 ${sidebarOpen ? 'bg-black bg-opacity-40' : 'pointer-events-none'} flex`}>
          <div
            className={`relative w-64 h-full bg-white border-r shadow z-50 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-2xl p-1 rounded hover:bg-gray-200 transition md:hidden"
              title="إغلاق القائمة"
            >
              <GoArrowRight />
            </button>
            <Suspense fallback={<LoadingPage />}>
              <ChannelsSidebar onNavigate={handleSidebarNavigate} />
            </Suspense>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      {/* Sidebar for desktop */}
      {!isMobile && sidebarOpen && (
        <div className="fixed top-0 left-20 h-screen w-64 bg-white border-r shadow z-20">
          <Suspense fallback={<LoadingPage />}>
            <ChannelsSidebar />
          </Suspense>
        </div>
      )}
      <main className={`flex-1 bg-white transition-all duration-300 ease-in-out flex flex-col ${!isMobile && sidebarOpen ? "ml-64" : "ml-0"}`}>
        <Outlet context={{ sidebarOpen, setSidebarOpen, isMobile }} />
      </main>
    </div>
  );
};

export default ChannelsLayout;