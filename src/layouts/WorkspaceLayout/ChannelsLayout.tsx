import React, { Suspense, lazy } from "react";
import LoadingPage from "../../pages/loadingPage";
import { Outlet } from 'react-router-dom'

const ChannelsSidebar = lazy(() => import("../../components/organisms/Sidebar/ChannelsSidebar"));

const ChannelsLayout = () => {
  return (
    <div className='flex h-screen'>
      <aside className="fixed top-0 left-20 h-screen w-64 z-20">
        <Suspense fallback={<LoadingPage />}>
          <ChannelsSidebar />
        </Suspense>
      </aside>
      <main className="flex-1 bg-white ml-64">
        <Outlet />
      </main>
    </div>
  )
}

export default ChannelsLayout