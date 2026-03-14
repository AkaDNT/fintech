import * as React from "react";
import { cn } from "@/shared/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary",
        className,
      )}
      {...props}
    />
  );
}
