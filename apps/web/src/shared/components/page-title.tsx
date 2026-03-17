export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-b border-[#d9deea] pb-5">
      <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-[#5b667a]">{subtitle}</p>
      ) : null}
    </header>
  );
}
