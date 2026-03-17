export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-[#d9deea] bg-[#f3f5fa] px-5 py-4 shadow-[0_4px_12px_rgba(5,37,56,0.05)]">
      <span className="relative inline-flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1f8265] opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#1f8265]" />
      </span>
      <p className="text-sm font-medium text-[#5b667a]">{label}</p>
    </div>
  );
}
