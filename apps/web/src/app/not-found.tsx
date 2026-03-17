import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#052538] px-6">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:58px_58px] opacity-40" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_30%,#2aa18f_0%,transparent_40%)] opacity-40" />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <Image
            src="/yubeepay-logo.svg"
            alt="Yubeepay"
            width={40}
            height={40}
            className="h-10 w-10 rounded-xl"
          />
        </div>
        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/70">
          404 — Not Found
        </span>
        <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
          Page not found
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-white/60">
          The resource you requested does not exist or you do not have
          permission to view it.
        </p>
        <Link
          href="/dashboard"
          className="group inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 bg-white px-7 text-sm font-bold text-[#052538] shadow-[0_12px_26px_rgba(3,25,39,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(3,25,39,0.5)] active:translate-y-0"
        >
          Back to dashboard
          <span className="transition group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </main>
  );
}
