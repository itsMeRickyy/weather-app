import { create } from "zustand";

interface Store {
  toggle: boolean;
  setToggle: (toggle: boolean) => void;
}

export const useStore = create<Store>(set => ({
  toggle: false,
  setToggle: (toggle: boolean) => set({ toggle }),
}));
