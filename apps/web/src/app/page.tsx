"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  CUSTOMER_REVIEWS_SEED,
  FEATURED_REVIEW_INDEX,
} from "@/modules/landing/data/customer-reviews.seed";

const EASE = [0.22, 1, 0.36, 1] as const;
const LOOP_EASE = "easeInOut" as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: EASE,
    },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.65,
      delay,
      ease: EASE,
    },
  }),
};

const floatingAnimation = {
  y: [0, -10, 0],
  rotate: [0, 1.2, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: LOOP_EASE,
  },
};

const floatingAnimationSlow = {
  y: [0, 10, 0],
  rotate: [0, -1.5, 0],
  transition: {
    duration: 7.5,
    repeat: Infinity,
    ease: LOOP_EASE,
  },
};

const featureCards = [
  {
    icon: "◌",
    title: "Safe & Secure",
    description:
      "We apply robust security controls and monitoring to keep every transaction protected from initiation to ledger confirmation.",
  },
  {
    icon: "✓",
    title: "Transparency",
    description:
      "Every operation is traceable with clear status, references, and auditable records suitable for enterprise compliance.",
  },
  {
    icon: "↗",
    title: "Speed",
    description:
      "Optimized request handling and idempotent flows provide stable, high-throughput execution for everyday payment operations.",
  },
  {
    icon: "☆",
    title: "Experience",
    description:
      "A clean operations interface helps teams move faster with fewer errors while preserving full transactional context.",
  },
];

const steps = [
  {
    step: "Step 1",
    title: "Easy Sign Up",
    description:
      "Create your account in seconds and unlock all the features waiting for you.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80",
    alt: "User signing up on mobile",
  },
  {
    step: "Step 2",
    title: "Link Your Bank Account",
    description:
      "Connect your account quickly with trusted verification and secure access controls.",
    image:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80",
    alt: "Linking a bank account",
  },
  {
    step: "Step 3",
    title: "Begin Your Transactions",
    description:
      "Send and manage payments instantly while keeping full visibility of every operation.",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    alt: "Starting transactions at merchant point",
  },
];

const stats = [
  { value: "2M+", label: "Transactions completed" },
  { value: "99.99%", label: "Platform uptime" },
  { value: "150+", label: "Supported corridors" },
];

