import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Log In — Farmers Hub",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">
          Log in to manage your products and orders.
        </p>
      </div>
      <div className="rounded-xl border border-cream-dark bg-white p-6 shadow-sm sm:p-8">
        <LoginForm callbackUrl={callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard"} />
      </div>
    </div>
  );
}
