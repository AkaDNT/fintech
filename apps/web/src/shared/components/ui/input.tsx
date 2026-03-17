import * as React from "react";
import { cn } from "@/shared/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-[#d9deea] bg-white px-4 text-sm text-[#111827] outline-none ring-0 transition placeholder:text-[#9aa3b1] focus:border-[#052538] focus:shadow-[0_0_0_3px_rgba(5,37,56,0.08)]",
        className,
      )}
      {...props}
    />
  );
}
