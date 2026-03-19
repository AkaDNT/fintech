import { FriendlyRedirectState } from "@/shared/components/friendly-redirect-state";

export default function NotFoundPage() {
  return (
    <FriendlyRedirectState
      badge="404"
      title="This page cannot be found"
      description="The URL may be incorrect, expired, or you no longer have access. We will bring you back to landing page."
      redirectDelaySeconds={5}
    />
  );
}
