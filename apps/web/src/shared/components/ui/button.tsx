import * as React from "react";
import { cn } from "@/shared/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-[#052538] text-white shadow-[0_4px_14px_rgba(5,37,56,0.28)] hover:opacity-90 hover:-translate-y-px",
  secondary:
    "bg-[#e8edf7] text-[#052538] border border-[#d9deea] hover:bg-[#dce4f0]",
  danger:
    "bg-[#be2b2b] text-white shadow-[0_4px_12px_rgba(190,43,43,0.25)] hover:opacity-90",
  ghost:
    "bg-transparent text-[#052538] hover:bg-[#e8edf7] border border-transparent hover:border-[#d9deea]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
