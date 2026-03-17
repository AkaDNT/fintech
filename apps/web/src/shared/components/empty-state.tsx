interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[20px] border border-dashed border-[#c8d4e6] bg-[#f3f5fa] px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8edf7]">
        <span className="text-2xl">📭</span>
      </div>
      <h2 className="text-base font-bold text-[#111827]">{title}</h2>
      {description ? (
        <p className="mt-1.5 text-sm text-[#5b667a]">{description}</p>
      ) : null}
    </div>
  );
}
