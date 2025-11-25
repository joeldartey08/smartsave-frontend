import { create } from "zustand";

export const useTransactions = create((set) => ({
  transactions: [],

  setTransactions: (transactions) => set({ transactions }),
}));
