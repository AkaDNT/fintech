import Link from "next/link";
import Image from "next/image";
import {
  CUSTOMER_REVIEWS_SEED,
  FEATURED_REVIEW_INDEX,
} from "@/modules/landing/data/customer-reviews.seed";

export default function HomePage() {
  const totalReviews = CUSTOMER_REVIEWS_SEED.length;
  const featuredIndex = FEATURED_REVIEW_INDEX % totalReviews;
  const featuredReview = CUSTOMER_REVIEWS_SEED[featuredIndex];
  const leftReview =
    CUSTOMER_REVIEWS_SEED[(featuredIndex - 1 + totalReviews) % totalReviews];
  const rightReview = CUSTOMER_REVIEWS_SEED[(featuredIndex + 1) % totalReviews];

  return (
    <main className="min-h-screen bg-[#052538] px-2 py-2 sm:px-3 sm:py-3">
      <section className="relative mx-auto w-full max-w-[1280px] overflow-hidden rounded-[26px] border border-[#052538] shadow-[0_28px_80px_rgba(3,25,39,0.45)]">
        <div className="relative flex min-h-[760px] flex-col bg-[radial-gradient(circle_at_88%_4%,#2aa18f_0%,#052538_34%,#052538_76%)] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:58px_58px] opacity-30" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(112,255,186,0.16),transparent_43%)]" />

          <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
            <div className="flex items-center gap-2">
              <Image
                src="/yubeepay-logo.svg"
                alt="Yubeepay logo"
                width={34}
                height={34}
                className="h-[34px] w-[34px] rounded-lg"
              />
              <span className="text-lg font-semibold tracking-tight text-[#9ee9c2]">
                Yubeepay
              </span>
            </div>

            <nav className="hidden items-center gap-7 text-sm text-white/75 md:flex">
              <a href="#" className="transition hover:text-white">
                Personal Loan
              </a>
              <a href="#" className="transition hover:text-white">
                One Card
              </a>
              <a href="#" className="transition hover:text-white">
                Savings
              </a>
              <a href="#" className="transition hover:text-white">
                Checking
              </a>
              <a href="#" className="transition hover:text-white">
                Help
              </a>
            </nav>

            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/45 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Sign In
            </Link>
          </header>

          <div className="relative z-10 grid flex-1 items-center gap-10 px-6 py-10 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-9">
            <article className="max-w-[650px]">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/90 backdrop-blur">
                100% trusted platform
              </p>

              <h1 className="mt-6 text-[44px] font-black uppercase leading-[0.93] tracking-[-0.02em] sm:text-[68px] lg:text-[78px]">
                Finance with
                <br />
                Security and
                <br />
                <span className="text-[#d3ff57]">Flexibility</span>
              </h1>

              <p className="mt-6 max-w-[560px] text-[16px] leading-[1.55] text-white/84 sm:text-[18px]">
                No-fee checking account with cash back rewards. Enjoy fee-free
                banking and fast transfers across wallets with secure ledgering.
              </p>

              <div className="mt-9 flex items-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center rounded-full bg-[#2ddd63] px-7 text-sm font-semibold text-[#07331c] shadow-[0_10px_24px_rgba(45,221,99,0.35)] transition hover:brightness-110"
                >
                  Open Account
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#052538] transition hover:translate-x-1"
                >
                  ↗
                </Link>
              </div>
            </article>

            <article className="relative mx-auto mt-2 h-[430px] w-[320px] sm:h-[520px] sm:w-[410px]">
              <div className="absolute left-[24%] top-4 h-[380px] w-[190px] rotate-[8deg] rounded-[34px] border-[6px] border-[#0f1920] bg-[#f0f4f7] p-3 shadow-[0_28px_70px_rgba(0,0,0,0.45)] sm:h-[470px] sm:w-[230px]">
                <div className="mx-auto h-2 w-16 rounded-full bg-[#c0c8d2]" />
                <div className="mt-5 rounded-2xl bg-white p-4 text-[#112531]">
                  <p className="text-xs text-[#687886]">Welcome, Tom!</p>
                  <p className="mt-3 text-xl font-extrabold">$9,870.00</p>
                  <div className="mt-4 grid grid-cols-4 items-end gap-2">
                    <span className="h-14 rounded bg-[#d6dee5]" />
                    <span className="h-24 rounded bg-[#2bbf65]" />
                    <span className="h-[72px] rounded bg-[#dde4eb]" />
                    <span className="h-12 rounded bg-[#d6dee5]" />
                  </div>
                </div>
                <div className="mt-3 rounded-2xl bg-white p-3">
                  <div className="h-2 w-20 rounded bg-[#d9e0e7]" />
                  <div className="mt-2 h-2 w-24 rounded bg-[#d9e0e7]" />
                  <div className="mt-4 h-10 rounded-xl bg-[#edf2f6]" />
                </div>
              </div>

              <div className="absolute left-[8%] top-[52%] z-20 w-[170px] -rotate-[8deg] rounded-2xl border border-white/15 bg-[linear-gradient(140deg,#2a8670,#0e5f52)] p-4 shadow-[0_20px_40px_rgba(0,0,0,0.35)] sm:w-[210px]">
                <div className="flex items-center justify-between text-white/90">
                  <span className="h-7 w-10 rounded bg-white/90" />
                  <span className="text-xs">contactless</span>
                </div>
                <p className="mt-8 text-xl font-bold">Yubeepay</p>
                <p className="text-xs text-white/75">OneCard</p>
                <p className="mt-5 text-right text-xs font-semibold text-white/80">
                  VISA
                </p>
              </div>

              <div className="absolute right-0 top-[58%] z-10 w-[132px] rotate-[6deg] rounded-2xl bg-[#d2f44f] px-4 py-7 text-center text-2xl font-extrabold text-[#12391f] shadow-[0_20px_36px_rgba(0,0,0,0.28)] sm:w-[154px]">
                App
              </div>
            </article>
          </div>
        </div>

        <div className="h-[18px] bg-[linear-gradient(180deg,#1f8265_0%,#e8edf7_100%)]" />

        <div className="bg-[#f3f5fa] px-5 py-8 text-[#101827] sm:px-8 sm:py-10 lg:px-12">
          <h2 className="max-w-2xl text-[34px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[42px]">
            Experience the convenience of making multiple payments with one app.
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:gap-5">
            <article className="rounded-[22px] border border-[#d9deea] bg-[#e8edf7] p-5 sm:p-7">
              <div className="rounded-[18px] border border-[#d6ddeb] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm">
                      <span className="font-semibold">INR</span>
                      <span className="text-[#4b5563]">200</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm">
                      <span className="font-semibold">USD</span>
                      <span className="text-[#4b5563]">4.758</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-[linear-gradient(145deg,#ffd9c8,#f1a37f)]" />
                </div>
                <button className="mt-4 h-11 w-full rounded-xl bg-[#052538] text-sm font-semibold text-white transition hover:brightness-110">
                  Send money
                </button>
              </div>

              <h3 className="mt-5 text-center text-[28px] font-bold tracking-[-0.01em]">
                Multi Currency Support
              </h3>
              <p className="mt-2 text-center text-sm leading-relaxed text-[#5b667a]">
                Handle all your payments seamlessly across different currencies
                with reliable exchange information and secure transfer
                orchestration.
              </p>
            </article>

            <div className="grid gap-4">
              <article className="rounded-[22px] border border-[#d9deea] bg-[#eef1f7] p-5 sm:p-6">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#b9c8f5] text-[#052538]">
                  ◌
                </div>
                <h3 className="mt-4 text-[28px] font-bold tracking-[-0.01em]">
                  Safe &amp; Secure
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b667a]">
                  We apply robust security controls and monitoring to keep every
                  transaction protected from initiation to ledger confirmation.
                </p>
              </article>

              <article className="rounded-[22px] border border-[#d9deea] bg-[#eef1f7] p-5 sm:p-6">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#b9c8f5] text-[#052538]">
                  ✓
                </div>
                <h3 className="mt-4 text-[28px] font-bold tracking-[-0.01em]">
                  Transparency
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b667a]">
                  Every operation is traceable with clear status, references,
                  and auditable records suitable for enterprise compliance.
                </p>
              </article>
            </div>

            <article className="rounded-[22px] border border-[#d9deea] bg-[#eef1f7] p-5 sm:p-6">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#b9c8f5] text-[#052538]">
                ↗
              </div>
              <h3 className="mt-4 text-[28px] font-bold tracking-[-0.01em]">
                Speed
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b667a]">
                Optimized request handling and idempotent flows provide stable,
                high-throughput execution for everyday payment operations.
              </p>

              <div className="mt-6 border-t border-[#d8ddea] pt-5">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#b9c8f5] text-[#052538]">
                  ☆
                </div>
                <h3 className="mt-4 text-[28px] font-bold tracking-[-0.01em]">
                  Experience
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b667a]">
                  A clean operations interface helps teams move faster with
                  fewer errors while preserving full transactional context.
                </p>
              </div>
            </article>

            <article className="rounded-[22px] border border-[#d9deea] bg-[#e8edf7] p-5 sm:p-7">
              <div className="mx-auto flex w-fit items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0f0] text-lg font-bold text-[#e5484d]">
                  J
                </span>
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#052538] p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                  <Image
                    src="/yubeepay-logo.svg"
                    alt="Yubeepay logo"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff5e6] text-lg font-bold text-[#ff8a00]">
                  ✶
                </span>
              </div>

              <h3 className="mt-6 text-center text-[28px] font-bold tracking-[-0.01em]">
                Effortless Integration
              </h3>
              <p className="mx-auto mt-2 max-w-md text-center text-sm leading-relaxed text-[#5b667a]">
                Integrate payment operations into your existing financial
                workflows with minimal friction and clear implementation
                boundaries.
              </p>
            </article>
          </div>

          <div className="mt-9 border-t border-[#d7dde8] pt-9">
            <h2 className="text-[34px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[42px]">
              How it works?
            </h2>

            <div className="relative mt-6 grid gap-5 lg:grid-cols-3">
              <div className="pointer-events-none absolute left-[16%] right-[16%] top-[130px] hidden border-t-2 border-dashed border-[#052538]/55 lg:block" />

              <article className="relative rounded-[22px] border border-[#d9deea] bg-white p-3 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80"
                  alt="User signing up on mobile"
                  className="h-[198px] w-full rounded-[16px] object-cover"
                />
                <div className="px-1 pb-2 pt-4">
                  <p className="text-xs font-semibold text-[#052538]">Step 1</p>
                  <h3 className="mt-2 text-[24px] font-bold tracking-[-0.01em]">
                    Easy Sign Up
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5b667a]">
                    Create your account in seconds and unlock all the features
                    waiting for you.
                  </p>
                </div>
              </article>

              <article className="relative rounded-[22px] border border-[#d9deea] bg-white p-3 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                <img
                  src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=900&q=80"
                  alt="Linking a bank account"
                  className="h-[198px] w-full rounded-[16px] object-cover"
                />
                <div className="px-1 pb-2 pt-4">
                  <p className="text-xs font-semibold text-[#052538]">Step 2</p>
                  <h3 className="mt-2 text-[24px] font-bold tracking-[-0.01em]">
                    Link Your Bank Account
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5b667a]">
                    Connect your account quickly with trusted verification and
                    secure access controls.
                  </p>
                </div>
              </article>

              <article className="relative rounded-[22px] border border-[#d9deea] bg-white p-3 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                <img
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80"
                  alt="Starting transactions at merchant point"
                  className="h-[198px] w-full rounded-[16px] object-cover"
                />
                <div className="px-1 pb-2 pt-4">
                  <p className="text-xs font-semibold text-[#052538]">Step 3</p>
                  <h3 className="mt-2 text-[24px] font-bold tracking-[-0.01em]">
                    Begin Your Transactions
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5b667a]">
                    Send and manage payments instantly while keeping full
                    visibility of every operation.
                  </p>
                </div>
              </article>
            </div>
          </div>

          <div className="mt-11 border-t border-[#d7dde8] pt-10">
            <h2 className="text-center text-[34px] font-bold leading-[1.12] tracking-[-0.02em] sm:text-[42px]">
              Customer reviews about Yubeepay
            </h2>

            <div className="relative mx-auto mt-7 max-w-5xl">
              <div className="hidden items-center justify-between gap-4 lg:flex">
                <article className="w-[28%] rounded-2xl border border-[#e1e6f0] bg-white/55 p-5 opacity-45 blur-[0.2px]">
                  <p className="text-sm leading-relaxed text-[#6a7488]">
                    {leftReview.review}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#052538] text-xs font-bold text-white">
                      {leftReview.avatarText}
                    </span>
                    <p className="text-sm font-semibold text-[#4a5568]">
                      {leftReview.name}
                    </p>
                  </div>
                </article>

                <article className="w-[44%] rounded-2xl border border-[#d9deea] bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.1)]">
                  <p className="text-center text-[15px] leading-relaxed text-[#30384a]">
                    &ldquo;{featuredReview.review}&rdquo;
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0f172a] text-sm font-semibold text-white">
                      {featuredReview.avatarText}
                    </span>
                    <p className="text-sm font-semibold text-[#1f2937]">
                      {featuredReview.name}, {featuredReview.role}
                    </p>
                  </div>
                </article>

                <article className="w-[28%] rounded-2xl border border-[#e1e6f0] bg-white/55 p-5 opacity-45 blur-[0.2px]">
                  <p className="text-sm leading-relaxed text-[#6a7488]">
                    {rightReview.review}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fde6e6] text-xs font-bold text-[#be2b2b]">
                      {rightReview.avatarText}
                    </span>
                    <p className="text-sm font-semibold text-[#4a5568]">
                      {rightReview.name}
                    </p>
                  </div>
                </article>
              </div>

              <article className="rounded-2xl border border-[#d9deea] bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.1)] lg:hidden">
                <p className="text-center text-[15px] leading-relaxed text-[#30384a]">
                  &ldquo;{featuredReview.review}&rdquo;
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0f172a] text-sm font-semibold text-white">
                    {featuredReview.avatarText}
                  </span>
                  <p className="text-sm font-semibold text-[#1f2937]">
                    {featuredReview.name}, {featuredReview.role}
                  </p>
                </div>
              </article>

              <div className="mt-4 flex items-center justify-center gap-2">
                {CUSTOMER_REVIEWS_SEED.map((review, index) => (
                  <span
                    key={review.id}
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === featuredIndex ? "bg-[#052538]" : "bg-[#c6cede]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-[22px] border border-[#d6ddeb] bg-white">
            <div className="relative bg-[radial-gradient(circle_at_85%_8%,#2aa18f_0%,#052538_38%,#052538_82%)] px-6 py-12 text-center text-white sm:px-10 sm:py-14">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,transparent_47%,rgba(255,255,255,0.08)_47%,rgba(255,255,255,0.08)_53%,transparent_53%,transparent_100%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
              <div className="relative z-10 mx-auto max-w-2xl">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 p-1.5 backdrop-blur-sm">
                  <Image
                    src="/yubeepay-logo.svg"
                    alt="Yubeepay logo"
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-lg object-cover"
                  />
                </span>
                <h3 className="mt-4 text-[36px] font-bold leading-[1.08] tracking-[-0.02em] sm:text-[48px]">
                  Get Started with Yubeepay Today
                </h3>
                <p className="mx-auto mt-4 max-w-xl text-sm text-white/82 sm:text-base">
                  Experience seamless and secure transactions at your
                  fingertips. Sign up now and simplify your payments with just a
                  few taps.
                </p>
                <div className="mt-7">
                  <Link
                    href="/signup"
                    className="group inline-flex h-12 items-center gap-2 rounded-xl border border-white/75 bg-[linear-gradient(180deg,#ffffff_0%,#eef7ff_100%)] px-6 text-sm font-semibold text-[#052538] shadow-[0_12px_26px_rgba(4,19,67,0.34)] transition duration-200 hover:translate-y-[-1px] hover:shadow-[0_16px_30px_rgba(4,19,67,0.42)] active:translate-y-0"
                  >
                    Get started now
                    <span className="text-base leading-none transition group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <footer className="bg-[#f4f6fb] px-6 py-8 text-[#1f2937] sm:px-10 sm:py-10">
              <div className="grid gap-8 border-b border-[#d8deea] pb-8 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
                <div>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/yubeepay-logo.svg"
                      alt="Yubeepay logo"
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-md"
                    />
                    <span className="text-lg font-bold">Yubeepay</span>
                  </div>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#5b667a]">
                    Find quick solutions and helpful tips for using Yubeepay. We
                    are here to answer your most asked questions.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-[#111827]">
                    About
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm text-[#5b667a]">
                    <li>Our Story</li>
                    <li>Careers</li>
                    <li>Blog</li>
                    <li>Contact Us</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-[#111827]">
                    Resources
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm text-[#5b667a]">
                    <li>Help Center</li>
                    <li>API Documentation</li>
                    <li>Community</li>
                    <li>Partners</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-[#111827]">
                    Product
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm text-[#5b667a]">
                    <li>For Personal</li>
                    <li>For Business</li>
                    <li>Payment Solutions</li>
                    <li>Integrations</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-[#111827]">
                    Support
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm text-[#5b667a]">
                    <li>Customer Support</li>
                    <li>FAQ</li>
                    <li>Report a Problem</li>
                    <li>Security &amp; Privacy</li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 text-xs text-[#6b7280] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <span>Privacy Policy</span>
                  <span>Cookie Policy</span>
                  <span>Legal</span>
                </div>
                <span>2026 Yubeepay Financial Services</span>
                <div className="flex items-center gap-3 text-sm text-[#7c879c]">
                  <span>X</span>
                  <span>in</span>
                  <span>f</span>
                  <span>ig</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}
