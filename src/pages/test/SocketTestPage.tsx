import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../hooks/useSocket/useSocket';
import socketService from '../../services/socket/socketService';
import { getSocketUrl } from '../../utils/constants/socketConfig';
import type { RootState } from '../../store';
import type { User } from '../../utils/types/user'; 

export interface AuthState {
  user?: User;
  token?: string;
}

export default function SocketTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [messages, setMessages] = useState<string[]>([]);
  const [testChannelId] = useState('test-channel');
  const [testMessage, setTestMessage] = useState('');
  const [serverUrl] = useState(getSocketUrl());

  const { token, user } = useSelector((state: RootState) => ({
    token: state.auth?.token,
    user: state.auth?.user
  }));

  const {
    joinChannel,
    sendMessage,
    onNewMessage,
    isConnected
  } = useSocket();

  // Monitor connection status
  useEffect(() => {
    const updateStatus = () => {
      if (isConnected) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Listen for new messages
  useEffect(() => {
    const cleanup = onNewMessage((message) => {
      setMessages(prev => [...prev, `${message.sender?.name || 'Unknown'}: ${message.content}`]);
    });

    return cleanup;
  }, [onNewMessage]);

  // Join test channel on connection
  useEffect(() => {
    if (isConnected && testChannelId) {
      joinChannel(testChannelId);
      setMessages(prev => [...prev, `✅ Joined channel: ${testChannelId}`]);
    }
  }, [isConnected, testChannelId, joinChannel]);

  const handleSendTestMessage = () => {
    if (testMessage.trim() && isConnected) {
      sendMessage(testChannelId, testMessage);
      setMessages(prev => [...prev, `➤ Sent: ${testMessage}`]);
      setTestMessage('');
    }
  };

  const handleConnect = () => {
    if (token) {
      setConnectionStatus('connecting');
      socketService.connect(token);
    }
  };

  const handleDisconnect = () => {
    socketService.disconnect();
    setConnectionStatus('disconnected');
    setMessages(prev => [...prev, '❌ Disconnected from server']);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return '🟢';
      case 'connecting': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Socket.IO Connection Test</h1>
          
          {/* Connection Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Server URL</h3>
              <p className="text-sm text-gray-900 font-mono break-all">{serverUrl}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <p className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusIcon()} {connectionStatus.toUpperCase()}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">User</h3>
              <p className="text-sm text-gray-900">{user?.name || 'Not logged in'}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleConnect}
              disabled={connectionStatus === 'connected' || connectionStatus === 'connecting' || !token}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Connect
            </button>
            
            <button
              onClick={handleDisconnect}
              disabled={connectionStatus === 'disconnected'}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Disconnect
            </button>
            
            <button
              onClick={clearMessages}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear Messages
            </button>
          </div>

          {/* Authentication Warning */}
          {!token && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Authentication Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>You need to be logged in to test Socket.IO connection.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Testing */}
        {isConnected && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Test Message</h2>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendTestMessage()}
                placeholder="Enter test message..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendTestMessage}
                disabled={!testMessage.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Channel: {testChannelId}
            </p>
          </div>
        )}

        {/* Messages Log */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages Log</h2>
            <span className="text-sm text-gray-500">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages yet...</p>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Debug Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Socket Service Status</h3>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                <p>Connected: {socketService.isConnected() ? 'Yes' : 'No'}</p>
                <p>Socket ID: {socketService.isConnected() ? 'Available' : 'None'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Environment</h3>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                <p>NODE_ENV: {process.env.NODE_ENV || 'development'}</p>
                <p>Build: {process.env.REACT_APP_VERSION || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
