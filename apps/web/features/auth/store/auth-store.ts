import { create } from "zustand";
import { User } from "../types";
import { devtools } from "zustand/middleware";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set(
          {
            user,
            isAuthenticated: !!user,
          },
          false,
          "auth/setUser",
        ),

      setLoading: (isLoading) =>
        set(
          {
            isLoading,
          },
          false,
          "auth/setLoading",
        ),

      logout: () =>
        set(
          {
            user: null,
            isAuthenticated: false,
          },
          false,
          "auth/logout",
        ),
    }),
    {
      name: "auth-store",
    },
  ),
);
