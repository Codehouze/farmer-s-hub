import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { placeOrder } from "@/lib/orders";

const orderSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  note: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (session.user.role !== "BUYER") {
    return NextResponse.json(
      { error: "Only buyers can place orders" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { productId, quantity, note } = parsed.data;

  const result = await placeOrder(productId, session.user.id, quantity, note);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.code });
  }

  return NextResponse.json({ order: result.order }, { status: 201 });
}
