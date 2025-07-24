import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import socketService from "../../services/socket/socketService";
import { getWorkspaceChannels, createChannel, leaveChannel } from "../../services/api/channels/channelsApi";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'voice';
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  channelId?: string;
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  replyTo?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
    };
  };
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private';
  workspaceId: string;
  createdAt: string;
  members: {
    id: string;
    name: string;
    role: 'admin' | 'member';
  }[];
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  // Messages
  messages: Record<string, Message[]>; // channelId/conversationId -> messages[]
  currentChannel: Channel | null;
  currentConversation: Conversation | null;
  
  // Channels
  channels: Channel[];
  
  // Direct Messages
  conversations: Conversation[];
  
  // UI State
  activeChat: {
    type: 'channel' | 'dm';
    id: string;
  } | null;
  
  // Loading states
  loading: boolean;
  sendingMessage: boolean;
  error: string | null;
  
  // Typing indicators
  typingUsers: Record<string, string[]>; // chatId -> userIds[]
}

const initialState: ChatState = {
  messages: {},
  currentChannel: null,
  currentConversation: null,
  channels: [],
  conversations: [],
  activeChat: null,
  loading: false,
  sendingMessage: false,
  error: null,
  typingUsers: {}
};

// Async thunks for API calls
export const fetchWorkspaceChannels = createAsyncThunk(
  'chat/fetchWorkspaceChannels',
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const channels = await getWorkspaceChannels(workspaceId);
      return channels;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch channels');
    }
  }
);

export const createNewChannel = createAsyncThunk(
  'chat/createNewChannel',
  async ({ workspaceId, channelData }: { 
    workspaceId: string; 
    channelData: { name: string; description?: string; type: 'public' | 'private' } 
  }, { rejectWithValue }) => {
    try {
      const newChannel = await createChannel(workspaceId, channelData);
      return newChannel;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create channel');
    }
  }
);

export const leaveChannelThunk = createAsyncThunk(
  'chat/leaveChannel',
  async ({ workspaceId, channelId }: { workspaceId: string; channelId: string }, { rejectWithValue }) => {
    try {
      await leaveChannel(workspaceId, channelId);
      return channelId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to leave channel');
    }
  }
);

// Socket-based actions (no async thunks needed)
export const socketActions = {
  // Channel actions
  fetchChannelMessages: (channelId: string) => {
    socketService.emit('getAllMessages', { channelId });
  },
  
  sendChannelMessage: (channelId: string, content: string) => {
    socketService.emit('sendMessage', { channelId, content });
  },
  
  joinChannel: (channelId: string) => {
    socketService.emit('joinChannel', { channelId });
  },
  
  editMessage: (messageId: string, newContent: string) => {
    socketService.emit('editMessage', { messageId, newContent });
  },
  
  deleteMessage: (messageId: string) => {
    socketService.emit('message:delete', { messageId });
  },
  
  // DM actions
  fetchDMMessages: (conversationId: string) => {
    socketService.emit('dm:getAll', { conversationId });
  },
  
  sendDMMessage: (conversationId: string, content: string) => {
    socketService.emit('dm:send', { conversationId, content });
  },
  
  joinDM: (conversationId: string) => {
    socketService.emit('join:dm', { conversationId });
  },
  
  // Typing actions
  startTyping: (channelId: string) => {
    socketService.emit('typing', { channelId });
  },
  
  stopTyping: (channelId: string) => {
    socketService.emit('stopTyping', { channelId });
  },
  
  startDMTyping: (conversationId: string) => {
    socketService.emit('dm:typing', { conversationId });
  },
  
  stopDMTyping: (conversationId: string) => {
    socketService.emit('dm:stopTyping', { conversationId });
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setSendingMessage: (state, action: PayloadAction<boolean>) => {
      state.sendingMessage = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Socket event handlers
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
      state.loading = false;
    },
    
    // Message management
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
      state.sendingMessage = false;
    },
    
    updateMessageInState: (state, action: PayloadAction<{ chatId: string; messageId: string; updates: Partial<Message> }>) => {
      const { chatId, messageId, updates } = action.payload;
      const messages = state.messages[chatId];
      if (messages) {
        const messageIndex = messages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          state.messages[chatId][messageIndex] = { ...messages[messageIndex], ...updates };
        }
      }
    },
    
    removeMessage: (state, action: PayloadAction<{ chatId: string; messageId: string }>) => {
      const { chatId, messageId } = action.payload;
      if (state.messages[chatId]) {
        state.messages[chatId] = state.messages[chatId].filter(m => m.id !== messageId);
      }
    },
    
    // Active chat management
    setActiveChat: (state, action: PayloadAction<{ type: 'channel' | 'dm'; id: string }>) => {
      state.activeChat = action.payload;
    },
    
    clearActiveChat: (state) => {
      state.activeChat = null;
    },
    
    // Channel management
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      state.channels = action.payload;
    },
    
    setCurrentChannel: (state, action: PayloadAction<Channel | null>) => {
      state.currentChannel = action.payload;
    },
    
    // Conversation management
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    
    // Typing indicators
    setTypingUsers: (state, action: PayloadAction<{ chatId: string; userIds: string[] }>) => {
      const { chatId, userIds } = action.payload;
      state.typingUsers[chatId] = userIds;
    },
    
    addTypingUser: (state, action: PayloadAction<{ chatId: string; userId: string }>) => {
      const { chatId, userId } = action.payload;
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = [];
      }
      if (!state.typingUsers[chatId].includes(userId)) {
        state.typingUsers[chatId].push(userId);
      }
    },
    
    removeTypingUser: (state, action: PayloadAction<{ chatId: string; userId: string }>) => {
      const { chatId, userId } = action.payload;
      if (state.typingUsers[chatId]) {
        state.typingUsers[chatId] = state.typingUsers[chatId].filter(id => id !== userId);
      }
    },
    
    // Utility
    clearError: (state) => {
      state.error = null;
    },
    
    resetChatState: (state) => {
      state.messages = {};
      state.currentChannel = null;
      state.currentConversation = null;
      state.channels = [];
      state.conversations = [];
      state.activeChat = null;
      state.loading = false;
      state.sendingMessage = false;
      state.error = null;
      state.typingUsers = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch workspace channels
      .addCase(fetchWorkspaceChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
        state.error = null;
      })
      .addCase(fetchWorkspaceChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create new channel
      .addCase(createNewChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channels.push(action.payload);
        state.error = null;
      })
      .addCase(createNewChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Leave channel
      .addCase(leaveChannelThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveChannelThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the channel from the channels array
        state.channels = state.channels.filter(channel => channel.id !== action.payload);
        // Clear current channel if it's the one being left
        if (state.currentChannel?.id === action.payload) {
          state.currentChannel = null;
        }
        state.error = null;
      })
      .addCase(leaveChannelThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setLoading,
  setSendingMessage,
  setError,
  setMessages,
  addMessage,
  updateMessageInState,
  removeMessage,
  setActiveChat,
  clearActiveChat,
  setChannels,
  setCurrentChannel,
  setConversations,
  setCurrentConversation,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  clearError,
  resetChatState
} = chatSlice.actions;

export default chatSlice.reducer;
