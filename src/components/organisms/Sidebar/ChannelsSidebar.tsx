import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaHashtag,
  FaPlus,
} from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";

const channels = [
  { name: "General", path: "/workspace/channels/chat" },
  { name: "Design Team", path: "/workspace/channels/chat" },
  { name: "Marketing Team", path: "/workspace/channels/chat" },
];
const directMessages = [
  {
    name: "George Alan",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Safiya Fareena",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

export default function ChannelsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmOpen, setDmOpen] = useState(true);
  const [selected, setSelected] = useState<string>("General");

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
              <div
                key={dm.name}
                className="flex items-center gap-2 py-1  text-sm"
              >
                <img
                  src={dm.avatar}
                  alt={dm.name}
                  className="w-5 h-5 rounded-full"
                />
                <span>{dm.name}</span>
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
