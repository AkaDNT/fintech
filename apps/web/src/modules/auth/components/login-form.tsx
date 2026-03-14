"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginSchemaInput,
} from "@/modules/auth/schemas/login.schema";
import { useLogin } from "@/modules/auth/hooks/use-login";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

export function LoginForm() {
  const loginMutation = useLogin();

  const form = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}
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

      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
