import { SignupForm } from "@/modules/auth/components/signup-form";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#052538] px-4 py-10 sm:px-6">
      {/* decorative grid */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[58px_58px] opacity-40" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_90%,#2aa18f_0%,transparent_30%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-sm flex-col justify-center">
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 inline-flex w-fit items-center gap-2.5 rounded-lg outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#9ee9c2]/70"
          aria-label="Back to landing page"
        >
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
        </Link>

        {/* Card */}
        <section className="overflow-hidden rounded-[22px] border border-white/10 bg-white shadow-[0_28px_80px_rgba(3,25,39,0.5)]">
          <header className="border-b border-[#d9deea] bg-[#f3f5fa] px-7 py-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-[#5b667a]">
              Join Yubeepay and start transacting in seconds
            </p>
          </header>
          <div className="px-7 py-6">
            <SignupForm />
          </div>
        </section>
      </div>
    </main>
  );
}
