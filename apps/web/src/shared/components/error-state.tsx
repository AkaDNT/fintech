import { Button } from "@/shared/components/ui/button";

interface ErrorStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
}: ErrorStateProps) {
  return (
    <div className="rounded-[20px] border border-[#f5d0d0] bg-[#fff8f8] p-6 shadow-[0_4px_12px_rgba(190,43,43,0.06)]">
      <span className="inline-flex items-center rounded-full bg-[#ffe2e6] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#be2b2b]">
        Error
      </span>
      <h2 className="mt-3 text-xl font-bold tracking-tight text-[#111827]">
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 text-sm leading-relaxed text-[#5b667a]">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <div className="mt-4">
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
