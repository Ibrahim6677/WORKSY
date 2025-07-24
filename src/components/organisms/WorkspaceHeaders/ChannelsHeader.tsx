
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';

interface ChannelsHeaderProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

const ChannelsHeader = ({ onToggleSidebar, sidebarOpen = true }: ChannelsHeaderProps) => {
  return (
    <div className="flex items-center justify-between text-inter px-4 md:px-12 py-6 bg-[#FAFAFA] border-b border-[#EFEFFD]">
      <div className="flex items-center gap-2">
        {/* زر فتح/إغلاق السايدبار */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="text-2xl p-1 rounded hover:bg-gray-200 text-[#6629DE] transition"
            title={sidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {sidebarOpen ? <GoArrowLeft /> : <GoArrowRight />}
          </button>
        )}
        <h3 className='text-[#000] text-inter text-lg font-bold'>Channels</h3>
      </div>
      <button className='capitalize border text-sm px-6 py-2.5 font-medium rounded bg-[#FAFAFA]'>create channel</button>
    </div>
  )
}

export default ChannelsHeader