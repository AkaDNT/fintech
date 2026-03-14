"use client";

import { useEffect, useRef } from "react";

export function usePolling(
  callback: () => void,
  delayMs: number,
  enabled: boolean,
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const id = window.setInterval(() => {
      savedCallback.current();
    }, delayMs);

    return () => window.clearInterval(id);
  }, [delayMs, enabled]);
}
