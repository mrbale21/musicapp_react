import { create } from "zustand";
import type { User } from "../apis/models/user";

interface UserDataState {
  user: User | null;

  setUser: (user: User | null) => void;
}

export const useUserData = create<UserDataState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),
}));
