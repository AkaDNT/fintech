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
    <div className="overflow-hidden rounded-[22px] border border-[#f3c8c8] bg-[linear-gradient(160deg,#fffafa_0%,#fff2f2_100%)] p-6 shadow-[0_10px_24px_rgba(190,43,43,0.08)]">
      <span className="inline-flex items-center rounded-full border border-[#f0b9b9] bg-[#ffe5e5] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#a02222]">
        Something went wrong
      </span>
      <h2 className="mt-3 text-xl font-black tracking-tight text-[#111827]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-[#5b667a]">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <div className="mt-5">
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
