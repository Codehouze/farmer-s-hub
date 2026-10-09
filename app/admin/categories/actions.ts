"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { Prisma } from "@/app/generated/prisma/client";

const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters");

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin("/admin/categories");

  const parsed = nameSchema.safeParse(formData.get("name"));
  if (!parsed.success) {
    redirect("/admin/categories?notice=invalid-name");
  }

  const name = parsed.data;
  const slug = slugify(name);

  try {
    await prisma.category.create({ data: { name, slug } });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      redirect("/admin/categories?notice=duplicate-name");
    }
    throw err;
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories?notice=category-created");
}

export async function deleteCategoryAction(categoryId: string) {
  await requireAdmin("/admin/categories");

  // Product.categoryId -> Category is onDelete: SetNull, so this just
  // un-categorizes any products that were using it rather than failing.
  await prisma.category.delete({ where: { id: categoryId } });

  revalidatePath("/admin/categories");
  redirect("/admin/categories?notice=category-deleted");
}
