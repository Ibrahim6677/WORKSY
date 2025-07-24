import { Suspense, lazy, useState, useEffect } from "react";
import LoadingPage from "../../pages/loadingPage";
import { Outlet } from 'react-router-dom'
import { GoArrowLeft } from "react-icons/go";

const ChannelsSidebar = lazy(() => import("../../components/organisms/Sidebar/ChannelsSidebar"));

const ChannelsLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed to false for mobile-first
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024; // Changed to lg breakpoint
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

  const handleSidebarNavigate = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen">
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
              <Suspense fallback={<LoadingPage />}>
                <ChannelsSidebar onNavigate={handleSidebarNavigate} />
              </Suspense>
            </div>
          </div>
        </>
      )}
      {/* Sidebar for desktop */}
      {!isMobile && (
        <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-0"} bg-white border-r shadow overflow-hidden`}>
          {sidebarOpen && (
            <Suspense fallback={<LoadingPage />}>
              <ChannelsSidebar />
            </Suspense>
          )}
        </div>
      )}
      <main className="flex-1 bg-white transition-all duration-300 ease-in-out flex flex-col overflow-hidden">
        <Outlet context={{ sidebarOpen, setSidebarOpen, isMobile }} />
      </main>
    </div>
  );
};

export default ChannelsLayout;