"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { Prisma, Role } from "@/app/generated/prisma/client";

const ROLES: Role[] = ["FARMER", "BUYER", "ADMIN"];

export async function changeUserRoleAction(userId: string, formData: FormData) {
  const session = await requireAdmin("/admin/users");

  if (userId === session.user.id) {
    redirect("/admin/users?notice=self-role-error");
  }

  const role = String(formData.get("role") || "");
  if (!ROLES.includes(role as Role)) {
    redirect("/admin/users?notice=invalid-role");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: role as Role },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?notice=role-updated");
}

export async function deleteUserAction(userId: string) {
  const session = await requireAdmin("/admin/users");

  if (userId === session.user.id) {
    redirect("/admin/users?notice=self-delete-error");
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2003"
    ) {
      // Deleting this user would cascade into a product that has order
      // history, which is protected (Order.product is onDelete: Restrict).
      redirect("/admin/users?notice=delete-blocked");
    }
    throw err;
  }

  revalidatePath("/admin/users");
  redirect("/admin/users?notice=user-deleted");
}
