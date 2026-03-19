"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";

interface FriendlyRedirectStateProps {
  badge?: string;
  title: string;
  description: string;
  redirectTo?: string;
  redirectDelaySeconds?: number;
}

export function FriendlyRedirectState({
  badge = "Notice",
  title,
  description,
  redirectTo = "/",
  redirectDelaySeconds = 4,
}: FriendlyRedirectStateProps) {
  const router = useRouter();
  const safeDelay = Math.max(1, Math.floor(redirectDelaySeconds));
  const [secondsLeft, setSecondsLeft] = useState(safeDelay);

  useEffect(() => {
    setSecondsLeft(safeDelay);
  }, [safeDelay]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      router.replace(redirectTo);
    }, safeDelay * 1000);

    return () => window.clearTimeout(timeout);
  }, [redirectTo, router, safeDelay]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const progressWidth = useMemo(() => {
    return `${Math.min(100, ((safeDelay - secondsLeft) / safeDelay) * 100)}%`;
  }, [safeDelay, secondsLeft]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#052538] px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(38,185,157,0.3)_0%,transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.16)_0%,transparent_32%),radial-gradient(circle_at_50%_90%,rgba(11,66,104,0.75)_0%,transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-size-[44px_44px]" />

      <section className="relative mx-auto mt-10 w-full max-w-xl overflow-hidden rounded-[28px] border border-white/15 bg-white/8 p-7 shadow-[0_20px_60px_rgba(3,23,36,0.42)] backdrop-blur-md sm:mt-16 sm:p-9">
        <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/85">
          {badge}
        </span>

        <h1 className="mt-4 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-white/80">
          {description}
        </p>

        <div className="mt-5 rounded-2xl border border-white/15 bg-[#0e3953]/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b9d8e8]">
            Returning to landing page
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            Redirecting in {secondsLeft}s
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#26b99d] to-[#74d2bf] transition-all duration-300"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button className="h-11" onClick={() => router.replace(redirectTo)}>
            Go to landing now
          </Button>
          <Button
            className="h-11 text-white/85"
            variant="ghost"
            onClick={() => router.refresh()}
          >
            Retry this page
          </Button>
        </div>
      </section>
    </main>
  );
}
