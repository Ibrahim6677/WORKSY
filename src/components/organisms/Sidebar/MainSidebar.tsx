import { NavLink, useParams } from "react-router-dom";
import {
  Home,
  Hash,
  MessageSquare,
  Folder,
  Calendar,
  Bell,
  Settings
} from "lucide-react";
import logo from "../../../assets/images/Vector1.svg";
import { useWorkspaceParams } from "../../../hooks/useWorkspace/useWorkspaceParams";

export default function MainSidebar() {
  const { workspaceId } = useWorkspaceParams();
  
  // If no workspace ID, default to a fallback
  const wsId = workspaceId || 'default';
  
  const navItems = [
    { label: "Home", icon: <Home size={18} />, to: `/workspace/${wsId}/channels` },
    { label: "channels", icon: <Hash size={18} />, to: `/workspace/${wsId}/channels` },
    { label: "DMS", icon: <MessageSquare size={18} />, to: `/workspace/${wsId}/dms` },
    { label: "Files", icon: <Folder size={18} />, to: `/workspace/${wsId}/files` },
    { label: "Calendar", icon: <Calendar size={18} />, to: `/workspace/${wsId}/calendar` },
    { label: "notification", icon: <Bell size={18} />, to: `/workspace/${wsId}/settings/notifications` },
    { label: "Settings", icon: <Settings size={18} />, to: `/workspace/${wsId}/settings` }
  ];
  return (
    <aside className="w-20 h-screen bg-purple-100 flex flex-col items-center justify-between py-4">
      {/* Top Logo */}
      <div className="mb-6 bg-white p-1 rounded-full flex items-center justify-center">
        <div className="w-6 h-6">
              <img
                src={logo}
                alt="Worksy Logo"
                className="w-full h-full object-contain"
              />
            </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-6 items-center">
        {navItems.map(({ label, icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[12px] font-medium transition-colors ${
                isActive ? "text-[#6629DE]" : "text-black"
              }`
            }
          >
            {icon}
            <span className="capitalize">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Avatar */}
      <div className="relative mb-2">
        <img
          src="https://i.pravatar.cc/40"
          className="w-10 h-10 rounded-full"
          alt="user"
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      </div>
    </aside>
  );
}
