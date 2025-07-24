import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Lock, Plus, X, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useWorkspaceParams } from "../../hooks/useWorkspace/useWorkspaceParams";
import { fetchWorkspaceChannels, createNewChannel, leaveChannelThunk } from "../../features/chat/chatSlice";
import type { AppDispatch, RootState } from "../../store/store";

export default function MainChannels() {
  const dispatch = useDispatch<AppDispatch>();
  const { workspaceId } = useWorkspaceParams();
  const [typeFilter, setTypeFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const [createChannelData, setCreateChannelData] = useState({
    name: "",
    description: "",
    type: "public" as "public" | "private"
  });

  const { channels, loading, error } = useSelector((state: RootState) => ({
    channels: state.chat.channels,
    loading: state.chat.loading,
    error: state.chat.error
  }));

  // Fetch channels when component mounts or workspace changes
  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchWorkspaceChannels(workspaceId));
    }
  }, [dispatch, workspaceId]);

  const filteredChannels =
    typeFilter === "All"
      ? channels
      : channels.filter((c) => c.type === typeFilter.toLowerCase());

  const handleCreateChannel = async () => {
    if (!workspaceId || !createChannelData.name.trim()) return;
    
    try {
      await dispatch(createNewChannel({
        workspaceId,
        channelData: {
          name: createChannelData.name.trim(),
          description: createChannelData.description.trim() || undefined,
          type: createChannelData.type
        }
      })).unwrap();
      
      // Reset form and close modal
      setCreateChannelData({ name: "", description: "", type: "public" });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  };

  const handleLeaveChannel = async (channelId: string, channelName: string) => {
    if (!workspaceId) return;
    
    const confirmLeave = window.confirm(`Are you sure you want to leave the channel "${channelName}"?`);
    if (!confirmLeave) return;
    
    try {
      await dispatch(leaveChannelThunk({ workspaceId, channelId })).unwrap();
      console.log(`Successfully left channel ${channelId}: ${channelName}`);
    } catch (error) {
      console.error('Failed to leave channel:', error);
      alert('Failed to leave channel. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1255px] p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1255px] p-8">
        <div className="text-red-600 text-center">
          <p>Error loading channels: {error}</p>
          <button 
            onClick={() => workspaceId && dispatch(fetchWorkspaceChannels(workspaceId))}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1255px] p-8">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Channels</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Channel
        </button>
      </div>

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
        {filteredChannels.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No channels found
              </h3>
              <p className="text-gray-600">
                {typeFilter === "All" 
                  ? "No channels have been created yet." 
                  : `No ${typeFilter.toLowerCase()} channels found.`
                }
              </p>
            </div>
          </div>
        ) : (
          filteredChannels.map((channel) => (
            <div
              key={channel.id}
              className="relative flex items-center gap-3 px-6 py-4 hover:bg-[#B1B1B1] transition duration-300 group"
              onMouseEnter={() => setHoveredChannel(channel.id)}
              onMouseLeave={() => setHoveredChannel(null)}
            >
              <div className="text-gray-600 text-xl">
                {channel.type === "public" ? "#" : <Lock size={18} />}
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-medium text-gray-800">{channel.name}</span>
                <Link 
                  to={`/workspace/${workspaceId}/channels/${channel.id}`} 
                  className="text-green-600 cursor-pointer text-sm hover:underline"
                >
                  joined
                </Link>
                <span className="text-sm text-gray-500">
                  {channel.members.length} members
                </span>
                {channel.description && (
                  <span className="text-sm text-gray-400 mt-1">
                    {channel.description}
                  </span>
                )}
              </div>
              
              {/* Leave Button - Show on Hover */}
              {hoveredChannel === channel.id && (
                <button
                  onClick={() => handleLeaveChannel(channel.id, channel.name)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  title="Leave Channel"
                >
                  <LogOut size={14} />
                  Leave
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Create New Channel</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Channel Name *
                </label>
                <input
                  type="text"
                  value={createChannelData.name}
                  onChange={(e) => setCreateChannelData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter channel name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={createChannelData.description}
                  onChange={(e) => setCreateChannelData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter channel description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Channel Type
                </label>
                <select
                  value={createChannelData.type}
                  onChange={(e) => setCreateChannelData(prev => ({ ...prev, type: e.target.value as "public" | "private" }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChannel}
                disabled={!createChannelData.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
