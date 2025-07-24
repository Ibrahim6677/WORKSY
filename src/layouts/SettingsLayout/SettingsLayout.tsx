import { Suspense, lazy, useState, useEffect } from "react";
import LoadingPage from "../../pages/loadingPage";
import { Outlet } from 'react-router-dom';
import SettingHeader from "../../components/organisms/WorkspaceHeaders/SettingHeader";
import { GoArrowRight } from "react-icons/go";

const SettingSidebar = lazy(() => import("../../components/organisms/Sidebar/SettingSidebar"));

const SettingsLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed to false for mobile-first
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      
      // Auto-close sidebar on mobile, auto-open on desktop
      if (newIsMobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // إزالة منع التمرير لأننا لا نريد خلفية سوداء
    // if (isMobile && sidebarOpen) {
    //   document.body.classList.add("overflow-hidden");
    // } else {
    //   document.body.classList.remove("overflow-hidden");
    // }
  }, [isMobile, sidebarOpen]);

  // دالة تمرر للسايدبار ليغلق نفسه عند اختيار عنصر
  const handleSidebarNavigate = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex">
      {/* Sidebar for mobile - floating over content */}
      {isMobile && sidebarOpen && (
        <>
          {/* Invisible overlay to catch outside clicks */}
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="fixed top-0 left-0 z-40 w-64 h-full">
            <div className="w-full h-full bg-white border-r shadow-lg">
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-2xl p-1 rounded hover:bg-gray-200 transition z-10"
                title="إغلاق القائمة"
              >
                <GoArrowRight />
              </button>
              <Suspense fallback={<LoadingPage />}>
                <SettingSidebar onNavigate={handleSidebarNavigate} />
              </Suspense>
            </div>
          </div>
        </>
      )}
      {/* Sidebar for desktop */}
      {!isMobile && sidebarOpen && (
        <div className="fixed top-0 left-20 h-screen w-64 bg-white border-r shadow z-20">
          <Suspense fallback={<LoadingPage />}>
            <SettingSidebar />
          </Suspense>
        </div>
      )}
      <div
        className={`flex-1 h-screen overflow-y-auto bg-white transition-all duration-300 ease-in-out ${
          !isMobile && sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <SettingHeader sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v: boolean) => !v)} />
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;

// tailwind.config.js: أضف animate-slideInLeft إذا لم تكن موجودة
// animation: {
//   slideInLeft: 'slideInLeft 0.3s ease-out',
// },
// keyframes: {
//   slideInLeft: {
//     '0%': { transform: 'translateX(-100%)' },
//     '100%': { transform: 'translateX(0)' },
//   },
// },
