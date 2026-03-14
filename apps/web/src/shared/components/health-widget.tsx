"use client";

import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/shared/api/health";

export function HealthWidget() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    staleTime: 30_000,
    retry: 0,
  });

  const statusLabel = isLoading
    ? "Checking"
    : isError
      ? "Unavailable"
      : (data?.status ?? "Unknown");

  const statusColor = isLoading
    ? "bg-amber-500"
    : isError
      ? "bg-red-600"
      : "bg-emerald-600";

  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${statusColor}`}
      />
      <span className="font-semibold">API Health:</span>
      <span className="text-muted">{statusLabel}</span>
    </div>
  );
}
