import { create } from "zustand";

export const usePlan = create((set) => ({
  plans: [],

  setPlans: (plans) => set({ plans }),
}));
