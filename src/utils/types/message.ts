import type { User } from "./user";

export interface Message {
  id: string;
  content: string;
  sender: User;
  channelId: string;
  type: "text" | "image" | "file" | "call" | "video";
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
  replyTo?: Message; // الرسائل المردود عليها (اختياري)
  mentions?: User[]; // لو في منشنات
}
