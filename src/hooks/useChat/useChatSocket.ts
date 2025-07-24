import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSocket } from '../useSocket/useSocket';
import { 
  setMessages, 
  addMessage, 
  updateMessageInState, 
  removeMessage,
  addTypingUser,
  removeTypingUser,
  socketActions,
  setLoading,
  setSendingMessage,
  setError
} from '../../features/chat/chatSlice';
import type { Message } from '../../features/chat/chatSlice';
import type { AppDispatch } from '../../store/store';

export const useChatSocket = () => {
  const dispatch = useDispatch();
  const { 
    onNewMessage, 
    onDMMessage, 
    onMessageDeleted, 
    onUserTyping, 
    onUserStoppedTyping,
    socketService 
  } = useSocket();

  // Setup event listeners
  useEffect(() => {
    // Listen for channel messages
    const unsubscribeNewMessage = onNewMessage((message: Message) => {
      const chatId = message.channelId || message.conversationId;
      if (chatId) {
        dispatch(addMessage({ chatId, message }));
      }
    });

    // Listen for DM messages
    const unsubscribeDMMessage = onDMMessage((message: Message) => {
      const chatId = message.conversationId;
      if (chatId) {
        dispatch(addMessage({ chatId, message }));
      }
    });

    // Listen for message deletion
    const unsubscribeMessageDeleted = onMessageDeleted((_data: { messageId: string }) => {
      // We need to find which chat this message belongs to
      // This might require additional logic or storing message-to-chat mapping
    });

    // Listen for typing indicators
    const unsubscribeUserTyping = onUserTyping((_data: { userId: string }) => {
      // Add typing user to current active chat
      // You might need to get current active chat from Redux state
    });

    const unsubscribeUserStoppedTyping = onUserStoppedTyping((_data: { userId: string }) => {
      // Remove typing user from current active chat
    });

    // Listen for all messages response
    socketService.on('allMessages', (messages: Message[]) => {
      // Determine chat ID from first message or current context
      if (messages.length > 0) {
        const chatId = messages[0].channelId || messages[0].conversationId;
        if (chatId) {
          dispatch(setMessages({ chatId, messages }));
        }
      }
      dispatch(setLoading(false));
    });

    // Listen for message edit success
    socketService.on('message:edit:success', (message: Message) => {
      const chatId = message.channelId || message.conversationId;
      if (chatId) {
        dispatch(updateMessageInState({ 
          chatId, 
          messageId: message.id, 
          updates: { content: message.content, isEdited: true, updatedAt: message.updatedAt }
        }));
      }
    });

    // Listen for message edit error
    socketService.on('message:edit:error', (error: { message: string }) => {
      dispatch(setError(error.message));
    });

    // Listen for message delete success
    socketService.on('message:delete:success', (message: Message) => {
      const chatId = message.channelId || message.conversationId;
      if (chatId) {
        dispatch(removeMessage({ chatId, messageId: message.id }));
      }
    });

    // Listen for DM all messages (we'll use the existing 'allMessages' event for now)
    // The server should send both channel and DM messages through 'allMessages' event

    // Listen for DM message edit success
    socketService.on('dm:message:edit:success', (message: Message) => {
      const chatId = message.conversationId;
      if (chatId) {
        dispatch(updateMessageInState({ 
          chatId, 
          messageId: message.id, 
          updates: { content: message.content, isEdited: true, updatedAt: message.updatedAt }
        }));
      }
    });

    // Listen for DM message delete success
    socketService.on('dm:message:delete:success', (message: Message) => {
      const chatId = message.conversationId;
      if (chatId) {
        dispatch(removeMessage({ chatId, messageId: message.id }));
      }
    });

    // Cleanup function
    return () => {
      unsubscribeNewMessage();
      unsubscribeDMMessage();
      unsubscribeMessageDeleted();
      unsubscribeUserTyping();
      unsubscribeUserStoppedTyping();
      
      // Clean up socket listeners
      socketService.off('allMessages');
      socketService.off('message:edit:success');
      socketService.off('message:edit:error');
      socketService.off('message:delete:success');
      socketService.off('dm:message:edit:success');
      socketService.off('dm:message:delete:success');
    };
  }, [dispatch, onNewMessage, onDMMessage, onMessageDeleted, onUserTyping, onUserStoppedTyping, socketService]);

  // Socket actions with loading states
  const fetchChannelMessages = useCallback((channelId: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    socketActions.fetchChannelMessages(channelId);
  }, [dispatch]);

  const sendChannelMessage = useCallback((channelId: string, content: string) => {
    dispatch(setSendingMessage(true));
    dispatch(setError(null));
    socketActions.sendChannelMessage(channelId, content);
  }, [dispatch]);

  const fetchDMMessages = useCallback((conversationId: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    socketActions.fetchDMMessages(conversationId);
  }, [dispatch]);

  const sendDMMessage = useCallback((conversationId: string, content: string) => {
    dispatch(setSendingMessage(true));
    dispatch(setError(null));
    socketActions.sendDMMessage(conversationId, content);
  }, [dispatch]);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    dispatch(setError(null));
    socketActions.editMessage(messageId, newContent);
  }, [dispatch]);

  const deleteMessage = useCallback((messageId: string) => {
    dispatch(setError(null));
    socketActions.deleteMessage(messageId);
  }, [dispatch]);

  const joinChannel = useCallback((channelId: string) => {
    socketActions.joinChannel(channelId);
  }, []);

  const joinDM = useCallback((conversationId: string) => {
    socketActions.joinDM(conversationId);
  }, []);

  const startTyping = useCallback((channelId: string) => {
    socketActions.startTyping(channelId);
  }, []);

  const stopTyping = useCallback((channelId: string) => {
    socketActions.stopTyping(channelId);
  }, []);

  const startDMTyping = useCallback((conversationId: string) => {
    socketActions.startDMTyping(conversationId);
  }, []);

  const stopDMTyping = useCallback((conversationId: string) => {
    socketActions.stopDMTyping(conversationId);
  }, []);

  return {
    // Message actions
    fetchChannelMessages,
    sendChannelMessage,
    fetchDMMessages,
    sendDMMessage,
    editMessage,
    deleteMessage,
    
    // Channel/DM actions
    joinChannel,
    joinDM,
    
    // Typing actions
    startTyping,
    stopTyping,
    startDMTyping,
    stopDMTyping
  };
};
