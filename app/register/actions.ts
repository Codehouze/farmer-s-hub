"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { registerUser } from "@/lib/register";

export type RegisterState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
    role: String(formData.get("role") || "BUYER"),
    phone: String(formData.get("phone") || ""),
    location: String(formData.get("location") || ""),
    companyName: String(formData.get("companyName") || ""),
    bio: String(formData.get("bio") || ""),
  };

  const result = await registerUser(raw);

  if (!result.ok) {
    return { error: result.error, fieldErrors: result.fieldErrors, values: raw };
  }

  try {
    await signIn("credentials", {
      email: raw.email,
      password: raw.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Account created, but automatic sign-in failed. Please log in.",
        values: raw,
      };
    }
    throw error;
  }

  redirect("/dashboard");
}
