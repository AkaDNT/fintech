"use client";

import { createContext, useContext, useMemo } from "react";
import { useMe } from "@/modules/auth/hooks/use-me";
import type { UserRole } from "@/shared/types/common.types";

interface AuthContextValue {
  userId: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue>({
  userId: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  isError: false,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError, error } = useMe();

  const value = useMemo<AuthContextValue>(() => {
    if (!data) {
      return {
        userId: null,
        role: null,
        isAuthenticated: false,
        isLoading,
        isError,
        error: (error as Error | null) ?? null,
      };
    }

    return {
      userId: data.id,
      role: data.role,
      isAuthenticated: true,
      isLoading,
      isError,
      error: (error as Error | null) ?? null,
    };
  }, [data, error, isError, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
