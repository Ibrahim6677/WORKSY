# Socket.IO Integration Guide

## نظرة عامة

تم تحويل نظام Chat من استخدام async thunks إلى Socket.IO events لتوفير تجربة real-time أفضل.

## التغييرات الرئيسية

### 1. chatSlice.ts
- **قبل**: استخدم `createAsyncThunk` للتعامل مع API calls
- **بعد**: استخدم `socketActions` للتعامل مع Socket events
- **الفوائد**: real-time updates, أقل تعقيداً في إدارة الحالة

### 2. Hooks الجديدة

#### useChatSocket
- Hook محدد للتعامل مع Socket events في Chat
- يدير event listeners تلقائياً
- يربط Socket events مع Redux actions

#### useSocket (محدث)
- Hook عام للتعامل مع Socket.IO
- يوفر connection management
- Type-safe event handling

### 3. Components الجديدة

#### ChatWindow
- Component محدث يستخدم Socket events
- Real-time message updates
- Typing indicators
- Message editing/deletion

#### ChatSidebar
- Sidebar للقنوات والمحادثات المباشرة
- Real-time unread count updates
- Channel/DM navigation

### 4. Socket Events المدعومة

#### Channel Events
- `joinChannel`: انضمام لقناة
- `sendMessage`: إرسال رسالة
- `newMessage`: رسالة جديدة
- `getAllMessages`: جلب الرسائل
- `allMessages`: استقبال الرسائل
- `editMessage`: تعديل رسالة
- `message:delete`: حذف رسالة
- `typing`: بدء الكتابة
- `stopTyping`: توقف الكتابة

#### DM Events
- `join:dm`: انضمام لمحادثة مباشرة
- `dm:send`: إرسال رسالة مباشرة
- `dm:newMessage`: رسالة مباشرة جديدة
- `dm:getAll`: جلب رسائل المحادثة
- `dm:typing`: بدء الكتابة في المحادثة
- `dm:stopTyping`: توقف الكتابة

#### Reaction Events
- `reaction:addOrUpdate`: إضافة/تحديث تفاعل
- `reaction:updated`: تحديث التفاعلات

## كيفية الاستخدام

### 1. تشغيل الاختبار
```bash
npm start
```
ثم اذهب إلى: `http://localhost:3000/socket-test`

### 2. التكوين
إنشاء ملف `.env` من `.env.example`:
```bash
cp .env.example .env
```

تحديث URL الخاص بـ Socket server:
```env
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. استخدام في Components

```tsx
import { useChatSocket } from '../hooks/useChat/useChatSocket';

function ChatComponent() {
  const {
    sendChannelMessage,
    fetchChannelMessages,
    joinChannel
  } = useChatSocket();

  // انضمام لقناة
  useEffect(() => {
    joinChannel('channel-id');
    fetchChannelMessages('channel-id');
  }, []);

  // إرسال رسالة
  const handleSend = (message: string) => {
    sendChannelMessage('channel-id', message);
  };
}
```

## مقارنة الكود

### قبل (Async Thunk)
```tsx
// إرسال رسالة
dispatch(sendChannelMessage({
  workspaceId: 'workspace-id',
  channelId: 'channel-id',
  content: 'message'
}));

// جلب الرسائل
dispatch(fetchChannelMessages({
  workspaceId: 'workspace-id',
  channelId: 'channel-id'
}));
```

### بعد (Socket Events)
```tsx
// إرسال رسالة
sendChannelMessage('channel-id', 'message');

// جلب الرسائل
fetchChannelMessages('channel-id');
```

## الميزات الجديدة

1. **Real-time Updates**: الرسائل تظهر فوراً لجميع المستخدمين
2. **Typing Indicators**: مؤشرات الكتابة في الوقت الفعلي
3. **Message Reactions**: تفاعلات فورية مع الرسائل
4. **Auto-reconnection**: إعادة اتصال تلقائية عند انقطاع الشبكة
5. **Type Safety**: جميع Socket events مع TypeScript types

## ملاحظات مهمة

1. **Connection Management**: Socket connection يتم إدارته تلقائياً
2. **Error Handling**: أخطاء Socket يتم التعامل معها في Redux state
3. **Memory Management**: Event listeners يتم تنظيفها تلقائياً
4. **Authentication**: Socket يستخدم JWT token للمصادقة

## التطوير المستقبلي

1. **File Sharing**: إضافة مشاركة الملفات عبر Socket
2. **Voice/Video Calls**: دمج WebRTC مع Socket.IO
3. **Message History**: تحسين جلب تاريخ الرسائل
4. **Push Notifications**: إشعارات الرسائل الجديدة
5. **Emoji Reactions**: تفاعلات أكثر تفصيلاً
