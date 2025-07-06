import { useState } from "react";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

const channels = [
  { name: "General", type: "public", joined: true, members: 14 },
  { name: "Design Team", type: "public", joined: true, members: 14 },
  { name: "Marketing Team", type: "private", joined: true, members: 14 },
];

export default function MainChannels() {
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredChannels =
    typeFilter === "All"
      ? channels
      : channels.filter((c) => c.type === typeFilter.toLowerCase());

  return (
    <div className="max-w-[1255px] p-8">
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          className="border border-gray-300 rounded px-3 py-1 text-sm"
          value="All"
          disabled
        >
          <option value="All">All</option>
        </select>

        <select
          className="border border-gray-300 rounded px-3 py-1 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">Type</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* Channel List */}
      <div className="border border-[#A1A1A1] rounded-md shadow bg-[#E2E2E2] mr-20 pb-8">
        {filteredChannels.map((channel, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 py-4 hover:bg-[#B1B1B1] transition duration-300"
          >
            <div className="text-gray-600 text-xl">
              {channel.type === "public" ? "#" : <Lock size={18} />}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{channel.name}</span>
              <Link to={`/workspace/channels/chat`} className="text-green-600 cursor-pointer text-sm">joined</Link>
              <span className="text-sm text-gray-500">
                {channel.members} members
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
