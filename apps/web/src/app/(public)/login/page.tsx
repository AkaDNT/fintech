import { LoginForm } from "@/modules/auth/components/login-form";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#052538] px-4 py-10 sm:px-6">
      {/* decorative grid */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:58px_58px] opacity-40" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_85%_10%,#2aa18f_0%,transparent_35%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-sm flex-col justify-center">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2.5">
          <Image
            src="/yubeepay-logo.svg"
            alt="Yubeepay"
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl"
          />
          <span className="text-xl font-bold tracking-tight text-[#9ee9c2]">
            Yubeepay
          </span>
        </div>

        {/* Card */}
        <section className="overflow-hidden rounded-[22px] border border-white/10 bg-white shadow-[0_28px_80px_rgba(3,25,39,0.5)]">
          <header className="border-b border-[#d9deea] bg-[#f3f5fa] px-7 py-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-[#5b667a]">
              Sign in to your Yubeepay account
            </p>
          </header>
          <div className="px-7 py-6">
            <LoginForm />
            <p className="mt-5 text-center text-sm text-[#5b667a]">
              New here?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#052538] underline-offset-2 hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
