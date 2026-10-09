import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Call at the top of every /admin page/Server Action. Redirects unauthenticated
 * users to login (with a callback back to the admin page they wanted), and
 * sends anyone who isn't an ADMIN back to their own dashboard rather than
 * exposing a 403 with no escape hatch.
 */
export async function requireAdmin(callbackPath = "/admin") {
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session;
}
