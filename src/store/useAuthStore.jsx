import { useLocation, useNavigation } from "react-router-dom";
import { create } from "zustand";

export const useAuthstore = create((set) => ({
  token: localStorage.getItem("token") || null,
  user: null,
  profile: null,


  setProfile: (profile) => { set({ profile }) },
  login: (token) => {
    localStorage.setItem("token", token);

    set({ token });
  },
  logOut: () => {
    localStorage.removeItem("token")

    window.location.href("/")
  },
  setUser: (user) => {
    set({ user });
  },
}));
