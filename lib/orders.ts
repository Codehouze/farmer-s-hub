import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/app/generated/prisma/client";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

export type SetOrderStatusResult =
  | { ok: true; order: { id: string; status: OrderStatus } }
  | { ok: false; error: string; code: 400 | 403 | 404 };

/**
 * Shared order-status-update logic, used by the dashboard's Server Action
 * (progressive-enhancement form, no client JS required) and by the
 * PATCH /api/dashboard/orders/[id] route (for external/API consumers).
 * Verifies the requesting farmer actually owns the product the order is for.
 */
export async function setOrderStatus(
  orderId: string,
  farmerId: string,
  status: string
): Promise<SetOrderStatusResult> {
  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    return { ok: false, error: "Invalid status", code: 400 };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true },
  });

  if (!order) {
    return { ok: false, error: "Order not found", code: 404 };
  }

  if (order.product.farmerId !== farmerId) {
    return { ok: false, error: "You do not own the product for this order", code: 403 };
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });

  return { ok: true, order: updated };
}
