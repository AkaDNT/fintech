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
    <div className="card flex flex-col items-start gap-3 p-5">
      <p className="rounded-full bg-[#ffe2e6] px-3 py-1 text-xs font-semibold text-danger">
        Error
      </p>
      <h2 className="text-xl font-bold">{title}</h2>
      {description ? <p className="text-sm text-muted">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
