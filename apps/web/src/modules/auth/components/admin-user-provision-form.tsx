"use client";

import { useState } from "react";
import { useCreateUser } from "@/modules/auth/hooks/use-create-user";
import { useEnsureWallets } from "@/modules/wallets/hooks/use-ensure-wallets";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import type { UserRole } from "@/shared/types/common.types";

export function AdminUserProvisionForm() {
  const createUserMutation = useCreateUser();
  const ensureWalletsMutation = useEnsureWallets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [userId, setUserId] = useState("");

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="card p-5">
        <h2 className="text-lg font-bold">Create User</h2>
        <p className="mt-1 text-sm text-muted">
          Admin endpoint: POST /auth/create-user
        </p>

        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            createUserMutation.mutate({ email, password, role });
          }}
        >
          <Input
            placeholder="user@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Select
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </Select>
          <Button type="submit" disabled={createUserMutation.isPending}>
            {createUserMutation.isPending ? "Creating..." : "Create user"}
          </Button>
        </form>
      </article>

      <article className="card p-5">
        <h2 className="text-lg font-bold">Ensure Wallets</h2>
        <p className="mt-1 text-sm text-muted">
          Admin endpoint: POST /wallets/:userId
        </p>

        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            ensureWalletsMutation.mutate(userId);
          }}
        >
          <Input
            placeholder="User ID"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={ensureWalletsMutation.isPending}
          >
            {ensureWalletsMutation.isPending
              ? "Provisioning..."
              : "Ensure wallets"}
          </Button>
        </form>
      </article>
    </section>
  );
}
