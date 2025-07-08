import React, { Suspense, lazy } from "react";
import LoadingPage from "../../pages/loadingPage";
import { Outlet } from 'react-router-dom';

const SettingSidebar = lazy(() => import("../../components/organisms/Sidebar/SettingSidebar"));

const SettingsLayout = () => {
  return (
    <div className="flex">
      <div className="fixed top-0 left-20 h-screen w-64 bg-white border-r shadow">
        <Suspense fallback={<LoadingPage />}>
          <SettingSidebar />
        </Suspense>
      </div>
      <main className="ml-64 flex-1 h-screen overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsLayout;
