import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaHashtag,
  FaPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

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

export default function ChannelsSidebar() {
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmOpen, setDmOpen] = useState(true);
  const [selected, setSelected] = useState<string>("General");

  return (
    <aside className="w-64 h-screen flex flex-col border-r text-black border-gray-200 bg-[#F6F2FD] relative">
      {/* Search */}
      <Link
        to="#"
        onClick={() => setSelected("Search")}
        className={`flex items-center gap-2 px-3 font-bold mt-3 py-2 hover:bg-[#ede7fa] rounded transition ${selected === "Search" ? "text-[#6629DE]" : ""}`}
      >
        <FaSearch className="text-sm" />
        <span className="text-sm font-semibold">Search</span>
      </Link>
      {/* Channels */}
      <div className="">
        <button
          onClick={() => setChannelsOpen((v) => !v)}
          className="flex items-center w-full px-3 py-2 gap-2  font-bold hover:bg-[#ede7fa] rounded transition text-sm"
        >
          {channelsOpen ? (
            <FaChevronDown className="text-sm" />
          ) : (
            <FaChevronUp className="text-sm" />
          )}
          <span>Channels</span>
        </button>
        {channelsOpen && (
          <div className="pl-7">
            {channels.map((ch) => (
              <Link
                to={ch.path}
                key={ch.name}
                onClick={() => setSelected(ch.name)}
                className={`flex items-center gap-2 py-1 text-sm cursor-pointer ${selected === ch.name ? "text-[#6629DE] font-bold" : ""}`}
              >
                <FaHashtag className="text-sm" />
                <span>{ch.name}</span>
              </Link>
            ))}
            <button className="flex items-center gap-2 text-sm text-[#6629DE] mt-2 hover:underline">
              <FaPlus /> Add channel
            </button>
          </div>
        )}
      </div>
      {/* Direct Messages */}
      <div className="mt-3">
        <button
          onClick={() => setDmOpen((v) => !v)}
          className="flex items-center w-full px-3 py-2 gap-2  font-bold hover:bg-[#ede7fa] rounded transition text-sm"
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
