"use client";

import { AppShell } from "@/shared/components/app-shell";
import { LoadingState } from "@/shared/components/loading-state";
import { FriendlyRedirectState } from "@/shared/components/friendly-redirect-state";
import { useAuthContext } from "@/providers/auth-provider";

export default function ProtectedLayout({ children }: any) {
  const { isLoading, isError, error, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return <LoadingState label="Validating session..." />;
  }

  if (isError) {
    return (
      <FriendlyRedirectState
        badge="Session Error"
        title="Unable to verify your session"
        description={
          error?.message ??
          "We could not validate your credentials at this time. You will be redirected to landing shortly."
        }
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <FriendlyRedirectState
        badge="Session Expired"
        title="Your session has ended"
        description="Please sign in again to continue using your dashboard. We are taking you back to landing page now."
      />
    );
  }

  return <AppShell>{children}</AppShell>;
}
