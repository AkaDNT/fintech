"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import type { UserRole } from "@/shared/types/common.types";
import { useAuthContext } from "@/providers/auth-provider";

interface RoleGuardProps {
  allow: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allow, children }: RoleGuardProps) {
  const router = useRouter();
  const { role, isLoading, isError, error, isAuthenticated } = useAuthContext();

  const isAllowed = Boolean(isAuthenticated && role && allow.includes(role));

  useEffect(() => {
    if (isLoading || isError) return;

    if (!isAllowed) {
      router.replace("/wallets");
    }
  }, [isAllowed, isError, isLoading, router]);

  if (isLoading) {
    return <LoadingState label="Checking permissions..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Cannot verify permissions"
        description={error?.message ?? "Please try again."}
      />
    );
  }

  if (!isAllowed) {
    return <LoadingState label="Redirecting..." />;
  }

  return <>{children}</>;
}
