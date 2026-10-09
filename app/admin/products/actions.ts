"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function toggleProductAvailabilityAction(
  productId: string,
  formData: FormData
) {
  await requireAdmin("/admin/products");

  const available = formData.get("available") === "true";

  await prisma.product.update({
    where: { id: productId },
    data: { available },
  });

  revalidatePath("/admin/products");
}

export async function adminDeleteProductAction(productId: string) {
  await requireAdmin("/admin/products");

  const orderCount = await prisma.order.count({ where: { productId } });

  if (orderCount > 0) {
    // Mirrors the farmer-facing delete action: a product with order
    // history can't be hard-deleted (Order.product is onDelete: Restrict),
    // so delist it instead of destroying that history.
    await prisma.product.update({
      where: { id: productId },
      data: { available: false },
    });
    revalidatePath("/admin/products");
    redirect("/admin/products?notice=delisted");
  }

  await prisma.product.delete({ where: { id: productId } });

  revalidatePath("/admin/products");
  redirect("/admin/products?notice=deleted");
}
