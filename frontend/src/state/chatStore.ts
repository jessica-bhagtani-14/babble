import { create } from 'zustand';

interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: any[];
  latestMessage?: any;
  [key: string]: any;
}

interface ChatState {
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
  notification: any[];
  setNotification: (n: any[]) => void;
  unreadCounts: Record<string, number>;
  setUnreadCount: (chatId: string, count: number) => void;
  incrementUnread: (chatId: string) => void;
  clearUnread: (chatId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  notification: [],
  setNotification: (n) => set({ notification: n }),
  unreadCounts: {},
  setUnreadCount: (chatId, count) => set((state) => ({ unreadCounts: { ...state.unreadCounts, [chatId]: count } })),
  incrementUnread: (chatId) => set((state) => ({ unreadCounts: { ...state.unreadCounts, [chatId]: (state.unreadCounts[chatId] || 0) + 1 } })),
  clearUnread: (chatId) => set((state) => {
    const newCounts = { ...state.unreadCounts };
    newCounts[chatId] = 0;
    return { unreadCounts: newCounts };
  }),
})); 