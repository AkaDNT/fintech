"use client";

import { useMe } from "@/modules/auth/hooks/use-me";
import { ErrorState } from "@/shared/components/error-state";
import { LoadingState } from "@/shared/components/loading-state";
import type { UserRole } from "@/shared/types/common.types";

interface RoleGuardProps {
  allow: UserRole[];
  children: React.ReactNode;
}

export function RoleGuard({ allow, children }: RoleGuardProps) {
  const { data, isLoading, isError, error } = useMe();

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

  if (!data || !allow.includes(data.role)) {
    return (
      <ErrorState
        title="Forbidden"
        description="You do not have permission to access this resource."
      />
    );
  }

  return <>{children}</>;
}
