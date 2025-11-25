import { create } from "zustand";

export const useMenuStore = create((set) => ({
  isOpen: false,

  // Toggle function (flip open/close)
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),

}));