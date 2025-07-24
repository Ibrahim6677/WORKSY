import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ChatWindow from '../../components/organisms/ChatWindow';
import { setActiveChat, setCurrentChannel } from '../../features/chat/chatSlice';
import type { RootState } from '../../store';

export default function ChatPage() {
  const { channelId, conversationId } = useParams<{
    channelId?: string;
    conversationId?: string;
  }>();
  
  const dispatch = useDispatch();
  
  const { channels, conversations, activeChat } = useSelector((state: RootState) => ({
    channels: state.chat.channels,
    conversations: state.chat.conversations,
    activeChat: state.chat.activeChat
  }));

  // Set active chat based on URL params
  useEffect(() => {
    if (channelId) {
      dispatch(setActiveChat({ type: 'channel', id: channelId }));
      
      // Find and set current channel
      const channel = channels.find(c => c.id === channelId);
      if (channel) {
        dispatch(setCurrentChannel(channel));
      }
    } else if (conversationId) {
      dispatch(setActiveChat({ type: 'dm', id: conversationId }));
    }
  }, [channelId, conversationId, channels, dispatch]);

  // Determine chat details
  const chatId = channelId || conversationId;
  const chatType = channelId ? 'channel' : 'dm';

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            مرحباً بك في Worksy
          </h2>
          <p className="text-gray-600">
            اختر قناة أو محادثة من الشريط الجانبي لبدء المحادثة
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ChatWindow chatId={chatId} chatType={chatType} />
    </div>
  );
}
