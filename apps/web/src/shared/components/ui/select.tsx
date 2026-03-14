import * as React from "react";
import { cn } from "@/shared/lib/utils";

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary",
        className,
      )}
      {...props}
    />
  );
}
