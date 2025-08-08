import { create } from 'zustand';

export interface User {
  _id: string;
  name: string;
  email: string;
  pic?: string;
  isAdmin?: boolean;
  token?: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: JSON.parse(localStorage.getItem('userInfo') || 'null'),
  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
  },
  logout: () => {
    set({ user: null });
    localStorage.removeItem('userInfo');
  },
})); 