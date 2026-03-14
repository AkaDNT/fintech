export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="card flex items-center gap-3 p-5">
      <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-primary" />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
