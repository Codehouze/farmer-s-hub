"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";
import { registerAction, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export function RegisterForm({ defaultRole }: { defaultRole: "FARMER" | "BUYER" }) {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [role, setRole] = useState<"FARMER" | "BUYER">(defaultRole);

  const fieldErrors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="role" value={role} />

      <div className="grid grid-cols-2 gap-1 rounded-lg bg-cream p-1">
        <button
          type="button"
          onClick={() => setRole("BUYER")}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
            role === "BUYER" ? "bg-white text-primary shadow-sm" : "text-muted"
          }`}
        >
          I&apos;m a Buyer
        </button>
        <button
          type="button"
          onClick={() => setRole("FARMER")}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
            role === "FARMER" ? "bg-white text-primary shadow-sm" : "text-muted"
          }`}
        >
          I&apos;m a Farmer
        </button>
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <Field
        label="Full name"
        name="name"
        defaultValue={values.name}
        error={fieldErrors.name}
        required
      />
      <Field
        label="Email address"
        name="email"
        type="email"
        defaultValue={values.email}
        error={fieldErrors.email}
        required
      />
      <Field
        label="Password"
        name="password"
        type="password"
        error={fieldErrors.password}
        required
      />
      <Field
        label="Phone number"
        name="phone"
        defaultValue={values.phone}
        error={fieldErrors.phone}
      />
      <Field
        label="Location"
        name="location"
        placeholder="e.g. Kigali"
        defaultValue={values.location}
        error={fieldErrors.location}
      />

      {role === "FARMER" && (
        <>
          <Field
            label="Farm / Company name"
            name="companyName"
            defaultValue={values.companyName}
            error={fieldErrors.companyName}
          />
          <div>
            <label htmlFor="bio" className="mb-1 block text-sm font-medium text-foreground">
              Short bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={values.bio}
              className="w-full rounded-md border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Tell buyers a bit about your farm"
            />
          </div>
        </>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-md border border-cream-dark bg-white px-3 py-2 text-sm outline-none focus:border-primary"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
