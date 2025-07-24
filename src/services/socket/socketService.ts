import { io, Socket } from 'socket.io-client';
import { getSocketUrl, getSocketOptions } from '../../utils/constants/socketConfig';

export interface SocketEvents {
  // Channel Events
  'getAllMessages': (data: { channelId: string; query?: object }) => void;
  'allMessages': (messages: any[]) => void;
  'joinChannel': (data: { channelId: string }) => void;
  'sendMessage': (data: { channelId: string; content: string }) => void;
  'newMessage': (message: any) => void;
  'editMessage': (data: { messageId: string; newContent: string }) => void;
  'message:edit:success': (message: any) => void;
  'message:edit:error': (error: { message: string }) => void;
  'message:delete': (data: { messageId: string }) => void;
  'message:delete:success': (message: any) => void;
  'message:deleted': (data: { messageId: string }) => void;
  'typing': (data: { channelId: string }) => void;
  'userTyping': (data: { userId: string }) => void;
  'stopTyping': (data: { channelId: string }) => void;
  'userStoppedTyping': (data: { userId: string }) => void;

  // DM Events
  'join:dm': (data: { conversationId: string }) => void;
  'dm:send': (data: { conversationId: string; content: string }) => void;
  'dm:newMessage': (message: any) => void;
  'dm:typing': (data: { conversationId: string }) => void;
  'dm:userTyping': (data: { userId: string }) => void;
  'dm:stopTyping': (data: { conversationId: string }) => void;
  'dm:userStoppedTyping': (data: { userId: string }) => void;
  'dm:getAll': (data: { conversationId: string; query?: object }) => void;
  'dm:message:delete': (data: { messageId: string }) => void;
  'dm:message:delete:success': (message: any) => void;
  'dm:message:deleted': (data: { messageId: string }) => void;
  'dm:message:edit': (data: { messageId: string; newContent: string }) => void;
  'dm:message:edit:success': (message: any) => void;
  'dm:message:edit:error': (error: { message: string }) => void;

  // DM Call Events
  'dm:call:offer': (data: { conversationId: string; offer: object }) => void;
  'dm:call:incomingOffer': (data: { fromUserId: string; offer: object }) => void;
  'dm:call:answer': (data: { conversationId: string; answer: object }) => void;
  'dm:call:iceCandidate': (data: { conversationId: string; candidate: object }) => void;
  'dm:call:end': (data: { conversationId: string }) => void;
  'dm:call:busy': (data: { toUserId: string; fromUserId?: string }) => void;
  'dm:call:screenShareOffer': (data: { conversationId: string; offer: object }) => void;
  'dm:call:incomingScreenShareOffer': (data: { fromUserId: string; offer: object }) => void;
  'dm:call:screenShareAnswer': (data: { conversationId: string; answer: object }) => void;
  'dm:call:screenShareIceCandidate': (data: { conversationId: string; candidate: object }) => void;
  'dm:call:stopScreenShare': (data: { conversationId: string }) => void;
  'dm:call:screenStopped': (data: { fromUserId: string }) => void;
  'dm:call:inCallMessage': (data: { conversationId: string; content: string }) => void;
  'dm:call:inCallNewMessage': (data: { fromUserId: string; content: string; timestamp: string }) => void;

  // Reaction Events
  'reaction:addOrUpdate': (data: { messageId: string; emoji: string }) => void;
  'reaction:updated': (data: { messageId: string; reactions: any[] }) => void;
  'reaction:get': (messageId: string) => void;
  'reaction:list': (data: { messageId: string; reactions: any[] }) => void;
  'reaction:error': (error: { message: string }) => void;

  // User Events
  'user:updateFcmToken': (data: { token: string }) => void;
  'user:updateFcmToken:success': (token: string) => void;
  'user:updateFcmToken:error': (error: string) => void;
}

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(token: string): void {
    if (this.socket) {
      this.socket.disconnect();
    }

    // Use the configured Socket URL and options
    const socketUrl = getSocketUrl();
    const socketOptions = getSocketOptions(token);

    this.socket = io(socketUrl, socketOptions);

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit<K extends keyof SocketEvents>(event: K, data: Parameters<SocketEvents[K]>[0]): void {
    if (!this.socket) {
      console.warn('Socket not connected');
      return;
    }
    this.socket.emit(event as string, data);
  }

  on<K extends keyof SocketEvents>(event: K, callback: (...args: any[]) => void): void {
    if (!this.socket) {
      console.warn('Socket not connected');
      return;
    }
    this.socket.on(event as string, callback);
  }

  off<K extends keyof SocketEvents>(event: K, callback?: (...args: any[]) => void): void {
    if (!this.socket) {
      console.warn('Socket not connected');
      return;
    }
    this.socket.off(event as string, callback);
  }

  // Helper methods for common operations
  joinChannel(channelId: string): void {
    this.emit('joinChannel', { channelId });
  }

  sendChannelMessage(channelId: string, content: string): void {
    this.emit('sendMessage', { channelId, content });
  }

  joinDM(conversationId: string): void {
    this.emit('join:dm', { conversationId });
  }

  sendDMMessage(conversationId: string, content: string): void {
    this.emit('dm:send', { conversationId, content });
  }

  startTyping(channelId: string): void {
    this.emit('typing', { channelId });
  }

  stopTyping(channelId: string): void {
    this.emit('stopTyping', { channelId });
  }

  startDMTyping(conversationId: string): void {
    this.emit('dm:typing', { conversationId });
  }

  stopDMTyping(conversationId: string): void {
    this.emit('dm:stopTyping', { conversationId });
  }

  addReaction(messageId: string, emoji: string): void {
    this.emit('reaction:addOrUpdate', { messageId, emoji });
  }

  deleteMessage(messageId: string): void {
    this.emit('message:delete', { messageId });
  }

  editMessage(messageId: string, newContent: string): void {
    this.emit('editMessage', { messageId, newContent });
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default SocketService.getInstance();
