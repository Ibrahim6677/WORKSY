import { API_BASE_URL } from './apiRoutes';

export const SOCKET_CONFIG = {
  // Use the same base URL as the API
  serverUrl: API_BASE_URL,
  
  // Socket.IO connection options
  options: {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 5,
    randomizationFactor: 0.5,
    
    // Enable debugging in development
    debug: process.env.NODE_ENV === 'development'
  },
  
  // Event configuration
  events: {
    // Connection events
    connect: 'connect',
    disconnect: 'disconnect',
    connect_error: 'connect_error',
    
    // Channel events
    joinChannel: 'joinChannel',
    sendMessage: 'sendMessage',
    newMessage: 'newMessage',
    getAllMessages: 'getAllMessages',
    allMessages: 'allMessages',
    
    // DM events
    joinDM: 'join:dm',
    sendDMMessage: 'dm:send',
    newDMMessage: 'dm:newMessage',
    getAllDMMessages: 'dm:getAll',
    allDMMessages: 'dm:allMessages',
    
    // Typing events
    typing: 'typing',
    userTyping: 'userTyping',
    stopTyping: 'stopTyping',
    userStoppedTyping: 'userStoppedTyping',
    
    // Message actions
    editMessage: 'editMessage',
    deleteMessage: 'message:delete',
    messageDeleted: 'message:deleted',
    
    // Reactions
    addReaction: 'reaction:addOrUpdate',
    reactionUpdated: 'reaction:updated'
  }
};

// Helper function to get Socket URL
export const getSocketUrl = (): string => {
  return SOCKET_CONFIG.serverUrl;
};

// Helper function to get connection options
export const getSocketOptions = (token: string) => ({
  ...SOCKET_CONFIG.options,
  auth: {
    token: `Bearer ${token}`
  }
});
