"use client";

import { AppShell } from "@/shared/components/app-shell";
import { useMe } from "@/modules/auth/hooks/use-me";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";

export default function ProtectedLayout({ children }: any) {
  const { isLoading, isError, error, refetch } = useMe();

  if (isLoading) {
    return <LoadingState label="Validating session..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to validate session"
        description={error?.message ?? "Please login again"}
        actionLabel="Try again"
        onAction={refetch}
      />
    );
  }

  return <AppShell>{children}</AppShell>;
}
