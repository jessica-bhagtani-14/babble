import { create } from "zustand";

interface BgState {
  backgroundImage: string;
  isBgLoaded: boolean;
  setBackgroundImage: (image: string) => void;
  setIsBgLoaded: (loaded: boolean) => void;
}

const defaultBg = localStorage.getItem("chat-bg") || "/bg-frames/Frame10.svg";

export const useBgStore = create<BgState>((set) => ({
  backgroundImage: defaultBg,
  isBgLoaded: true,
  setBackgroundImage: (image) => {
    set({ backgroundImage: image });
    localStorage.setItem("chat-bg", image);
  },
  setIsBgLoaded: (loaded) => set({ isBgLoaded: loaded }),
}));
