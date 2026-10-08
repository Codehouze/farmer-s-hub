"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.email}
          required
          className="w-full rounded-md border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Logging in..." : "Log in"}
      </Button>

      <p className="text-center text-sm text-muted">
        New to Farmers Hub?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
