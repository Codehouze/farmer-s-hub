import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { Prisma } from "@/app/generated/prisma/client";

const DUPLICATE_EMAIL_RESULT: RegisterResult = {
  ok: false,
  error: "An account with this email already exists.",
  fieldErrors: { email: "An account with this email already exists." },
};

export type RegisterResult =
  | { ok: true; userId: string }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string>;
    };

/**
 * Shared registration logic used by both the `/register` page's Server
 * Action and the `/api/register` route handler, so the validation schema
 * and business rules only live in one place.
 */
export async function registerUser(input: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: "Please fix the errors below.", fieldErrors };
  }

  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return DUPLICATE_EMAIL_RESULT;
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        phone: data.phone || null,
        location: data.location || null,
        companyName: data.role === "FARMER" ? data.companyName || null : null,
        bio: data.role === "FARMER" ? data.bio || null : null,
      },
    });

    return { ok: true, userId: user.id };
  } catch (err) {
    // The findUnique check above has a TOCTOU race: two concurrent
    // registrations with the same email can both pass it before either
    // insert lands. The unique constraint on User.email is the real
    // guard - catch its violation here instead of letting it surface as
    // an unhandled 500.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return DUPLICATE_EMAIL_RESULT;
    }
    throw err;
  }
}
