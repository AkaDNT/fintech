"use client";

import { createContext, useContext, useMemo } from "react";
import { useMe } from "@/modules/auth/hooks/use-me";
import type { UserRole } from "@/shared/types/common.types";

interface AuthContextValue {
  userId: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  userId: null,
  role: null,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data } = useMe();

  const value = useMemo<AuthContextValue>(() => {
    if (!data) {
      return { userId: null, role: null, isAuthenticated: false };
    }

    return {
      userId: data.id,
      role: data.role,
      isAuthenticated: true,
    };
  }, [data]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
