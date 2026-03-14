import Link from "next/link";
import { HealthWidget } from "@/shared/components/health-widget";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <article className="card overflow-hidden">
          <div className="bg-[linear-gradient(125deg,#0f3b22,#1e7a3f)] px-7 py-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c8edd4]">
              Enterprise Fintech
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
              Operate wallets, transfers, and ledger with one secure console.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-[#dcf5e5] sm:text-base">
              Built for auditable operations: idempotent transfers, admin
              adjustments, report queueing, and real-time transaction history.
            </p>
          </div>
          <div className="grid gap-4 px-7 py-6 sm:grid-cols-3">
            <div>
              <p className="text-2xl font-bold text-primary">99.99%</p>
              <p className="mt-1 text-sm text-muted">
                transaction consistency target
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">2</p>
              <p className="mt-1 text-sm text-muted">
                core currencies out of the box
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">1</p>
              <p className="mt-1 text-sm text-muted">unified control plane</p>
            </div>
          </div>
          <div className="border-t border-border px-7 py-4">
            <HealthWidget />
          </div>
        </article>

        <article className="card flex flex-col justify-between p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Get Started
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Welcome to Fintech Console
            </h2>
            <p className="mt-3 text-sm text-muted">
              Sign in to access protected modules. Admin users will be
              auto-routed to dashboard.
            </p>
          </div>
          <div className="mt-6 space-y-3">
            <Link
              href="/login"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-app-foreground"
            >
              Signup
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
