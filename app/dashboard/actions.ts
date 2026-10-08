"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { setOrderStatus } from "@/lib/orders";

/**
 * Order-status updates are driven by a plain Server Action form (progressive
 * enhancement, no client JS needed) bound to the order id via
 * `updateOrderStatusAction.bind(null, order.id)`. The same ownership-check
 * logic is shared with PATCH /api/dashboard/orders/[id] through
 * `lib/orders.ts#setOrderStatus`, which is used there for API/testable access.
 */
export async function updateOrderStatusAction(orderId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }
  if (session.user.role !== "FARMER") {
    redirect("/dashboard");
  }

  const status = String(formData.get("status") || "");
  await setOrderStatus(orderId, session.user.id, status);

  revalidatePath("/dashboard");
}
