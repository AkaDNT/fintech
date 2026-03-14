"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { normalizeError } from "@/shared/utils/normalize-error";

export function useToastError() {
  return useCallback((error: unknown, fallback = "Something went wrong") => {
    const normalized = normalizeError(error);
    toast.error(normalized.message || fallback, {
      description: normalized.code,
    });
  }, []);
}
