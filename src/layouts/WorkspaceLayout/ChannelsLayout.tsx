import ChannelsSidebar from '../../components/organisms/Sidebar/ChannelsSidebar'
import { Outlet } from 'react-router-dom'

const ChannelsLayout = () => {
  return (
    <div className='flex h-screen'>
      <ChannelsSidebar />
      <div className="flex-1 bg-white">
        <Outlet />
      </div>
    </div>
  )
}

export default ChannelsLayout