"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { adminSetOrderStatus } from "@/lib/orders";

export async function adminUpdateOrderStatusAction(
  orderId: string,
  formData: FormData
) {
  await requireAdmin("/admin/orders");

  const status = String(formData.get("status") || "");
  await adminSetOrderStatus(orderId, status);

  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
