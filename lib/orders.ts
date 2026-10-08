import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@/app/generated/prisma/client";

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

// Forward transitions only - once an order reaches a terminal state
// (COMPLETED/CANCELLED) or a farmer has confirmed it, it can't be rewound.
const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export type PlaceOrderResult =
  | { ok: true; order: { id: string } }
  | { ok: false; error: string; code: 400 | 404 };

/**
 * Shared order-creation logic, used by the product detail page's Server
 * Action and by the POST /api/orders route. Atomically checks and
 * decrements the product's available quantity inside a transaction so
 * concurrent orders can't oversell stock.
 */
export async function placeOrder(
  productId: string,
  buyerId: string,
  quantity: number,
  note?: string
): Promise<PlaceOrderResult> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { available: true },
  });

  if (!product) {
    return { ok: false, error: "Product not found", code: 404 };
  }

  if (!product.available) {
    return { ok: false, error: "Product is not available", code: 400 };
  }

  const order = await prisma.$transaction(async (tx) => {
    // Guarding the decrement with quantityAvail >= quantity in the WHERE
    // clause makes this atomic: only one of several concurrent requests
    // racing for the last units can match and succeed.
    const updated = await tx.product.updateMany({
      where: { id: productId, available: true, quantityAvail: { gte: quantity } },
      data: { quantityAvail: { decrement: quantity } },
    });

    if (updated.count === 0) {
      return null;
    }

    return tx.order.create({
      data: { quantity, note, productId, buyerId },
    });
  });

  if (!order) {
    return { ok: false, error: "Quantity exceeds what's available", code: 400 };
  }

  return { ok: true, order };
}

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

  if (!ALLOWED_STATUS_TRANSITIONS[order.status].includes(status as OrderStatus)) {
    return {
      ok: false,
      error: `Cannot change status from ${order.status} to ${status}`,
      code: 400,
    };
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });

  return { ok: true, order: updated };
}
