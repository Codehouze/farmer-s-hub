"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validations";

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseForm(formData: FormData) {
  return {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    price: String(formData.get("price") || ""),
    unit: String(formData.get("unit") || "kg"),
    quantityAvail: String(formData.get("quantityAvail") || ""),
    location: String(formData.get("location") || ""),
    imageUrl: String(formData.get("imageUrl") || ""),
    categoryId: String(formData.get("categoryId") || ""),
    available: formData.get("available") === "on",
  };
}

function toFieldErrors(error: ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/products/new");
  if (session.user.role !== "FARMER") redirect("/dashboard");

  const raw = parseForm(formData);
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: toFieldErrors(parsed.error) };
  }

  await prisma.product.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price,
      unit: parsed.data.unit,
      quantityAvail: parsed.data.quantityAvail,
      location: parsed.data.location,
      imageUrl: parsed.data.imageUrl || null,
      available: parsed.data.available ?? true,
      categoryId: parsed.data.categoryId || null,
      farmerId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  if (session.user.role !== "FARMER") redirect("/dashboard");

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing || existing.farmerId !== session.user.id) {
    redirect("/dashboard");
  }

  const raw = parseForm(formData);
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Please fix the errors below.", fieldErrors: toFieldErrors(parsed.error) };
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      price: parsed.data.price,
      unit: parsed.data.unit,
      quantityAvail: parsed.data.quantityAvail,
      location: parsed.data.location,
      imageUrl: parsed.data.imageUrl || null,
      available: parsed.data.available ?? true,
      categoryId: parsed.data.categoryId || null,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteProductAction(productId: string) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  if (session.user.role !== "FARMER") redirect("/dashboard");

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing || existing.farmerId !== session.user.id) {
    redirect("/dashboard");
  }

  const orderCount = await prisma.order.count({ where: { productId } });

  if (orderCount > 0) {
    // This product has order history (a buyer's or the farmer's own
    // records) - deleting it would cascade-fail at the DB level, so
    // delist it instead of destroying that history.
    await prisma.product.update({
      where: { id: productId },
      data: { available: false },
    });
    revalidatePath("/dashboard");
    redirect("/dashboard?notice=delisted");
  }

  await prisma.product.delete({ where: { id: productId } });

  revalidatePath("/dashboard");
  redirect("/dashboard?notice=deleted");
}
