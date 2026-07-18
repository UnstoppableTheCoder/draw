"use client";

import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "./auth-store";

export const useAuth = () =>
  useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
    })),
  );

export const useUser = () => useAuthStore((state) => state.user);

export const useSetUser = () => useAuthStore((state) => state.setUser);

export const useLogout = () => useAuthStore((state) => state.logout);

export const useSetLoading = () => useAuthStore((state) => state.setLoading);
