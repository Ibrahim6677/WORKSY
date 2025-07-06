export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: "online" | "offline" | "busy" | "away";
  role?: "admin" | "member" | "guest";
  createdAt: string;
  updatedAt: string;
}
