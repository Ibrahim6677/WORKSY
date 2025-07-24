# Socket.IO Integration Guide

## Overview
تم تطوير نظام متقدم للتواصل المباشر باستخدام Socket.IO يحل محل async thunks التقليدية في Redux. النظام يوفر تفاعل فوري للرسائل، مؤشرات الكتابة، والتفاعلات.

## Configuration

### Server URL
يتم استخدام نفس URL الخاص بـ API للـ Socket connection:
```typescript
// من ملف apiRoutes.ts
const API_BASE_URL = "https://worksy-6jj5.onrender.com";
```

### Socket Configuration
```typescript
// src/utils/constants/socketConfig.ts
export const SOCKET_CONFIG = {
  serverUrl: API_BASE_URL,
  options: {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 5
  }
};
```

## Core Components

### 1. Socket Service (`socketService.ts`)
خدمة مركزية للتعامل مع Socket.IO connection:

```typescript
import socketService from '../../services/socket/socketService';

// الاتصال
socketService.connect(token);

// إرسال رسالة
socketService.emit('sendMessage', { channelId, content });

// الاستماع للأحداث
socketService.on('newMessage', (message) => {
  console.log('New message:', message);
});

// قطع الاتصال
socketService.disconnect();
```

### 2. useSocket Hook
Hook مخصص للتفاعل مع Socket.IO:

```typescript
import { useSocket } from '../hooks/useSocket/useSocket';

const {
  joinChannel,
  sendMessage,
  onNewMessage,
  isConnected
} = useSocket();
```

### 3. useChatSocket Hook
Hook متخصص للدردشة يدمج Redux مع Socket.IO:

```typescript
import { useChatSocket } from '../hooks/useChat/useChatSocket';

const {
  fetchChannelMessages,
  sendChannelMessage,
  editMessage,
  deleteMessage
} = useChatSocket();
```

## Usage Examples

### إرسال رسالة في قناة
```typescript
const { sendChannelMessage } = useChatSocket();

const handleSend = () => {
  sendChannelMessage(channelId, messageContent);
};
```

### الاستماع للرسائل الجديدة
```typescript
const { onNewMessage } = useSocket();

useEffect(() => {
  const cleanup = onNewMessage((message) => {
    // التعامل مع الرسالة الجديدة
    console.log('Received:', message);
  });

  return cleanup; // تنظيف المستمع عند إلغاء المكون
}, [onNewMessage]);
```

### مؤشرات الكتابة
```typescript
const { startTyping, stopTyping } = useSocket();

const handleTyping = () => {
  startTyping(channelId);
  
  // إيقاف مؤشر الكتابة بعد 3 ثوان
  setTimeout(() => {
    stopTyping(channelId);
  }, 3000);
};
```

## Events المدعومة

### Channel Events
- `joinChannel` - الانضمام لقناة
- `sendMessage` - إرسال رسالة
- `newMessage` - رسالة جديدة
- `getAllMessages` - جلب جميع الرسائل
- `allMessages` - استقبال جميع الرسائل

### Direct Message Events
- `join:dm` - الانضمام لمحادثة مباشرة
- `dm:send` - إرسال رسالة مباشرة
- `dm:newMessage` - رسالة مباشرة جديدة

### Typing Events
- `typing` - بدء الكتابة
- `userTyping` - مستخدم يكتب
- `stopTyping` - إيقاف الكتابة
- `userStoppedTyping` - مستخدم توقف عن الكتابة

### Message Actions
- `editMessage` - تعديل رسالة
- `message:edit:success` - نجح التعديل
- `message:delete` - حذف رسالة
- `message:deleted` - تم حذف الرسالة

### Reactions
- `reaction:addOrUpdate` - إضافة أو تحديث تفاعل
- `reaction:updated` - تم تحديث التفاعلات

## Redux Integration

### Chat Slice
تم تحديث `chatSlice.ts` لاستخدام Socket events بدلاً من async thunks:

```typescript
// Socket Actions (تحل محل async thunks)
export const socketActions = {
  fetchChannelMessages: (channelId: string) => {
    socketService.emit('getAllMessages', { channelId });
  },
  
  sendChannelMessage: (channelId: string, content: string) => {
    socketService.emit('sendMessage', { channelId, content });
  }
};

// Redux Actions للتعامل مع Socket responses
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    },
    
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    }
  }
});
```

## Components

### ChatWindow
مكون الدردشة الرئيسي الذي يستخدم Socket.IO:

```typescript
import ChatWindow from '../components/organisms/ChatWindow';

<ChatWindow chatId={channelId} chatType="channel" />
```

### ChatSidebar
الشريط الجانبي للقنوات والمحادثات:

```typescript
import ChatSidebar from '../components/organisms/Sidebar/ChatSidebar';

<ChatSidebar />
```

## Testing

### صفحة اختبار Socket.IO
```typescript
import SocketTestPage from '../pages/test/SocketTestPage';

// استخدم هذه الصفحة لاختبار:
// - اتصال Socket.IO
// - إرسال واستقبال الرسائل
// - مراقبة حالة الاتصال
// - تشخيص المشاكل
```

## Migration من Async Thunks

### قبل (Async Thunks)
```typescript
// Old way
const dispatch = useDispatch();
dispatch(fetchChannelMessages({ workspaceId, channelId }));
```

### بعد (Socket.IO)
```typescript
// New way
const { fetchChannelMessages } = useChatSocket();
fetchChannelMessages(channelId);
```

## Debugging

### تشخيص مشاكل الاتصال
1. تحقق من `SocketTestPage` للحصول على معلومات مفصلة
2. راقب console للأخطاء
3. تأكد من وجود token صحيح
4. تحقق من URL الخادم

### مراقبة الأحداث
```typescript
// تفعيل debugging في التطوير
const socketOptions = {
  ...SOCKET_CONFIG.options,
  debug: process.env.NODE_ENV === 'development'
};
```

## Best Practices

1. **استخدم useChatSocket للدردشة**: يوفر تكامل تلقائي مع Redux
2. **تنظيف المستمعين**: تأكد من إرجاع cleanup functions
3. **معالجة أخطاء الاتصال**: راقب حالة الاتصال واستجب للانقطاعات
4. **تجنب المستمعين المتعددين**: تأكد من عدم تسجيل نفس المستمع عدة مرات
5. **استخدم TypeScript**: للحصول على type safety كامل

## Troubleshooting

### مشاكل شائعة:
- **عدم الاتصال**: تحقق من token والشبكة
- **رسائل مفقودة**: تأكد من join channel/conversation أولاً
- **مؤشرات كتابة لا تعمل**: تحقق من event listeners
- **تكرار الرسائل**: تجنب تسجيل listeners متعددة

### الحلول:
1. استخدم `SocketTestPage` للتشخيص
2. راجع Network tab في Developer Tools
3. تحقق من Redux DevTools للـ state changes
4. راقب Socket.IO connection في console
