"use client";

import { useEffect } from "react";
import { FriendlyRedirectState } from "@/shared/components/friendly-redirect-state";

export default function GlobalAppError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error("Unhandled app error", error);
  }, [error]);

  return (
    <FriendlyRedirectState
      badge="Application Error"
      title="Something went wrong"
      description="An unexpected issue occurred while loading this page. We will take you back to landing page."
      redirectDelaySeconds={5}
    />
  );
}
