import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaHashtag,
  FaPlus,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useWorkspaceParams } from "../../../hooks/useWorkspace/useWorkspaceParams";

export default function ChannelsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { workspaceId } = useWorkspaceParams();
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmOpen, setDmOpen] = useState(true);
  
  // If no workspace ID, default to a fallback
  const wsId = workspaceId || 'default';
  
  const channels = [
    { name: "General", path: `/workspace/${wsId}/channels/general` },
    { name: "Design Team", path: `/workspace/${wsId}/channels/design-team` },
    { name: "Marketing Team", path: `/workspace/${wsId}/channels/marketing-team` },
  ];
  
  const directMessages = [
    {
      name: "George Alan",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      path: `/workspace/${wsId}/dms/george-alan`
    },
    {
      name: "Safiya Fareena", 
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      path: `/workspace/${wsId}/dms/safiya-fareena`
    },
  ];
  
  return (
    <aside className="w-64 h-screen flex flex-col border-r text-black border-gray-200 bg-[#F6F2FD] relative">
      {/* Search */}
      <NavLink
        to="#"
        onClick={e => {
          if (onNavigate) {
            e.preventDefault();
            onNavigate();
            navigate("#");
          }
        }}
        className={({ isActive }) =>
          `hidden md:flex items-center gap-2 px-4 font-bold mt-3 py-2 hover:bg-[#ede7fa] rounded transition ${isActive ? "text-[#6629DE]" : ""}`
        }
      >
        <FaSearch className="text-sm" />
        <span className="text-sm font-semibold">Search</span>
      </NavLink>
      {/* Channels */}
      <div className="mt-4">
        <button
          onClick={() => setChannelsOpen((v) => !v)}
          className="flex items-center w-full px-4 py-2 gap-2 font-bold hover:bg-[#ede7fa] rounded transition text-sm"
        >
          {channelsOpen ? (
            <FaChevronDown className="text-sm" />
          ) : (
            <FaChevronUp className="text-sm" />
          )}
          <span>Channels</span>
        </button>
        {channelsOpen && (
          <div className="pl-6">
            {channels.map((ch) => (
              <NavLink
                to={ch.path}
                key={ch.name}
                onClick={e => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate();
                    navigate(ch.path);
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-1 text-sm cursor-pointer px-2 rounded ${isActive ? "text-[#6629DE] font-bold bg-[#ede7fa]" : "hover:bg-[#f3eaff]"}`
                }
              >
                <FaHashtag className="text-sm" />
                <span>{ch.name}</span>
              </NavLink>
            ))}
            <button className="flex items-center gap-2 text-sm text-[#6629DE] mt-2 hover:underline">
              <FaPlus /> Add channel
            </button>
          </div>
        )}
      </div>
      {/* Direct Messages */}
      <div className="mt-6">
        <button
          onClick={() => setDmOpen((v) => !v)}
          className="flex items-center w-full px-4 py-2 gap-2 font-bold hover:bg-[#ede7fa] rounded transition text-sm"
        >
          {dmOpen ? (
            <FaChevronDown className="text-sm" />
          ) : (
            <FaChevronUp className="text-sm" />
          )}
          <span>Direct Messages</span>
          <span className="ml-auto bg-[#a38bd2] text-white text-[10px] rounded-full px-2 py-0.5">
            12
          </span>
        </button>
        {dmOpen && (
          <div className="pl-7">
            {directMessages.map((dm) => (
              <div key={dm.name} className="group relative">
                <NavLink
                  to={dm.path}
                  onClick={() => onNavigate?.()}
                  className={({ isActive }) =>
                    `flex items-center gap-2 py-1 text-sm hover:bg-[#ede7fa] rounded px-2 transition ${
                      isActive ? "text-[#6629DE] bg-[#ede7fa]" : ""
                    }`
                  }
                >
                  <img
                    src={dm.avatar}
                    alt={dm.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="flex-1">{dm.name}</span>
                  
                  {/* Call button - shows on hover */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const dmCallId = dm.path.split('/').pop(); // Extract DM ID from path
                      if (onNavigate) {
                        onNavigate();
                        navigate(`/workspace/${wsId}/dms/${dmCallId}/call`);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#d4c5f0] transition-all"
                    title={`Call ${dm.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 22 22"
                      fill="none"
                      className="text-[#6629DE]"
                    >
                      <path
                        d="M19.3789 16.0703C18.6966 15.3828 17.044 14.3795 16.2422 13.9751C15.198 13.4492 15.1121 13.4062 14.2914 14.016C13.744 14.4229 13.38 14.7864 12.7394 14.6498C12.0987 14.5131 10.7065 13.7427 9.4875 12.5275C8.26848 11.3124 7.45336 9.87979 7.31629 9.24127C7.17922 8.60276 7.54875 8.24311 7.9518 7.6944C8.51985 6.92096 8.47688 6.79206 7.99133 5.74792C7.61277 4.93581 6.58024 3.2987 5.89016 2.61979C5.15195 1.89061 5.15196 2.01952 4.67629 2.21717C4.28903 2.38007 3.91751 2.57813 3.56641 2.80885C2.87891 3.26561 2.49735 3.64502 2.23051 4.21522C1.96367 4.78542 1.84379 6.12217 3.2218 8.62553C4.59981 11.1289 5.5666 12.4089 7.56766 14.4044C9.56871 16.3999 11.1074 17.4728 13.3568 18.7344C16.1395 20.2928 17.2068 19.989 17.7788 19.7226C18.3507 19.4562 18.7318 19.0781 19.1894 18.3906C19.4207 18.0401 19.6192 17.669 19.7824 17.282C19.9805 16.8081 20.1094 16.8081 19.3789 16.0703Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                      />
                    </svg>
                  </button>
                </NavLink>
              </div>
            ))}
          </div>
        )}
        <button className="pl-7 flex items-center gap-2 text-sm text-[#6629DE] mt-2 hover:underline">
          <FaPlus /> Add channel
        </button>
      </div>
    </aside>
  );
}
