import { LoginForm } from "@/modules/auth/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <section className="card overflow-hidden">
        <header className="border-b border-border bg-surface-2 px-6 py-5">
          <h1 className="text-2xl font-bold">Fintech Console</h1>
          <p className="mt-1 text-sm text-muted">Sign in to continue</p>
        </header>
        <div className="px-6 py-6">
          <LoginForm />
          <p className="mt-4 text-center text-sm text-muted">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-primary">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
