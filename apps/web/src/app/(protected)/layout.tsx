"use client";

import { AppShell } from "@/shared/components/app-shell";
import { useMe } from "@/modules/auth/hooks/use-me";
import { LoadingState } from "@/shared/components/loading-state";
import { ErrorState } from "@/shared/components/error-state";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }: any) {
  const router = useRouter();
  const { isLoading, isError, error, refetch, data } = useMe();

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

  if (!data) {
    return (
      <ErrorState
        title="Session expired"
        description="Please login again to continue."
        actionLabel="Go to login"
        onAction={() => router.replace("/login")}
      />
    );
  }

  return <AppShell>{children}</AppShell>;
}
