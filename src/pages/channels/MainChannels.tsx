import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import { fetchWorkspaceChannels, createNewChannel, leaveChannelThunk } from "../../features/chat/chatSlice";
import { Lock, Plus, X, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useWorkspaceParams } from "../../hooks/useWorkspace/useWorkspaceParams";

const MainChannels = () => {
  const { workspaceId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const [createChannelData, setCreateChannelData] = useState({
    name: "",
    description: "",
    type: "public" as "public" | "private"
  });

  // Fetch channels when component mounts or workspace changes
  useEffect(() => {
    if (workspaceId) {
      dispatch(fetchWorkspaceChannels(workspaceId));
    }
  }, [dispatch, workspaceId]);

  const channelsState = useSelector((state: RootState) => state.channel);
  const { 
    channels = [], 
    loading = false, 
    error = null 
  } = channelsState || {};

  // Filter channels based on search query and type
  let filteredChannels: any[] = [];
  
  try {
    if (Array.isArray(channels)) {
      filteredChannels = channels.filter((channel: any) => 
        channel?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      console.warn('⚠️ channels is not an array, defaulting to empty array');
      filteredChannels = [];
    }
  } catch (error) {
    console.error('❌ Error filtering channels:', error);
    filteredChannels = [];
  }

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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading channels...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Channels</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Final check for data type
  if (!Array.isArray(filteredChannels)) {
    console.error('❌ CRITICAL: filteredChannels is not an array!');
    console.error('❌ filteredChannels value:', filteredChannels);
    console.error('❌ filteredChannels type:', typeof filteredChannels);
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Data Format Error</h2>
        <div className="text-sm text-gray-600 mb-4 space-y-1">
          <p>Expected: Array</p>
          <p>Got: {typeof filteredChannels}</p>
          <p>Value: {JSON.stringify(filteredChannels)}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Channels</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Channels List */}
      {filteredChannels.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-300 text-8xl mb-6">💬</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">
            {searchQuery ? 'No Channels Found' : 'No Channels Available'}
          </h3>
          <p className="text-gray-500 mb-8">
            {searchQuery 
              ? `No channels match "${searchQuery}"`
              : 'Create your first channel to start communicating with your team!'
            }
          </p>
          {!searchQuery && (
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Create Channel
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {Array.isArray(filteredChannels) && filteredChannels.map((channel: any, index: number) => (
            <div
              key={channel?.id || `channel-${index}`}
              className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                console.log('Opening channel:', channel?.name);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">
                      #{channel?.name?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      #{channel?.name || 'Unnamed Channel'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {channel?.description || 'No description available'}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {channel?.memberCount || 0} members
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
};

export default MainChannels;
