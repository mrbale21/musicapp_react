import { create } from "zustand";
import type { UserModel } from "../apis/models/user";

interface UserDataState {
  user: UserModel | null;

  setUser: (user: UserModel | null) => void;
}

export const useUserData = create<UserDataState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),
}));
