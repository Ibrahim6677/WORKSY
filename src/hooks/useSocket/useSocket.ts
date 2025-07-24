import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import socketService from '../../services/socket/socketService';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // other properties...
}

export const useSocket = () => {
  const { token, user } = useSelector((state: RootState) => ({
    token: state.auth?.token,
    user: state.auth?.user
  }));

  // Initialize socket connection
  useEffect(() => {
    if (token && user) {
      // Connect using the same base URL as API
      socketService.connect(token);
    }

    return () => {
      socketService.disconnect();
    };
  }, [token, user]);

  // Channel methods
  const joinChannel = useCallback((channelId: string) => {
    socketService.joinChannel(channelId);
  }, []);

  const sendMessage = useCallback((channelId: string, content: string) => {
    socketService.sendChannelMessage(channelId, content);
  }, []);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    socketService.editMessage(messageId, newContent);
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    socketService.deleteMessage(messageId);
  }, []);

  // DM methods
  const joinDM = useCallback((conversationId: string) => {
    socketService.joinDM(conversationId);
  }, []);

  const sendDMMessage = useCallback((conversationId: string, content: string) => {
    socketService.sendDMMessage(conversationId, content);
  }, []);

  // Typing methods
  const startTyping = useCallback((channelId: string) => {
    socketService.startTyping(channelId);
  }, []);

  const stopTyping = useCallback((channelId: string) => {
    socketService.stopTyping(channelId);
  }, []);

  const startDMTyping = useCallback((conversationId: string) => {
    socketService.startDMTyping(conversationId);
  }, []);

  const stopDMTyping = useCallback((conversationId: string) => {
    socketService.stopDMTyping(conversationId);
  }, []);

  // Reaction methods
  const addReaction = useCallback((messageId: string, emoji: string) => {
    socketService.addReaction(messageId, emoji);
  }, []);

  // Event listeners
  const onNewMessage = useCallback((callback: (message: any) => void) => {
    socketService.on('newMessage', callback);
    return () => socketService.off('newMessage', callback);
  }, []);

  const onDMMessage = useCallback((callback: (message: any) => void) => {
    socketService.on('dm:newMessage', callback);
    return () => socketService.off('dm:newMessage', callback);
  }, []);

  const onMessageDeleted = useCallback((callback: (data: { messageId: string }) => void) => {
    socketService.on('message:deleted', callback);
    return () => socketService.off('message:deleted', callback);
  }, []);

  const onUserTyping = useCallback((callback: (data: { userId: string }) => void) => {
    socketService.on('userTyping', callback);
    return () => socketService.off('userTyping', callback);
  }, []);

  const onUserStoppedTyping = useCallback((callback: (data: { userId: string }) => void) => {
    socketService.on('userStoppedTyping', callback);
    return () => socketService.off('userStoppedTyping', callback);
  }, []);

  const onReactionUpdated = useCallback((callback: (data: { messageId: string; reactions: any[] }) => void) => {
    socketService.on('reaction:updated', callback);
    return () => socketService.off('reaction:updated', callback);
  }, []);

  return {
    // Connection status
    isConnected: socketService.isConnected(),
    
    // Channel methods
    joinChannel,
    sendMessage,
    editMessage,
    deleteMessage,
    
    // DM methods
    joinDM,
    sendDMMessage,
    
    // Typing methods
    startTyping,
    stopTyping,
    startDMTyping,
    stopDMTyping,
    
    // Reaction methods
    addReaction,
    
    // Event listeners
    onNewMessage,
    onDMMessage,
    onMessageDeleted,
    onUserTyping,
    onUserStoppedTyping,
    onReactionUpdated,
    
    // Direct socket access for advanced usage
    socketService
  };
};
