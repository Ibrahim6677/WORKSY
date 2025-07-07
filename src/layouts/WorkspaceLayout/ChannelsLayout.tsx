import ChannelsSidebar from '../../components/organisms/Sidebar/ChannelsSidebar'
import { Outlet } from 'react-router-dom'

const ChannelsLayout = () => {
  return (
    <div className='flex h-screen'>
      <aside className="fixed top-0 left-20 h-screen w-64 z-20">
        <ChannelsSidebar />
      </aside>
      <main className="flex-1 bg-white ml-64">
        <Outlet />
      </main>
    </div>
  )
}

export default ChannelsLayout