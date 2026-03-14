import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
        404
      </p>
      <h1 className="text-4xl font-bold">Resource not found</h1>
      <p className="max-w-xl text-muted">
        The resource you requested does not exist or you do not have permission
        to view it.
      </p>
      <Link
        href="/dashboard"
        className="rounded-xl bg-primary px-4 py-2 font-medium text-white"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