export default function HomePage() {
  const totalReviews = CUSTOMER_REVIEWS_SEED.length;
  const featuredIndex = FEATURED_REVIEW_INDEX % totalReviews;
  const featuredReview = CUSTOMER_REVIEWS_SEED[featuredIndex];
  const leftReview =
    CUSTOMER_REVIEWS_SEED[(featuredIndex - 1 + totalReviews) % totalReviews];
  const rightReview = CUSTOMER_REVIEWS_SEED[(featuredIndex + 1) % totalReviews];

  return (
    <main className="min-h-screen bg-[#031a29] px-2 py-2 sm:px-3 sm:py-3">
      <section className="mx-auto w-full max-w-360 overflow-hidden rounded-4xl border border-white/10 bg-[#052538] shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(42,161,143,0.18),transparent_30%),radial-gradient(circle_at_88%_8%,rgba(145,255,160,0.16),transparent_25%),linear-gradient(180deg,#06293d_0%,#041f31_44%,#051b29_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[72px_72px] opacity-30" />
          <div className="absolute left-1/2 top-0 h-135 w-135 -translate-x-1/2 rounded-full bg-[#55ff9b]/10 blur-3xl" />

          <header className="relative z-20 px-4 pt-4 sm:px-6 md:px-10 md:pt-6">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl md:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <Image
                    src="/yubeepay-logo.svg"
                    alt="Yubeepay logo"
                    width={30}
                    height={30}
                    className="h-7 w-7 rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-base font-semibold tracking-tight text-white">
                    Yubeepay
                  </p>
                  <p className="text-xs text-white/55">
                    Modern financial infrastructure
                  </p>
                </div>
              </div>

              <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 text-sm text-white/70 lg:flex">
                {[
                  "Personal Loan",
                  "One Card",
                  "Savings",
                  "Checking",
                  "Help",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
                  >
                    {item}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#d3ff57] px-5 text-sm font-semibold text-[#06262f] transition hover:-translate-y-px hover:brightness-105"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="hidden h-11 items-center justify-center rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </header>

          <div className="relative z-10 px-4 pb-14 pt-10 sm:px-6 md:px-10 md:pb-20 md:pt-14">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] xl:gap-20">
              <div className="max-w-170">
                <motion.div
                  custom={0.05}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur"
                >
                  <span className="h-2 w-2 rounded-full bg-[#d3ff57]" />
                  100% trusted platform
                </motion.div>

                <motion.h1
                  custom={0.12}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  className="mt-6 max-w-[11ch] text-[46px] font-black uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-[68px] lg:text-[84px]"
                >
                  Finance with security and
                  <span className="block text-[#d3ff57]">flexibility</span>
                </motion.h1>

                <motion.p
                  custom={0.2}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  className="mt-6 max-w-147.5 text-[17px] leading-[1.7] text-white/74 sm:text-[18px]"
                >
                  No-fee checking account with cash back rewards. Enjoy fee-free
                  banking, fast transfers across wallets, and secure ledgering
                  built for modern payment operations.
                </motion.p>

                <motion.div
                  custom={0.28}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <Link
                      href="/signup"
                      className="inline-flex h-14 items-center rounded-full bg-[#2ddd63] px-7 text-sm font-semibold text-[#07331c] shadow-[0_14px_30px_rgba(45,221,99,0.28)] transition hover:-translate-y-px hover:brightness-105"
                    >
                      Open Account
                    </Link>
                    <Link
                      href="/signup"
                      className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white text-2xl font-bold text-[#052538] transition hover:translate-x-1"
                    >
                      ↗
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-white/65">
                    <div className="flex -space-x-2">
                      {["A", "M", "J"].map((item) => (
                        <span
                          key={item}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#052538] bg-white/90 text-xs font-bold text-[#052538]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <span>Trusted by teams moving money every day</span>
                  </div>
                </motion.div>

                <motion.div
                  custom={0.38}
                  initial="hidden"
                  animate="show"
                  variants={fadeUp}
                  className="mt-10 grid gap-4 sm:grid-cols-3"
                >
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/10 bg-white/6 px-5 py-4 backdrop-blur-md"
                    >
                      <p className="text-2xl font-bold tracking-tight text-white">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial="hidden"
                animate="show"
                variants={scaleIn}
                custom={0.2}
                className="relative mx-auto h-140 w-full max-w-140"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.03, 1],
                    opacity: [0.55, 0.8, 0.55],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-1/2 top-1/2 h-105 w-105 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(104,255,192,0.25)_0%,rgba(104,255,192,0.06)_42%,transparent_72%)] blur-2xl"
                />

                <motion.div
                  animate={floatingAnimation}
                  className="absolute left-[5%] top-[6%] z-20 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                    Uptime
                  </p>
                  <p className="mt-1 text-xl font-bold text-white">99.99%</p>
                </motion.div>

                <motion.div
                  animate={floatingAnimationSlow}
                  className="absolute right-[1%] top-[12%] z-20 rounded-2xl border border-[#d7ff72]/20 bg-[#d3ff57] px-4 py-3 text-[#0b2f22] shadow-[0_20px_40px_rgba(211,255,87,0.18)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                    Instant
                  </p>
                  <p className="mt-1 text-lg font-black">Settlement</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -8, rotate: -2 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="absolute bottom-[11%] left-[4%] z-30 w-55 rounded-[26px] border border-white/15 bg-[linear-gradient(145deg,#2a8670,#0e5f52)] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.28)]"
                >
                  <div className="flex items-center justify-between text-white/85">
                    <span className="h-8 w-12 rounded-md bg-white/90" />
                    <span className="text-xs uppercase tracking-[0.18em]">
                      Contactless
                    </span>
                  </div>
                  <p className="mt-10 text-2xl font-bold text-white">
                    Yubeepay
                  </p>
                  <p className="text-xs text-white/70">OneCard</p>
                  <div className="mt-8 flex items-end justify-between">
                    <p className="text-xs font-semibold tracking-[0.2em] text-white/60">
                      **** 2481
                    </p>
                    <p className="text-sm font-bold text-white">VISA</p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="absolute left-1/2 top-1/2 z-10 w-72.5 -translate-x-1/2 -translate-y-[52%] -rotate-6 rounded-[38px] border-8 border-[#101922] bg-[#eef3f8] p-4 shadow-[0_36px_90px_rgba(0,0,0,0.35)] sm:w-[320px]"
                >
                  <div className="mx-auto h-2.5 w-20 rounded-full bg-[#c5ced7]" />
                  <div className="mt-5 rounded-[26px] bg-white p-5 text-[#102332] shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#6b7d8d]">
                          Available balance
                        </p>
                        <p className="mt-3 text-[30px] font-black tracking-tight">
                          $9,870.00
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#052538] px-3 py-2 text-xs font-semibold text-white">
                        +12.4%
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-4 items-end gap-2">
                      <motion.span
                        animate={{ height: [58, 75, 58] }}
                        transition={{ duration: 4.5, repeat: Infinity }}
                        className="rounded-xl bg-[#d6dee5]"
                      />
                      <motion.span
                        animate={{ height: [96, 122, 96] }}
                        transition={{ duration: 4.2, repeat: Infinity }}
                        className="rounded-xl bg-[#2bbf65]"
                      />
                      <motion.span
                        animate={{ height: [82, 96, 82] }}
                        transition={{ duration: 4.8, repeat: Infinity }}
                        className="rounded-xl bg-[#dde4eb]"
                      />
                      <motion.span
                        animate={{ height: [46, 72, 46] }}
                        transition={{ duration: 4.4, repeat: Infinity }}
                        className="rounded-xl bg-[#d6dee5]"
                      />
                    </div>
                  </div>

                  <div className="mt-4 rounded-[26px] bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#6b7d8d]">
                          Last transfer
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[#102332]">
                          USD → INR settlement
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#ebfff2] px-3 py-2 text-xs font-semibold text-[#1e8b4a]">
                        Success
                      </div>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-[#edf2f6]">
                      <motion.div
                        initial={{ width: "62%" }}
                        animate={{ width: ["62%", "78%", "62%"] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="h-3 rounded-full bg-[linear-gradient(90deg,#09293b,#2ddd63)]"
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={floatingAnimation}
                  whileHover={{ y: -6 }}
                  className="absolute bottom-[12%] right-[2%] z-20 w-42.5 rotate-6 rounded-[28px] border border-white/20 bg-[#d3ff57] px-5 py-8 text-center text-[#12391f] shadow-[0_24px_44px_rgba(0,0,0,0.22)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f4c2d]/70">
                    Mobile-first
                  </p>
                  <p className="mt-2 text-3xl font-black">App</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="h-4 bg-[linear-gradient(90deg,#1e6f5d_0%,#d3ff57_50%,#ebf1fb_100%)]" />

        <div className="bg-[linear-gradient(180deg,#f5f8fc_0%,#eff4f9_100%)] px-4 py-12 text-[#101827] sm:px-6 md:px-10 md:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0}
              className="max-w-3xl"
            >
              <span className="inline-flex rounded-full border border-[#dbe3ef] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#425466]">
                Built for smoother payment operations
              </span>
              <h2 className="mt-5 text-[36px] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[48px]">
                Experience the convenience of making multiple payments with one
                app.
              </h2>
            </motion.div>

            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              custom={0.12}
              className="max-w-xl text-[15px] leading-[1.8] text-[#5b667a]"
            >
              The section below is rebalanced into a more editorial, asymmetric
              grid so the page feels more premium and less template-like.
            </motion.p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-12">
            <motion.article
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={scaleIn}
              custom={0.05}
              whileHover={{ y: -8 }}
              className="rounded-[28px] border border-[#d8e0ed] bg-[#e7edf8] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] lg:col-span-5 lg:row-span-2 sm:p-7"
            >
              <div className="rounded-3xl border border-[#d6ddeb] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] px-4 py-3 text-sm">
                      <span className="font-semibold">INR</span>
                      <span className="text-[#4b5563]">200</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] px-4 py-3 text-sm">
                      <span className="font-semibold">USD</span>
                      <span className="text-[#4b5563]">4.758</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] px-4 py-3 text-sm">
                      <span className="font-semibold">EUR</span>
                      <span className="text-[#4b5563]">1.218</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-[linear-gradient(145deg,#ffd9c8,#f1a37f)]" />
                    <div className="h-11 w-11 rounded-full bg-[linear-gradient(145deg,#d8fddb,#6de98c)]" />
                    <div className="h-11 w-11 rounded-full bg-[linear-gradient(145deg,#dce7ff,#97b5ff)]" />
                  </div>
                </div>

                <button className="mt-5 h-12 w-full rounded-2xl bg-[#052538] text-sm font-semibold text-white transition hover:brightness-110">
                  Send money
                </button>
              </div>

              <h3 className="mt-6 text-[30px] font-bold tracking-[-0.02em]">
                Multi Currency Support
              </h3>
              <p className="mt-3 max-w-md text-sm leading-[1.8] text-[#5b667a]">
                Handle all your payments seamlessly across different currencies
                with reliable exchange information and secure transfer
                orchestration.
              </p>
            </motion.article>

            <div className="grid gap-5 lg:col-span-4">
              {featureCards.slice(0, 2).map((feature, index) => (
                <motion.article
                  key={feature.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={scaleIn}
                  custom={0.12 + index * 0.08}
                  whileHover={{ y: -8 }}
                  className="rounded-[28px] border border-[#d8e0ed] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#b9c8f5] bg-[#f6f8ff] text-[#052538]">
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-[28px] font-bold tracking-[-0.02em]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.8] text-[#5b667a]">
                    {feature.description}
                  </p>
                </motion.article>
              ))}
            </div>

            <motion.article
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={scaleIn}
              custom={0.22}
              whileHover={{ y: -8 }}
              className="rounded-[28px] border border-[#d8e0ed] bg-[#eef2f7] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] lg:col-span-3 lg:row-span-2"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#b9c8f5] bg-white text-[#052538]">
                {featureCards[2].icon}
              </div>
              <h3 className="mt-5 text-[28px] font-bold tracking-[-0.02em]">
                {featureCards[2].title}
              </h3>
              <p className="mt-3 text-sm leading-[1.8] text-[#5b667a]">
                {featureCards[2].description}
              </p>

              <div className="mt-8 border-t border-[#d8ddea] pt-7">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#b9c8f5] bg-white text-[#052538]">
                  {featureCards[3].icon}
                </div>
                <h3 className="mt-5 text-[28px] font-bold tracking-[-0.02em]">
                  {featureCards[3].title}
                </h3>
                <p className="mt-3 text-sm leading-[1.8] text-[#5b667a]">
                  {featureCards[3].description}
                </p>
              </div>
            </motion.article>

            <motion.article
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={scaleIn}
              custom={0.28}
              whileHover={{ y: -8 }}
              className="rounded-[28px] border border-[#d8e0ed] bg-[#e8edf7] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] lg:col-span-9"
            >
              <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
                <div className="mx-auto flex w-fit items-center gap-3 rounded-[22px] bg-white px-5 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0f0] text-lg font-bold text-[#e5484d]">
                    J
                  </span>
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#052538] p-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                    <Image
                      src="/yubeepay-logo.svg"
                      alt="Yubeepay logo"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  </span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff5e6] text-lg font-bold text-[#ff8a00]">
                    ✶
                  </span>
                </div>

                <div className="max-w-xl text-center md:text-left">
                  <h3 className="text-[30px] font-bold tracking-[-0.02em]">
                    Effortless Integration
                  </h3>
                  <p className="mt-3 text-sm leading-[1.8] text-[#5b667a]">
                    Integrate payment operations into your existing financial
                    workflows with minimal friction and clear implementation
                    boundaries.
                  </p>
                </div>
              </div>
            </motion.article>
          </div>

          <div className="mt-14 border-t border-[#d7dde8] pt-12">
            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              className="text-[36px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[48px]"
            >
              How it works?
            </motion.h2>

            <div className="relative mt-8 grid gap-6 lg:grid-cols-3">
              <div className="pointer-events-none absolute left-[16%] right-[16%] top-33 hidden border-t-2 border-dashed border-[#052538]/35 lg:block" />

              {steps.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.22 }}
                  variants={scaleIn}
                  custom={0.05 + index * 0.08}
                  whileHover={{ y: -10 }}
                  className={`relative rounded-[28px] border border-[#d9deea] bg-white p-3 shadow-[0_18px_36px_rgba(15,23,42,0.06)] ${
                    index === 1 ? "lg:translate-y-6" : ""
                  }`}
                >
                  <div className="overflow-hidden rounded-[22px]">
                    <motion.img
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      src={item.image}
                      alt={item.alt}
                      className="h-55 w-full object-cover"
                    />
                  </div>

                  <div className="px-2 pb-3 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#052538]">
                      {item.step}
                    </p>
                    <h3 className="mt-3 text-[26px] font-bold tracking-[-0.02em]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.8] text-[#5b667a]">
                      {item.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="mt-16 border-t border-[#d7dde8] pt-12">
            <motion.h2
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              className="text-center text-[36px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[48px]"
            >
              Customer reviews about Yubeepay
            </motion.h2>

            <div className="relative mx-auto mt-8 max-w-6xl">
              <div className="hidden items-center justify-between gap-5 lg:flex">
                <motion.article
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={scaleIn}
                  custom={0.05}
                  whileHover={{ y: -6, opacity: 1 }}
                  className="w-[27%] rounded-3xl border border-[#e1e6f0] bg-white/70 p-6 opacity-60 shadow-[0_12px_28px_rgba(15,23,42,0.04)] backdrop-blur-sm"
                >
                  <p className="text-sm leading-[1.9] text-[#6a7488]">
                    {leftReview.review}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#052538] text-xs font-bold text-white">
                      {leftReview.avatarText}
                    </span>
                    <p className="text-sm font-semibold text-[#4a5568]">
                      {leftReview.name}
                    </p>
                  </div>
                </motion.article>

                <motion.article
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={scaleIn}
                  custom={0.14}
                  whileHover={{ y: -10, scale: 1.015 }}
                  className="relative w-[46%] overflow-hidden rounded-[28px] border border-[#d9deea] bg-white p-8 shadow-[0_24px_54px_rgba(15,23,42,0.12)]"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#052538_0%,#2ddd63_55%,#d3ff57_100%)]" />
                  <p className="text-center text-[17px] leading-[1.9] text-[#30384a]">
                    &ldquo;{featuredReview.review}&rdquo;
                  </p>

                  <div className="mt-6 flex items-center justify-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0f172a] text-sm font-semibold text-white">
                      {featuredReview.avatarText}
                    </span>
                    <p className="text-sm font-semibold text-[#1f2937]">
                      {featuredReview.name}, {featuredReview.role}
                    </p>
                  </div>
                </motion.article>

                <motion.article
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={scaleIn}
                  custom={0.22}
                  whileHover={{ y: -6, opacity: 1 }}
                  className="w-[27%] rounded-3xl border border-[#e1e6f0] bg-white/70 p-6 opacity-60 shadow-[0_12px_28px_rgba(15,23,42,0.04)] backdrop-blur-sm"
                >
                  <p className="text-sm leading-[1.9] text-[#6a7488]">
                    {rightReview.review}
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fde6e6] text-xs font-bold text-[#be2b2b]">
                      {rightReview.avatarText}
                    </span>
                    <p className="text-sm font-semibold text-[#4a5568]">
                      {rightReview.name}
                    </p>
                  </div>
                </motion.article>
              </div>

              <motion.article
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={scaleIn}
                custom={0.1}
                className="rounded-[28px] border border-[#d9deea] bg-white p-6 shadow-[0_24px_54px_rgba(15,23,42,0.1)] lg:hidden"
              >
                <p className="text-center text-[16px] leading-[1.9] text-[#30384a]">
                  &ldquo;{featuredReview.review}&rdquo;
                </p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f172a] text-sm font-semibold text-white">
                    {featuredReview.avatarText}
                  </span>
                  <p className="text-sm font-semibold text-[#1f2937]">
                    {featuredReview.name}, {featuredReview.role}
                  </p>
                </div>
              </motion.article>

              <div className="mt-5 flex items-center justify-center gap-2">
                {CUSTOMER_REVIEWS_SEED.map((review, index) => (
                  <motion.span
                    key={review.id}
                    animate={{
                      scale: index === featuredIndex ? 1.15 : 1,
                      opacity: index === featuredIndex ? 1 : 0.6,
                    }}
                    className={`h-2 w-2 rounded-full ${
                      index === featuredIndex ? "bg-[#052538]" : "bg-[#c6cede]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={scaleIn}
            custom={0.08}
            className="mt-16 overflow-hidden rounded-[30px] border border-[#d6ddeb] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
          >
            <div className="relative overflow-hidden bg-[radial-gradient(circle_at_85%_8%,#2aa18f_0%,#052538_40%,#041a28_88%)] px-6 py-14 text-center text-white sm:px-10 sm:py-16">
              <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,transparent_47%,rgba(255,255,255,0.06)_47%,rgba(255,255,255,0.06)_53%,transparent_53%,transparent_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[56px_56px] opacity-20" />
              <motion.div
                animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute left-1/2 top-1/2 h-85 w-85 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6cffb9]/10 blur-3xl"
              />

              <div className="relative z-10 mx-auto max-w-2xl">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 p-2 backdrop-blur-sm">
                  <Image
                    src="/yubeepay-logo.svg"
                    alt="Yubeepay logo"
                    width={30}
                    height={30}
                    className="h-7 w-7 rounded-lg object-cover"
                  />
                </span>

                <h3 className="mt-5 text-[38px] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[54px]">
                  Get Started with Yubeepay Today
                </h3>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-[1.9] text-white/80 sm:text-base">
                  Experience seamless and secure transactions at your
                  fingertips. Sign up now and simplify your payments with just a
                  few taps.
                </p>

                <div className="mt-8">
                  <Link
                    href="/signup"
                    className="group inline-flex h-13 items-center gap-2 rounded-2xl border border-white/70 bg-[linear-gradient(180deg,#ffffff_0%,#eef7ff_100%)] px-7 py-3 text-sm font-semibold text-[#052538] shadow-[0_18px_34px_rgba(4,19,67,0.28)] transition duration-200 hover:-translate-y-px hover:shadow-[0_20px_38px_rgba(4,19,67,0.36)]"
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
                  <p className="mt-3 max-w-xs text-sm leading-[1.8] text-[#5b667a]">
                    Find quick solutions and helpful tips for using Yubeepay. We
                    are here to answer your most asked questions.
                  </p>
                </div>

                {[
                  {
                    title: "About",
                    items: ["Our Story", "Careers", "Blog", "Contact Us"],
                  },
                  {
                    title: "Resources",
                    items: [
                      "Help Center",
                      "API Documentation",
                      "Community",
                      "Partners",
                    ],
                  },
                  {
                    title: "Product",
                    items: [
                      "For Personal",
                      "For Business",
                      "Payment Solutions",
                      "Integrations",
                    ],
                  },
                  {
                    title: "Support",
                    items: [
                      "Customer Support",
                      "FAQ",
                      "Report a Problem",
                      "Security & Privacy",
                    ],
                  },
                ].map((group) => (
                  <div key={group.title}>
                    <h4 className="text-sm font-bold uppercase tracking-wide text-[#111827]">
                      {group.title}
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-[#5b667a]">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="transition hover:text-[#052538]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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
          </motion.div>
        </div>
      </section>
    </main>
  );
}
