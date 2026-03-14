import { SignupForm } from "@/modules/auth/components/signup-form";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
      <section className="card overflow-hidden">
        <header className="border-b border-border bg-surface-2 px-6 py-5">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="mt-1 text-sm text-muted">
            Register to start using the platform
          </p>
        </header>
        <div className="px-6 py-6">
          <SignupForm />
        </div>
      </section>
    </main>
  );
}
