import { FaUser, FaBell, FaLock, FaPalette, FaUsers, FaHashtag, FaCreditCard, FaChartPie } from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router-dom";
import React from "react";

const links = [
  { to: "/workspace/settings/profile", label: "Profile", icon: <FaUser className="text-base" /> },
  { to: "/workspace/settings/notifications", label: "Notifications", icon: <FaBell className="text-base" /> },
  { to: "/workspace/settings/privacy", label: "Privacy", icon: <FaLock className="text-base" /> },
  { to: "/workspace/settings/appearance", label: "Appearance", icon: <FaPalette className="text-base" /> },
  { to: "/workspace/settings/overview", label: "Overview", icon: <FaChartPie className="text-base" /> },
  { to: "/workspace/settings/members", label: "Members", icon: <FaUsers className="text-base" /> },
  { to: "/workspace/settings/channels", label: "Channels", icon: <FaHashtag className="text-base" /> },
  { to: "/workspace/settings/billing", label: "Billing", icon: <FaCreditCard className="text-base" /> },
];

export default function SettingSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  return (
    <aside className="w-64 h-screen flex flex-col border-r text-black border-gray-200 bg-[#F6F2FD] relative">
      {/* Personal */}
      <div className="px-4 py-2 text-xs font-bold text-gray-500">Personal</div>
      {links.slice(0, 4).map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => isActive ? "text-[#6629DE] font-bold flex items-center gap-2 px-4 py-2" : "flex items-center gap-2 px-4 py-2"}
          onClick={e => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate();
              navigate(link.to);
            }
          }}
        >
          {link.icon} {link.label}
        </NavLink>
      ))}
      {/* Workspace */}
      <div className="px-4 py-2 text-xs font-bold text-gray-500">Workspace</div>
      {links.slice(4).map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => isActive ? "text-[#6629DE] font-bold flex items-center gap-2 px-4 py-2" : "flex items-center gap-2 px-4 py-2"}
          onClick={e => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate();
              navigate(link.to);
            }
          }}
        >
          {link.icon} {link.label}
        </NavLink>
      ))}
    </aside>
  );
}