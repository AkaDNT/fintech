"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchemaInput,
} from "@/modules/auth/schemas/register.schema";
import { useRegister } from "@/modules/auth/hooks/use-register";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

export function SignupForm() {
  const registerMutation = useRegister();

  const form = useForm<RegisterSchemaInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => registerMutation.mutate(values))}
    >
      <div className="space-y-1">
        <label className="text-sm font-semibold">Email</label>
        <Input type="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-xs text-danger">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Password</label>
        <Input type="password" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-xs text-danger">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold">Confirm Password</label>
        <Input type="password" {...form.register("confirmPassword")} />
        {form.formState.errors.confirmPassword ? (
          <p className="text-xs text-danger">
            {form.formState.errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </form>
  );
}
