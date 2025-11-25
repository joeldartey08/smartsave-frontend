import { create } from "zustand";

export const useStepState = create((set) => ({
  email: "",
  code: "",
  new_password: "",

  updateFields: (key, value) => set({ [key]: value }),
}));
