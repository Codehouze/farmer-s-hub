import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Register — Farmers Hub",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const defaultRole = role?.toLowerCase() === "farmer" ? "FARMER" : "BUYER";

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-primary">Create your account</h1>
        <p className="mt-1 text-sm text-muted">
          Join Farmers Hub as a buyer or sell your produce as a farmer.
        </p>
      </div>
      <div className="rounded-xl border border-cream-dark bg-white p-6 shadow-sm sm:p-8">
        <RegisterForm defaultRole={defaultRole} />
      </div>
    </div>
  );
}
