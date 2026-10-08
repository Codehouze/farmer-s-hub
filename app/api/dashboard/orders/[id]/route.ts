import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { setOrderStatus } from "@/lib/orders";

/**
 * PATCH /api/dashboard/orders/[id]
 * Body: { status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" }
 *
 * The dashboard UI itself updates order status through a Server Action
 * (app/dashboard/actions.ts#updateOrderStatusAction) so the status form
 * works without client JS. This route exposes the same operation over a
 * plain JSON API for external/API consumers and testability, sharing the
 * ownership-check logic via lib/orders.ts#setOrderStatus.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "FARMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = typeof body?.status === "string" ? body.status : undefined;

  if (!status) {
    return NextResponse.json({ error: "Missing status" }, { status: 400 });
  }

  const result = await setOrderStatus(id, session.user.id, status);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.code });
  }

  return NextResponse.json({ order: result.order });
}
