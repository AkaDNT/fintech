export function computeNextAttemptAt(attemptCount: number): Date | null {
  const delaysMs = [
    30_000, // first error -> 30s
    2 * 60_000, // second error -> 2m
    10 * 60_000, // third error -> 10m
    30 * 60_000, // fourth error -> 30m
    2 * 60 * 60_000, // fifth -> 2h
  ];

  const delay = delaysMs[attemptCount - 1];
  if (!delay) return null;

  return new Date(Date.now() + delay);
}

export function safeTruncate(value: string | null | undefined, max = 4000) {
  if (!value) return null;
  return value.length <= max ? value : value.slice(0, max);
}
