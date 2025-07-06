import { FaUser, FaBell, FaLock, FaPalette, FaUsers, FaHashtag, FaCreditCard, FaChartPie } from 'react-icons/fa';
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="w-64 h-screen flex flex-col border-r border-gray-200 bg-[#F6F2FD] relative">
      <div className='mt-3'>
        <div className="px-3 mt-2">
          <div className="text-xs text-gray-500 font-bold mb-1">Personal</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 py-1 cursor-pointer hover:bg-[#ede7fa] rounded ">
              <FaUser className="text-base" />
              <Link to="/workspace/settings/profile" className={location.pathname.endsWith("/profile") ? "text-[#6629DE]" : ""}>Profile</Link>
            </div>
            <div className="flex items-center gap-2 py-1 cursor-pointer hover:bg-[#ede7fa] rounded ">
              <FaBell className="text-base" />
              <Link to="/workspace/settings/notifications" className={location.pathname.endsWith("/notifications") ? "text-[#6629DE]" : ""}>Notifications</Link>
            </div>
            <div className="flex items-center gap-2 py-1 cursor-pointer hover:bg-[#ede7fa] rounded ">
              <FaLock className="text-base" />
              <Link to="/workspace/settings/privacy" className={location.pathname.endsWith("/privacy") ? "text-[#6629DE]" : ""}>Privacy</Link>
            </div>
            <div className="flex items-center gap-2 py-1 cursor-pointer hover:bg-[#ede7fa] rounded ">
              <FaPalette className="text-base" />
              <Link to="/workspace/settings/appearance" className={location.pathname.endsWith("/appearance") ? "text-[#6629DE]" : ""}>Appearance</Link>
            </div>
          </div>
        </div>
        {/* Workspace Section */}
        <div className="px-3 mt-4">
          <div className="text-xs text-gray-500 font-bold mb-1">Workspace</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 py-1 cursor-pointer hover:bg-[#ede7fa] rounded ">
              <FaChartPie className="text-base" />
              <Link to="/workspace/settings/overview" className={location.pathname.endsWith("/overview") ? "text-[#6629DE]" : ""}>Overview</Link>
            </div>
            <div className="flex items-center gap-2 py-1 cursor-pointer hover:bg-[#ede7fa] rounded ">
              <FaUsers className="text-base" />
              <Link to="/workspace/settings/members" className={location.pathname.endsWith("/members") ? "text-[#6629DE]" : ""}>Members</Link>
            </div>
            <div className="flex items-center gap-2 py-1 cursor-pointer hover:bg-[#ede7fa] rounded ">
              <FaHashtag className="text-base" />
              <Link to="/workspace/settings/channels" className={location.pathname.endsWith("/channels") ? "text-[#6629DE]" : ""}>Channels</Link>
            </div>
            <div className="flex items-center gap-2 py-1 cursor-pointer hover:bg-[#ede7fa] rounded ">
              <FaCreditCard className="text-base" />
              <Link to="/workspace/settings/billing" className={location.pathname.endsWith("/billing") ? "text-[#6629DE]" : ""}>Billing</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;